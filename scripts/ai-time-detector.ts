export type TimeOfDay = 'sang' | 'trua' | 'chieu' | 'toi' | 'bat_ky';

/**
 * Detect time of day for a prayer based on Gemini AI (if GEMINI_API_KEY is configured)
 * or smart Vietnamese rule-based keyword matching as fallback.
 */
export async function detectTimeOfDay(title: string, content: string, category: string = ''): Promise<TimeOfDay> {
  const combinedText = `${title} ${category} ${content}`.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là trợ lý Công Giáo. Hãy phân tích bài cầu nguyện sau và xác định xem nó phù hợp nhất với khung giờ nào trong ngày: 'sang' (Buổi sáng/bình minh/khi thức dậy), 'trua' (Buổi trưa/nghỉ trưa/giờ thứ 6), 'chieu' (Buổi chiều/tan sở/sau chuyến đi), 'toi' (Buổi tối/trước khi đi ngủ/cuối ngày), hoặc 'bat_ky' (Phù hợp mọi thời điểm trong ngày).
Chỉ trả về DUY NHẤT 1 trong 5 từ: sang, trua, chieu, toi, bat_ky.

Tiêu đề: ${title}
Danh mục: ${category}
Nội dung: ${content.replace(/<[^>]*>?/gm, '').slice(0, 300)}`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
        if (['sang', 'trua', 'chieu', 'toi', 'bat_ky'].includes(rawText)) {
          return rawText as TimeOfDay;
        }
      }
    } catch (err) {
      console.warn('⚠️ Gemini AI detection failed, using rule-based fallback:', err);
    }
  }

  // --- Rule-based fallback ---
  if (
    combinedText.includes('buổi sáng') ||
    combinedText.includes('bình minh') ||
    combinedText.includes('khi thức dậy') ||
    combinedText.includes('ngày mới') ||
    combinedText.includes('bắt đầu ngày') ||
    combinedText.includes('trước khi đi làm') ||
    combinedText.includes('trước khi đi học')
  ) {
    return 'sang';
  }

  if (
    combinedText.includes('buổi trưa') ||
    combinedText.includes('giờ thứ sáu') ||
    combinedText.includes('giữa ngày') ||
    combinedText.includes('nghỉ trưa')
  ) {
    return 'trua';
  }

  if (
    combinedText.includes('buổi chiều') ||
    combinedText.includes('bóng xế') ||
    combinedText.includes('tan sở') ||
    combinedText.includes('sau chuyến đi') ||
    combinedText.includes('giờ thứ chín')
  ) {
    return 'chieu';
  }

  if (
    combinedText.includes('buổi tối') ||
    combinedText.includes('đi ngủ') ||
    combinedText.includes('đêm') ||
    combinedText.includes('cuối ngày') ||
    combinedText.includes('hoàng hôn') ||
    combinedText.includes('tạ ơn ngày')
  ) {
    return 'toi';
  }

  return 'bat_ky';
}
