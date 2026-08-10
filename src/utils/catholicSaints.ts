export interface CatholicSaint {
  id: string;
  name: string; // e.g. "Thánh Cả Giuse"
  saintTitle: string; // e.g. "Thánh Giuse, Bạn Trăm Năm Đức Mẹ"
  date: string; // Format: "MM-DD" (e.g. "03-19")
  month: number;
  day: number;
  type: 'solemnity' | 'feast' | 'memorial' | 'commemoration'; // Lễ Trọng, Lễ Kính, Lễ Nhớ, Lễ Cầu cho các linh hồn
  description: string;
}

export const CATHOLIC_SAINTS: CatholicSaint[] = [
  // --- Tháng 1 ---
  {
    id: 'mary-mother-of-god',
    name: 'Đức Mẹ Maria - Mẹ Thiên Chúa',
    saintTitle: 'Lễ Đức Mẹ là Mẹ Thiên Chúa',
    date: '01-01',
    month: 1,
    day: 1,
    type: 'solemnity',
    description: 'Lễ Trọng cầu xin bình an năm mới và dâng gia đình dưới sự chở che của Đức Mẹ.'
  },
  {
    id: 'st-agnes',
    name: 'Thánh Anê',
    saintTitle: 'Thánh Anê, Trinh nữ Tử đạo',
    date: '01-21',
    month: 1,
    day: 21,
    type: 'memorial',
    description: 'Quan thầy các thiếu nữ và các tâm hồn trong sạch.'
  },
  {
    id: 'st-paul-conversion',
    name: 'Thánh Phaolô (Trở lại)',
    saintTitle: 'Lễ Thánh Phaolô Tông Đồ Trở Lại',
    date: '01-25',
    month: 1,
    day: 25,
    type: 'feast',
    description: 'Kính nhớ ơn trở lại vĩ đại của Thánh Phaolô Tông đồ.'
  },
  {
    id: 'st-john-bosco',
    name: 'Thánh Gioan Bosco',
    saintTitle: 'Thánh Gioan Bosco, Linh mục',
    date: '01-31',
    month: 1,
    day: 31,
    type: 'memorial',
    description: 'Cha và Thầy của giới trẻ, quan thầy các giáo lý viên và thanh thiếu niên.'
  },

  // --- Tháng 2 ---
  {
    id: 'presentation-of-lord',
    name: 'Lễ Dâng Chúa Trong Đền Thờ',
    saintTitle: 'Lễ Nến - Dâng Chúa Trong Đền Thánh',
    date: '02-02',
    month: 2,
    day: 2,
    type: 'feast',
    description: 'Kính nhớ Mẹ Maria dâng Hài Nhi Giêsu trong Đền Thánh.'
  },
  {
    id: 'our-lady-of-lourdes',
    name: 'Đức Mẹ Lộ Đức',
    saintTitle: 'Đức Mẹ Lộ Đức - Ngày Quốc Tế Bệnh Nhân',
    date: '02-11',
    month: 2,
    day: 11,
    type: 'memorial',
    description: 'Kính Đức Mẹ hiện ra tại Lộ Đức, ngày cầu nguyện cho các bệnh nhân.'
  },
  {
    id: 'st-matthias',
    name: 'Thánh Matthia',
    saintTitle: 'Thánh Matthia Tông Đồ',
    date: '02-14',
    month: 2,
    day: 14,
    type: 'feast',
    description: 'Quan thầy người lao động và chọn thế vị Tông đồ.'
  },

  // --- Tháng 3 ---
  {
    id: 'st-joseph',
    name: 'Thánh Giuse',
    saintTitle: 'Thánh Giuse, Bạn Trăm Năm Đức Mẹ',
    date: '03-19',
    month: 3,
    day: 19,
    type: 'solemnity',
    description: 'Lễ Trọng kính Thánh Giuse quan thầy Hội Thánh, các gia đình và người gia trưởng.'
  },
  {
    id: 'annunciation',
    name: 'Lễ Truyền Tin',
    saintTitle: 'Lễ Truyền Tin Cho Đức Mẹ',
    date: '03-25',
    month: 3,
    day: 25,
    type: 'solemnity',
    description: 'Sứ thần Gabriên truyền tin cho Đức Mẹ Maria cưu mang Con Thiên Chúa.'
  },

  // --- Tháng 4 ---
  {
    id: 'st-mark',
    name: 'Thánh Mác-cô',
    saintTitle: 'Thánh Mác-cô, Tác giả Tin Mừng',
    date: '04-25',
    month: 4,
    day: 25,
    type: 'feast',
    description: 'Tác giả sách Tin Mừng Mác-cô.'
  },
  {
    id: 'st-catherine-siena',
    name: 'Thánh Catarina Siêna',
    saintTitle: 'Thánh Catarina Siêna, Trinh nữ Tiến sĩ',
    date: '04-29',
    month: 4,
    day: 29,
    type: 'memorial',
    description: 'Tiến sĩ Hội Thánh, quan thầy Châu Âu và các nữ tu.'
  },

  // --- Tháng 5 ---
  {
    id: 'st-joseph-worker',
    name: 'Thánh Giuse Thợ',
    saintTitle: 'Thánh Giuse Lao Động',
    date: '05-01',
    month: 5,
    day: 1,
    type: 'memorial',
    description: 'Quan thầy giới lao động, công nhân và anh chị em làm việc tay chân.'
  },
  {
    id: 'st-philip-james',
    name: 'Thánh Philiphê & Thánh Gia-cô-bê',
    saintTitle: 'Thánh Philiphê và Thánh Gia-cô-bê Tông Đồ',
    date: '05-03',
    month: 5,
    day: 3,
    type: 'feast',
    description: 'Hai Tông đồ đồng hành cùng Chúa Giêsu.'
  },
  {
    id: 'our-lady-of-fatima',
    name: 'Đức Mẹ Fatima',
    saintTitle: 'Lễ Đức Mẹ Hiện Ra Tại Fatima',
    date: '05-13',
    month: 5,
    day: 13,
    type: 'memorial',
    description: 'Kính nhớ Đức Mẹ hiện ra lần đầu tại Fatima năm 1917 nhắn bảo siêng năng đọc Kinh Mân Côi.'
  },
  {
    id: 'visitation-of-mary',
    name: 'Đức Mẹ Thăm Viếng',
    saintTitle: 'Lễ Đức Mẹ Thăm Viếng Bà Thánh Isave',
    date: '05-31',
    month: 5,
    day: 31,
    type: 'feast',
    description: 'Đức Mẹ vội vã lên đường thăm viếng và giúp đỡ người chị họ Isave.'
  },

  // --- Tháng 6 ---
  {
    id: 'st-anthony-padua',
    name: 'Thánh Antôn Padua',
    saintTitle: 'Thánh Antôn Padua, Linh mục Tiến sĩ',
    date: '06-13',
    month: 6,
    day: 13,
    type: 'memorial',
    description: 'Hay làm phép lạ, quan thầy các đồ vật thất lạc và người nghèo khổ.'
  },
  {
    id: 'st-john-baptist',
    name: 'Thánh Gioan Baotixita',
    saintTitle: 'Lễ Sinh Nhật Thánh Gioan Baotixita',
    date: '06-24',
    month: 6,
    day: 24,
    type: 'solemnity',
    description: 'Đấng Tiền Cung dọn đường cho Chúa Cứu Thế.'
  },
  {
    id: 'st-peter-paul',
    name: 'Thánh Phêrô & Thánh Phaolô',
    saintTitle: 'Thánh Phêrô và Thánh Phaolô Tông Đồ',
    date: '06-29',
    month: 6,
    day: 29,
    type: 'solemnity',
    description: 'Lễ Trọng hai trụ cột vĩ đại của Giáo Hội Công Giáo.'
  },

  // --- Tháng 7 ---
  {
    id: 'st-thomas-apostle',
    name: 'Thánh Tôma Tông Đồ',
    saintTitle: 'Thánh Tôma Tông Đồ',
    date: '07-03',
    month: 7,
    day: 3,
    type: 'feast',
    description: 'Tông đồ tuyên bố niềm tin: "Lạy Chúa của con, lạy Thiên Chúa của con!".'
  },
  {
    id: 'st-benedict',
    name: 'Thánh Biển Đức',
    saintTitle: 'Thánh Biển Đức, Đan sĩ',
    date: '07-11',
    month: 7,
    day: 11,
    type: 'memorial',
    description: 'Cha đẻ đời sống đan tu Tây Phương, quan thầy Châu Âu.'
  },
  {
    id: 'st-mary-magdalene',
    name: 'Thánh Maria Ma-đa-lê-na',
    saintTitle: 'Thánh Maria Ma-đa-lê-na',
    date: '07-22',
    month: 7,
    day: 22,
    type: 'feast',
    description: 'Người đầu tiên loan báo tin mừng Chúa Phục Sinh.'
  },
  {
    id: 'st-james-apostle',
    name: 'Thánh Gia-cô-bê Tông Đồ',
    saintTitle: 'Thánh Gia-cô-bê Tông Đồ (Tiền)',
    date: '07-25',
    month: 7,
    day: 25,
    type: 'feast',
    description: 'Quan thầy các người hành hương.'
  },
  {
    id: 'st-anne-joachim',
    name: 'Thánh Gio-a-kim & Thánh An-na',
    saintTitle: 'Thánh Gio-a-kim và Thánh An-na',
    date: '07-26',
    month: 7,
    day: 26,
    type: 'memorial',
    description: 'Ông bà ngoại của Chúa Giêsu, cha mẹ Đức Mẹ Maria, quan thầy ông bà lớn tuổi.'
  },
  {
    id: 'st-martha',
    name: 'Thánh Mát-ta',
    saintTitle: 'Thánh Mát-ta, Maria và La-za-rô',
    date: '07-29',
    month: 7,
    day: 29,
    type: 'memorial',
    description: 'Gia đình bạn hữu ân cần đón tiếp Chúa Giêsu tại Bêtania.'
  },
  {
    id: 'st-ignatius-loyola',
    name: 'Thánh Inhaxiô Loyola',
    saintTitle: 'Thánh Inhaxiô Loyola, Linh mục',
    date: '07-31',
    month: 7,
    day: 31,
    type: 'memorial',
    description: 'Đấng sáng lập Dòng Tên (SJ), quan thầy Linh Thao.'
  },

  // --- Tháng 8 ---
  {
    id: 'st-alphonsus',
    name: 'Thánh An-phong-sô',
    saintTitle: 'Thánh An-phong-sô Liguori, Giám mục Tiến sĩ',
    date: '08-01',
    month: 8,
    day: 1,
    type: 'memorial',
    description: 'Đấng sáng lập Dòng Chúa Hằng Cứu Giúp (CSsR).'
  },
  {
    id: 'st-john-vianney',
    name: 'Thánh Gioan Vianney',
    saintTitle: 'Thánh Gioan Vianney (Cha Xứ Họ Ars)',
    date: '08-04',
    month: 8,
    day: 4,
    type: 'memorial',
    description: 'Quan thầy các cha xứ và các linh mục trên toàn thế giới.'
  },
  {
    id: 'st-dominic',
    name: 'Thánh Đa Minh',
    saintTitle: 'Thánh Đa Minh, Linh mục',
    date: '08-08',
    month: 8,
    day: 8,
    type: 'memorial',
    description: 'Đấng sáng lập Dòng Anh Em Thuyết Giáo (Dòng Đa Minh), truyền bá Kinh Mân Côi.'
  },
  {
    id: 'st-lawrence',
    name: 'Thánh Lô-ren-sô',
    saintTitle: 'Thánh Lô-ren-sô, Phó tế Tử đạo',
    date: '08-10',
    month: 8,
    day: 10,
    type: 'feast',
    description: 'Quan thầy các phó tế và người nghèo.'
  },
  {
    id: 'assumption-of-mary',
    name: 'Đức Mẹ Hồn Xác Lên Trời',
    saintTitle: 'Lễ Đức Mẹ Hồn Xác Lên Trời',
    date: '08-15',
    month: 8,
    day: 15,
    type: 'solemnity',
    description: 'Lễ Trọng kính Đức Mẹ được đưa cả hồn lẫn xác về Thiên Quốc.'
  },
  {
    id: 'st-bartholomew',
    name: 'Thánh Ba-tô-lô-mê-ô',
    saintTitle: 'Thánh Ba-tô-lô-mê-ô Tông Đồ',
    date: '08-24',
    month: 8,
    day: 24,
    type: 'feast',
    description: 'Tông đồ chân thật không chút gian dối.'
  },
  {
    id: 'st-monica',
    name: 'Thánh Mô-ni-ca',
    saintTitle: 'Thánh Mô-ni-ca',
    date: '08-27',
    month: 8,
    day: 27,
    type: 'memorial',
    description: 'Gương mẫu các bà mẹ Công giáo kiên trì cầu nguyện cho con cái trở lại.'
  },
  {
    id: 'st-augustine',
    name: 'Thánh Âu-gút-ti-nô',
    saintTitle: 'Thánh Âu-gút-ti-nô, Giám mục Tiến sĩ',
    date: '08-28',
    month: 8,
    day: 28,
    type: 'memorial',
    description: 'Tiến sĩ ân sủng vĩ đại của Hội Thánh.'
  },

  // --- Tháng 9 ---
  {
    id: 'nativity-of-mary',
    name: 'Sinh Nhật Đức Mẹ',
    saintTitle: 'Lễ Sinh Nhật Đức Maria',
    date: '09-08',
    month: 9,
    day: 8,
    type: 'feast',
    description: 'Kính mừng ngày Rạng Đông Cứu Độ chào đời.'
  },
  {
    id: 'st-matthew',
    name: 'Thánh Mát-thêu',
    saintTitle: 'Thánh Mát-thêu Tông Đồ Tác Giả Tin Mừng',
    date: '09-21',
    month: 9,
    day: 21,
    type: 'feast',
    description: 'Tác giả sách Tin Mừng Mát-thêu, quan thầy giới kế toán, ngân hàng.'
  },
  {
    id: 'st-archangels',
    name: 'Các Tổng Lãnh Thiên Thần (Mikae, Gabriên, Rafaen)',
    saintTitle: 'Lễ Các Tổng Lãnh Thiên Thần Mikae, Gabriên, Rafaen',
    date: '09-29',
    month: 9,
    day: 29,
    type: 'feast',
    description: 'Ba vị Tổng Lãnh Thiên Thần bảo vệ, truyền tin và chữa lành.'
  },
  {
    id: 'st-jerome',
    name: 'Thánh Giê-rô-ni-mô',
    saintTitle: 'Thánh Giê-rô-ni-mô, Linh mục Tiến sĩ',
    date: '09-30',
    month: 9,
    day: 30,
    type: 'memorial',
    description: 'Đấng dịch bộ Kinh Thánh Vulgate, quan thầy học giả Kinh Thánh.'
  },

  // --- Tháng 10 ---
  {
    id: 'st-therese-lisieux',
    name: 'Thánh Têrêsa Hài Đồng Giêsu',
    saintTitle: 'Thánh Têrêsa Hài Đồng Giêsu, Trinh nữ Tiến sĩ',
    date: '10-01',
    month: 10,
    day: 1,
    type: 'memorial',
    description: 'Con đường thơ ấu thiêng liêng, quan thầy các xứ truyền giáo.'
  },
  {
    id: 'our-lady-of-rosary',
    name: 'Đức Mẹ Mân Côi',
    saintTitle: 'Lễ Đức Mẹ Mân Côi',
    date: '10-07',
    month: 10,
    day: 7,
    type: 'memorial',
    description: 'Kính nhớ sức mạnh cầu nguyện chuỗi Mân Côi.'
  },
  {
    id: 'st-teresa-avila',
    name: 'Thánh Têrêsa Avila',
    saintTitle: 'Thánh Têrêsa Avila, Trinh nữ Tiến sĩ',
    date: '10-15',
    month: 10,
    day: 15,
    type: 'memorial',
    description: 'Đấng cải cách Dòng Cát Minh, nữ Tiến sĩ đầu tiên của Giáo Hội.'
  },
  {
    id: 'st-luke',
    name: 'Thánh Lu-ca',
    saintTitle: 'Thánh Lu-ca Tông Đồ Tác Giả Tin Mừng',
    date: '10-18',
    month: 10,
    day: 18,
    type: 'feast',
    description: 'Tác giả sách Tin Mừng Lu-ca và Công Vụ Tông Đồ, quan thầy y bác sĩ.'
  },
  {
    id: 'st-simon-jude',
    name: 'Thánh Si-mon & Thánh Giu-đa',
    saintTitle: 'Thánh Si-mon và Thánh Giu-đa Tông Đồ',
    date: '10-28',
    month: 10,
    day: 28,
    type: 'feast',
    description: 'Hai Tông đồ ra đi loan báo tin mừng.'
  },

  // --- Tháng 11 ---
  {
    id: 'all-saints',
    name: 'Lễ Các Thánh Nam Nữ',
    saintTitle: 'Lễ Trọng Tất Cả Các Thánh Nam Nữ',
    date: '11-01',
    month: 11,
    day: 1,
    type: 'solemnity',
    description: 'Lễ Trọng tôn vinh toàn thể các Thánh trên thiên đàng.'
  },
  {
    id: 'all-souls',
    name: 'Lễ Cầu Cho Các Tín Hữu Đã Qua Đời',
    saintTitle: 'Lễ Cầu Cho Các Linh Hồn',
    date: '11-02',
    month: 11,
    day: 2,
    type: 'commemoration',
    description: 'Cầu nguyện cho các linh hồn nơi chốn Luyện Hình.'
  },
  {
    id: 'st-martin-porres',
    name: 'Thánh Máctinô',
    saintTitle: 'Thánh Máctinô de Porres, Tu sĩ',
    date: '11-03',
    month: 11,
    day: 3,
    type: 'memorial',
    description: 'Thánh Máctinô da đen, gương mẫu bác ái và khiêm nhường.'
  },
  {
    id: 'st-cecilia',
    name: 'Thánh Xê-xi-li-a',
    saintTitle: 'Thánh Xê-xi-li-a, Trinh nữ Tử đạo',
    date: '11-22',
    month: 11,
    day: 22,
    type: 'memorial',
    description: 'Quan thầy các ca đoàn và âm nhạc thánh.'
  },
  {
    id: 'vietnamese-martyrs',
    name: 'Các Thánh Tử Đạo Việt Nam',
    saintTitle: 'Lễ Trọng Các Thánh Tử Đạo Việt Nam',
    date: '11-24',
    month: 11,
    day: 24,
    type: 'solemnity',
    description: 'Lễ Trọng kính 117 Vị Thánh Tử Đạo Việt Nam quan thầy Giáo Hội Việt Nam.'
  },
  {
    id: 'st-andrew',
    name: 'Thánh An-rê Tông Đồ',
    saintTitle: 'Thánh An-rê Tông Đồ',
    date: '11-30',
    month: 11,
    day: 30,
    type: 'feast',
    description: 'Tông đồ ngư phủ, anh trai Thánh Phêrô.'
  },

  // --- Tháng 12 ---
  {
    id: 'st-francis-xavier',
    name: 'Thánh Phanxicô Xaviê',
    saintTitle: 'Thánh Phanxicô Xaviê, Linh mục',
    date: '12-03',
    month: 12,
    day: 3,
    type: 'feast',
    description: 'Quan thầy các xứ truyền giáo và quan thầy các linh mục Dòng Tên.'
  },
  {
    id: 'immaculate-conception',
    name: 'Đức Mẹ Vô Nhiễm Nguyên Tội',
    saintTitle: 'Lễ Đức Mẹ Vô Nhiễm Nguyên Tội',
    date: '12-08',
    month: 12,
    day: 8,
    type: 'solemnity',
    description: 'Lễ Trọng kính Đức Mẹ được gìn giữ khỏi tội truyền ngay từ trong bụng mẹ.'
  },
  {
    id: 'st-lucy',
    name: 'Thánh Lu-xi-a',
    saintTitle: 'Thánh Lu-xi-a, Trinh nữ Tử đạo',
    date: '12-13',
    month: 12,
    day: 13,
    type: 'memorial',
    description: 'Quan thầy người khiếm thị và các đôi mắt.'
  },
  {
    id: 'st-john-apostle',
    name: 'Thánh Gioan Tông Đồ',
    saintTitle: 'Thánh Gioan Tông Đồ Tác Giả Tin Mừng',
    date: '12-27',
    month: 12,
    day: 27,
    type: 'feast',
    description: 'Môn đệ được Chúa Giêsu thương mến, tác giả Tin Mừng Gioan.'
  },
  {
    id: 'holy-innocents',
    name: 'Các Thánh Anh Hài',
    saintTitle: 'Lễ Các Thánh Anh Hài Tử Đạo',
    date: '12-28',
    month: 12,
    day: 28,
    type: 'feast',
    description: 'Kính nhớ các trẻ nhỏ vô tội tại Bê-lem bị Vua Hê-rô-đê tàn sát.'
  }
];

// Helper to get saint by ID or Date string "MM-DD"
export function getSaintsByDate(dateStr: string): CatholicSaint[] {
  return CATHOLIC_SAINTS.filter(s => s.date === dateStr);
}

export function getTodaySaints(): CatholicSaint[] {
  const now = new Date();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const dayStr = String(now.getDate()).padStart(2, '0');
  const dateStr = `${monthStr}-${dayStr}`;
  return getSaintsByDate(dateStr);
}

export function getUpcomingSaints(daysAhead: number = 7): { saint: CatholicSaint; daysLeft: number; displayDate: string }[] {
  const result: { saint: CatholicSaint; daysLeft: number; displayDate: string }[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = 0; i <= daysAhead; i++) {
    const target = new Date(now);
    target.setDate(now.getDate() + i);

    const month = target.getMonth() + 1;
    const day = target.getDate();
    const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const displayDate = `${day}/${month}`;

    const saints = getSaintsByDate(dateStr);
    for (const saint of saints) {
      result.push({
        saint,
        daysLeft: i,
        displayDate
      });
    }
  }

  return result;
}
