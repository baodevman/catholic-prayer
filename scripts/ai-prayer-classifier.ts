import type { UserRole } from '../src/utils/storage';

export type TimeOfDay = 'sang' | 'trua' | 'chieu' | 'toi' | 'bat_ky';

export interface PrayerClassificationResult {
  timeOfDay: TimeOfDay;
  roles: UserRole[];
}

/**
  AI Classifier cho Lời Cầu Nguyện Công Giáo.
 * 1. Gọi Gemini AI API (gemini-1.5-flash / gemini-2.0-flash) nếu có GEMINI_API_KEY hoặc GOOGLE_AI_API_KEY.
 * 2. Tự động dự phòng sang Lớp 2 (Smart Rule-based Fallback) nếu không có API Key hoặc mất kết nối mạng.
 */
export async function classifyPrayerWithAI(
  title: string,
  content: string,
  category: string = ''
): Promise<PrayerClassificationResult> {
  const combinedText = `${title} ${category} ${content}`.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (apiKey) {
    try {
      const promptText = `Bạn là chuyên gia thần học Công Giáo. Hãy đọc lời cầu nguyện sau và xác định 2 thông tin:
1. "timeOfDay": Khung giờ phù hợp nhất: "sang" (bình minh/ngày mới/thức dậy), "trua" (giờ thứ 6/trưa), "chieu" (chiều/tan sở/sau chuyến đi), "toi" (tối/trước khi ngủ/đêm), hoặc "bat_ky" (phù hợp mọi lúc).
2. "roles": Danh sách mảng các vai trò sống phù hợp (chọn 1 hoặc nhiều từ: "student" [học sinh/sinh viên/thi cử], "worker" [người đi làm/công sở/nông gia], "family" [gia đình/vợ chồng/con cái/cha mẹ], "single" [người độc thân/ơn gọi/sống một mình], "elderly" [người cao tuổi/tuổi già], "sick" [người bệnh/sức khỏe]). Nếu phù hợp tất cả, trả về ["bat_ky"].

Tiêu đề lời nguyện: ${title}
Danh mục: ${category}
Nội dung: ${content.replace(/<[^>]*>?/gm, '').slice(0, 400)}

CHỈ TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON ĐÚNG ĐỊNH DẠNG:
{"timeOfDay": "...", "roles": ["..."]}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const validTimes: TimeOfDay[] = ['sang', 'trua', 'chieu', 'toi', 'bat_ky'];
          const validRoles: UserRole[] = ['student', 'worker', 'family', 'single', 'elderly', 'sick'];

          const timeOfDay = validTimes.includes(parsed.timeOfDay) ? parsed.timeOfDay : 'bat_ky';
          const roles = Array.isArray(parsed.roles)
            ? parsed.roles.filter((r: any) => validRoles.includes(r))
            : ['bat_ky'];

          return {
            timeOfDay,
            roles: roles.length > 0 ? roles : ['worker']
          };
        }
      }
    } catch (err) {
      console.warn('⚠️ [AI Classifier Warning] Phân loại bằng Gemini AI gặp sự cố, sử dụng Rule-based Fallback:', err);
    }
  }

  // --- Rule-based Fallback ---
  let timeOfDay: TimeOfDay = 'bat_ky';
  if (
    combinedText.includes('buổi sáng') ||
    combinedText.includes('bình minh') ||
    combinedText.includes('khi thức dậy') ||
    combinedText.includes('ngày mới') ||
    combinedText.includes('trước khi đi làm') ||
    combinedText.includes('trước khi đi học')
  ) {
    timeOfDay = 'sang';
  } else if (
    combinedText.includes('buổi trưa') ||
    combinedText.includes('giờ thứ sáu') ||
    combinedText.includes('nghỉ trưa')
  ) {
    timeOfDay = 'trua';
  } else if (
    combinedText.includes('buổi chiều') ||
    combinedText.includes('tan sở') ||
    combinedText.includes('sau chuyến đi')
  ) {
    timeOfDay = 'chieu';
  } else if (
    combinedText.includes('buổi tối') ||
    combinedText.includes('đi ngủ') ||
    combinedText.includes('đêm') ||
    combinedText.includes('cuối ngày') ||
    combinedText.includes('tạ ơn ngày')
  ) {
    timeOfDay = 'toi';
  }

  const detectedRoles: UserRole[] = [];
  if (combinedText.includes('học') || combinedText.includes('thi') || combinedText.includes('lớp') || combinedText.includes('trí tuệ')) {
    detectedRoles.push('student');
  }
  if (combinedText.includes('làm') || combinedText.includes('công việc') || combinedText.includes('công sở') || combinedText.includes('lao động')) {
    detectedRoles.push('worker');
  }
  if (combinedText.includes('gia đình') || combinedText.includes('cha mẹ') || combinedText.includes('con cái') || combinedText.includes('vợ chồng')) {
    detectedRoles.push('family');
  }
  if (combinedText.includes('độc thân') || combinedText.includes('ơn gọi') || combinedText.includes('tương lai')) {
    detectedRoles.push('single');
  }
  if (combinedText.includes('lớn tuổi') || combinedText.includes('người già') || combinedText.includes('tuổi già') || combinedText.includes('ông bà')) {
    detectedRoles.push('elderly');
  }
  if (combinedText.includes('bệnh') || combinedText.includes('sức khỏe') || combinedText.includes('đau yếu')) {
    detectedRoles.push('sick');
  }

  return {
    timeOfDay,
    roles: detectedRoles.length > 0 ? detectedRoles : ['worker']
  };
}
