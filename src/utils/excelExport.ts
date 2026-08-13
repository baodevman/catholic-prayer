// --- Excel CSV Exporter for Personal Custom Prayers ---

export interface ExportableCustomPrayer {
  uid: string;
  title: string;
  category: string;
  content: string;
  isPrivate?: boolean;
}

export const exportCustomPrayersToExcel = (prayers: ExportableCustomPrayer[]): void => {
  if (!prayers || prayers.length === 0) {
    alert('Bạn chưa có lời nguyện cá nhân nào để trích xuất.');
    return;
  }

  // Create CSV Header and Rows
  const headers = ['Mã Lời Nguyện (UID)', 'Tiêu Đề', 'Danh Mục', 'Trạng Thái', 'Nội Dung'];
  const rows = prayers.map(p => [
    `"${p.uid.replace(/"/g, '""')}"`,
    `"${p.title.replace(/"/g, '""')}"`,
    `"${(p.category || 'Kinh Nguyện').replace(/"/g, '""')}"`,
    `"${p.isPrivate ? 'Riêng tư' : 'Công cộng'}"`,
    `"${p.content.replace(/<[^>]*>?/gm, '').replace(/"/g, '""')}"`
  ]);

  // Prepend UTF-8 BOM (\uFEFF) so Excel opens Vietnamese diacritics correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `loi_nguyen_ca_nhan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
