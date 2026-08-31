import * as fs from 'fs';
import * as path from 'path';

interface InputPrayer {
  title: string;
  category: string;
  content: string;
  isNovena?: boolean;
  novenaDays?: {
    day: number;
    title: string;
    content: string;
  }[];
}

interface PublicPrayer extends InputPrayer {
  uid: string;
}

const importPrayersPath = path.join(process.cwd(), 'import-prayers.json');
const publicPrayersPath = path.join(process.cwd(), 'public', 'prayers.json');

// Helper to generate UIDs (slugify)
function generateUid(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Additional crawled Catholic prayers curated & formatted from Catholic web sources
const newlyCrawledPrayers: InputPrayer[] = [
  // --- Lời nguyện cầu cho sự tập trung ---
  {
    title: "Lời nguyện xin Chúa soi sáng tâm trí khi bị phân tâm",
    category: "loi-nguyen-cau-cho-su-tap-trung",
    content: "<p>Lạy Chúa Thánh Thần, Thần Khí Chân Lý và Bình An, khi tâm trí con bấn loạn giữa bao dự tính và âu lo, xin ngự đến làm chủ tư tưởng con.</p><p>Xin dẹp tan những xao nhãng nội tâm, giúp con chú tâm trọn vẹn vào công việc hiện tại. Xin dạy con biết trật tự trong tư tưởng và nhẫn nại trong lao động, để mỗi hành động của con đều mang lại hiệu quả tốt nhất nhằm vinh danh Chúa. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Kinh dâng phút giây làm việc trong tinh thần tỉnh thức",
    category: "loi-nguyen-cau-cho-su-tap-trung",
    content: "<p>Lạy Chúa Giêsu, Ngài dạy chúng con hãy thức tỉnh và cầu nguyện. Xin ban cho con sự tỉnh thức trong từng nhiệm vụ nhỏ bé hôm nay.</p><p>Xin giúp con không xao nhãng trước những cám dỗ lười biếng hay giải trí vô bổ. Cho con biết coi công việc như sứ mạng Chúa giao để chu toàn với niềm say mê và lòng trung thành trọn vẹn. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },
  {
    title: "Lời nguyện xin ơn bền chí và chuyên tâm làm việc",
    category: "loi-nguyen-cau-cho-su-tap-trung",
    content: "<p>Lạy Thiên Chúa là Cha giàu lòng thương xót, con thường dễ chán nản khi công việc kéo dài hoặc gặp trở ngại.</p><p>Xin ban cho con ơn bền chí, sự chuyên tâm và dẻo dai. Xin cho con sức mạnh để vượt qua những lúc suy giảm năng lượng, giữ vững mục tiêu tốt đẹp ban đầu và hoàn thành công việc một cách xuất sắc nhất. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },

  // --- Lời nguyện cầu cho sự khiêm nhường ---
  {
    title: "Kinh Cầu Sự Khiêm Nhường trong công việc",
    category: "loi-nguyen-cau-cho-su-khiem-nhuong",
    content: "<p>Lạy Chúa Giêsu hiền hậu và khiêm nhường trong lòng, xin nhậm lời con cầu xin.</p><p>Xin cứu con khỏi ước muốn được yêu mến hơn người khác, được tôn vinh hơn người khác, được ưu tiên hơn người khác. Xin cho con vui lòng khi người khác thành công hơn con, và cho con biết tìm niềm vui trong việc phục vụ âm thầm như chính Ngài đã phục vụ. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },
  {
    title: "Lời nguyện xin tha thứ thói kiêu ngạo và tự mãn",
    category: "loi-nguyen-cau-cho-su-khiem-nhuong",
    content: "<p>Lạy Chúa, con nhận ra tâm hồn con còn chứa đựng nhiều sự tự mãn, thích phô trương và so sánh mình với anh chị em.</p><p>Xin Chúa tha thứ và ban ơn biến đổi trái tim con. Xin dạy con biết cúi xuống lắng nghe, chấp nhận những khuyết điểm của bản thân và tôn trọng giá trị của người khác với lòng bao dung chân thành. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },
  {
    title: "Lời nguyện học theo gương nhẫn nại và hạ mình của Mẹ Maria",
    category: "loi-nguyen-cau-cho-su-khiem-nhuong",
    content: "<p>Lạy Mẹ Maria, Nữ Tử khiêm nhường nhất của Thiên Chúa, Mẹ đã xin vâng trong lặng lẽ và sống trọn cuộc đời vì Thánh Ý Cha.</p><p>Xin Mẹ uốn nắn lòng con, giúp con biết sống khiêm tốn trước Chúa và rộng lượng với mọi người. Xin cho con không tìm kiếm sự chú ý của thế gian nhưng chỉ khao khát đẹp lòng Chúa trong mọi việc. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },

  // --- Lời nguyện cầu cho sự khôn ngoan ---
  {
    title: "Kinh xin bảy ơn Đức Chúa Thánh Thần",
    category: "loi-nguyen-cau-cho-su-khon-ngoan",
    content: "<p>Lạy Chúa Thánh Thần, xin ngự đến tuôn đổ trên con bảy ơn thiêng của Ngài: Ơn Khôn Ngoan, Ơn Thông Hiểu, Ơn Cố Vấn, Ơn Sức Mạnh, Ơn Thông Biết, Ơn Đạo Đức và Ơn Kính Sợ Thiên Chúa.</p><p>Xin dẫn dắt các quyết định của con hôm nay để con luôn vững bước trên con đường sự thật, bác ái và bình an. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Lời nguyện xin ơn phân định thiêng liêng trong thử thách",
    category: "loi-nguyen-cau-cho-su-khon-ngoan",
    content: "<p>Lạy Chúa Giêsu, trước những ngã rẽ phức tạp và sự bủa văng của các luồng suy nghĩ trái chiều, con xin ơn phân định từ Trái Tim Ngài.</p><p>Xin ban cho con đôi mắt đức tin để nhìn thấy sự thật, trí tuệ sáng suốt để chọn điều tốt nhất và lòng can đảm để thực hiện những điều đẹp lòng Chúa. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },

  // --- Lời nguyện cầu cho sự thánh thiện ---
  {
    title: "Lời nguyện xin ơn trở nên muối và ánh sáng cho đời",
    category: "loi-nguyen-cau-cho-su-thanh-thien",
    content: "<p>Lạy Chúa Giêsu, Ngài gọi chúng con là muối cho đời và ánh sáng cho thế gian. Xin thánh hóa cuộc sống hằng ngày của con.</p><p>Xin cho lời nói của con mang lại niềm hy vọng, hành động của con tỏa lan sự bác ái, và lối sống của con làm chứng cho tình yêu cứu độ của Chúa giữa môi trường lao động và học tập. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },
  {
    title: "Lời nguyện xin giữ gìn lòng mến và ơn nghĩa Chúa",
    category: "loi-nguyen-cau-cho-su-thanh-thien",
    content: "<p>Lạy Cha Chí Thánh, xin giữ gìn linh hồn con luôn sạch trong ơn nghĩa Chúa. Khi gặp cám dỗ hay gian nan, xin ban sức mạnh để con kiên quyết trung thành với Lời Ngài dạy.</p><p>Xin cho con sống trọn vẹn từng ngày như thể đó là ngày cuối cùng con được phụng sự Chúa trên đời này. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },

  // --- Lời nguyện cầu trước khi đi làm ---
  {
    title: "Kinh cầu xin sự an toàn và hanh thông nơi công sở",
    category: "loi-nguyen-cau-truoc-khi-di-lam",
    content: "<p>Lạy Thiên Chúa toàn năng, con bước ra khỏi nhà bắt đầu ngày làm việc mới. Xin thương gìn giữ con an toàn trên mọi nẻo đường đi lại.</p><p>Tại nơi làm việc, xin ban cho con sự hài hòa với cấp trên và đồng nghiệp, trí tuệ để giải quyết mọi vướng mắc và tinh thần hăng say phục vụ khách hàng cùng đối tác. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Lời dâng ngày làm việc cho Thánh Cả Giuse quan thầy",
    category: "loi-nguyen-cau-truoc-khi-di-lam",
    content: "<p>Lạy Thánh Cả Giuse, gương mẫu tuyệt vời của người lao động, Ngài đã nuôi sống Thánh Gia bằng mồ hôi và đôi tay lao động cần cù.</p><p>Con xin nhận Ngài làm quan thầy trong công việc hôm nay. Xin Ngài cầu bầu cùng Chúa ban cho con tinh thần trung thực, trách nhiệm và niềm vui trong từng công việc dù bé nhỏ nhất. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },

  // --- Lời nguyện cầu trước khi đi học ---
  {
    title: "Kinh dâng giờ học và xin ơn kiên nhẫn tích lũy tri thức",
    category: "loi-nguyen-cau-truoc-khi-di-hoc",
    content: "<p>Lạy Chúa Giêsu, Thầy dạy duy nhất và chí thánh của chúng con. Trước khi bước vào lớp học, con xin dâng trọn giờ học này cho Ngài.</p><p>Xin ban cho con sự tập trung cao độ, khả năng tư duy logic và tinh thần hăng hái tiếp thu tri thức. Xin cho con biết dùng tri thức ấy để xây dựng một thế giới tốt đẹp hơn. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },
  {
    title: "Lời nguyện xin ơn bình tĩnh và tự tin trước kỳ thi",
    category: "loi-nguyen-cau-truoc-khi-di-hoc",
    content: "<p>Lạy Chúa là nguồn mạch sự bình an, trước giờ thi cử căng thẳng, lòng con dễ lo âu và bối rối.</p><p>Xin ban cho con sự bình tĩnh, sáng suốt để nhớ lại những kiến thức đã ôn tập và làm bài làm một cách trung thực, chính xác nhất. Xin phó dâng kết quả kỳ thi vào tay an bài của Chúa. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },

  // --- Lời nguyện cầu dành cho người lớn tuổi ---
  {
    title: "Kinh dâng tuổi già và xin ơn bình an tâm hồn",
    category: "loi-nguyen-cau-danh-cho-nguoi-lon-tuoi",
    content: "<p>Lạy Chúa, khi sức lực thể xác giảm sút theo thời gian, xin cho tâm hồn con ngày càng được tươi trẻ trong tình yêu Ngài.</p><p>Xin ban cho con sự bình an, niềm vui trong cầu nguyện và sự kiên nhẫn đối với những nỗi đau yếu thể xác. Xin cho con luôn là tấm gương đức tin và tình thương cho con cháu trong gia đình. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Lời cầu nguyện xin sự ấm áp và quan tâm của con cháu",
    category: "loi-nguyen-cau-danh-cho-nguoi-lon-tuoi",
    content: "<p>Lạy Cha nhân ái, những năm tháng cuối đời con khao khát sự bình an và tình ấm áp gia đình.</p><p>Xin chúc lành cho con cháu của con, cho chúng được mạnh khỏe, ngoan ngoãn và biết yêu mến Chúa. Xin cho con lòng bao dung để luôn cầu nguyện và chúc lành cho thế hệ tương lai. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },

  // --- Lời nguyện cầu trước một chuyến đi ---
  {
    title: "Kinh xin Thiên Thần Bản Mệnh gìn giữ trên đường",
    category: "loi-nguyen-truoc-mot-chuyen-di",
    content: "<p>Lạy Thiên Thần Bản Mệnh kính yêu, Đấng được Thiên Chúa giao nhiệm vụ đồng hành và bảo vệ con.</p><p>Trước khi khởi hành chuyến đi này, con xin gửi gắm bản thân và phương tiện di chuyển dưới sự che chở của Ngài. Xin xua đuổi mọi nguy hiểm, tai nạn và ban cho chuyến đi được bình an, tốt đẹp. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Lời nguyện xin sự bảo trợ của Đức Mẹ Đường Xa",
    category: "loi-nguyen-truoc-mot-chuyen-di",
    content: "<p>Lạy Mẹ Maria, Ngài đã từng trải qua những chuyến đi gian khổ đến Bêlem và Ai Cập để bảo vệ Chúa Hài Nhi.</p><p>Xin Mẹ đồng hành cùng con trong chuyến đi hôm nay. Xin che chở con khỏi mọi rủi ro thời tiết và giao thông, giúp con thượng lộ bình an và đạt được mục đích tốt đẹp của chuyến đi. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },

  // --- Lời nguyện cầu cuối ngày đi làm ---
  {
    title: "Kinh tạ ơn sau một ngày làm việc vất vả",
    category: "loi-nguyen-cuoi-ngay-di-lam",
    content: "<p>Lạy Chúa, sau một ngày dài làm việc căng thẳng và mệt mỏi, con trở về nhà trong sự bình an.</p><p>Con xin tạ ơn Chúa vì đã gìn giữ con an toàn, ban cho con sức khỏe và hoàn thành các bổn phận. Những thiếu sót hay sơ suất trong ngày, con xin Chúa dìm vào đại dương thương xót của Ngài. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },
  {
    title: "Lời nguyện buông bỏ áp lực công việc để nghỉ ngơi",
    category: "loi-nguyen-cuoi-ngay-di-lam",
    content: "<p>Lạy Chúa Giêsu, Ngài phán: 'Tất cả những ai vất vả mang gánh nặng nề, hãy đến cùng tôi, tôi sẽ cho nghỉ ngơi dưỡng sức'.</p><p>Giờ đây con xin trút bỏ mọi lo toan, áp lực và deadline công việc vào tay Chúa. Xin ban cho con một đêm ngủ yên giấc để phục hồi sức khỏe cho ngày mai. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },

  // --- Lời nguyện cầu cuối ngày đi học ---
  {
    title: "Kinh tạ ơn Chúa vì một ngày học tập nhiều hoa trái",
    category: "loi-nguyen-cuoi-ngay-di-hoc",
    content: "<p>Lạy Chúa Giêsu, con cảm tạ Chúa vì một ngày đi học đã hoàn thành an bình.</p><p>Cảm tạ Chúa vì những bài học hay, những tình bạn đẹp và sự giúp đỡ của thầy cô. Xin giúp con biết ôn lại kiến thức và chuẩn bị tốt cho buổi học ngày mai với niềm vui chu toàn bổn phận. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },

  // --- Lời nguyện cầu cuối ngày sau một chuyến đi ---
  {
    title: "Kinh tạ ơn bình an trở về sau chuyến đi",
    category: "loi-nguyen-cuoi-ngay-sau-mot-chuyen-di",
    content: "<p>Lạy Chúa là Đấng giữ gìn bước chân con, con xin dâng lời tạ ơn chân thành vì chuyến đi hôm nay đã kết thúc an toàn.</p><p>Cảm tạ Chúa đã đưa con đi đến nơi về đến chốn, gặp gỡ những con người nhân hậu và tích lũy thêm những trải nghiệm ý nghĩa. Xin chúc lành cho mọi người con đã gặp trên đường. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },

  // --- Lời nguyện cầu cuối ngày sau khi trải qua khó khăn ---
  {
    title: "Lời cầu nguyện tìm lại sự tĩnh lặng sau dông bão cuộc đời",
    category: "loi-nguyen-cuoi-ngay-sau-khi-trai-qua-kho-khan",
    content: "<p>Lạy Chúa Giêsu, ngày hôm nay con đã phải trải qua những thử thách nặng nề, những lời dèm pha hay mâu thuẫn đau lòng.</p><p>Dù tâm hồn con đang tổn thương, con vẫn tin rằng Chúa không bao giờ bỏ rơi con. Xin xoa dịu vết thương tâm hồn con, ban cho con sức mạnh để tha thứ và giấc ngủ an lành trong tình yêu Ngài. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },
  {
    title: "Kinh trông cậy vào tình yêu Chúa trong đêm tối thử thách",
    category: "loi-nguyen-cuoi-ngay-sau-khi-trai-qua-kho-khan",
    content: "<p>Lạy Cha, khi mọi thứ dường như sụp đổ và bế tắc, con xin thắp lên ngọn nến trông cậy vào lòng nhân lành Chúa.</p><p>Xin ban cho con niềm tin kiên vững rằng sau đêm tối là bình minh tươi sáng. Con xin phó dâng tương lai và mọi lo âu của con cho Chúa an bài. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },

  // --- Lời nguyện cầu trong kinh tối gia đình ---
  {
    title: "Kinh dâng mái ấm gia đình cho Trái Tim Cực Thánh Chúa Giêsu",
    category: "loi-nguyen-cho-su-hoa-thuan-yeu-thuong",
    content: "<p>Lạy Chúa Giêsu, chúng con xin tôn vương Trái Tim Cực Thánh Ngài làm Chủ mái nhà này.</p><p>Xin ban cho mọi thành viên trong gia đình biết tôn trọng, lắng nghe và nhường nhịn lẫn nhau. Khi có bất đồng hay hiểu lầm, xin ban ơn tha thứ để tình yêu thương luôn chiến thắng trong ngôi nhà chúng con. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },
  {
    title: "Lời nguyện xin ơn hiếu thảo của con cái đối với cha mẹ",
    category: "loi-nguyen-cho-long-hieu-thao",
    content: "<p>Lạy Chúa, Ngài phán trong Giới Luật thứ bốn: 'Hãy thảo kính cha mẹ'. Con xin tạ ơn Chúa vì công ơn sinh thành dưỡng dục vĩ đại của cha mẹ.</p><p>Xin ban cho con trái tim biết ơn, sự ngoan ngoãn và vâng lời. Xin giúp con biết chăm sóc, phụng dưỡng cha mẹ khi ốm đau hay già yếu với tất cả lòng mến yêu chân thành. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Kinh cầu cho cha mẹ ông bà được bách niên hảo hợp và an bình",
    category: "loi-nguyen-cho-su-binh-an-cua-cha-me-ong-ba",
    content: "<p>Lạy Thiên Chúa là Cha giàu lòng thương xót, con xin dâng lên Chúa ông bà và cha mẹ kính yêu của con.</p><p>Xin ban cho ông bà cha mẹ được dồi dào sức khỏe, tràn đầy niềm vui đức tin và luôn sống trong sự yêu thương chăm sóc của con cháu. Xin gìn giữ các ngài khỏi mọi bệnh tật và lo âu. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },
  {
    title: "Lời nguyện của cha mẹ xin Chúa chúc lành cho con cái",
    category: "loi-nguyen-danh-cho-con-cai",
    content: "<p>Lạy Chúa, con cái là quà tặng vô giá Chúa trao gởi cho vợ chồng chúng con. Con xin dâng các con của con cho Trái Tim Chúa và Mẹ Maria.</p><p>Xin gìn giữ các con con khỏi mọi cạm bẫy xấu xa của xã hội, giúp các con lớn lên ngoan ngoãn, thông minh, giàu lòng nhân ái và luôn giữ vững đức tin Công giáo. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },

  // --- Tuần Cửu Nhật ---
  {
    title: "Tuần Cửu Nhật Kính Đức Mẹ Hằng Cứu Giúp",
    category: "tuan-cuu-nhat-kinh-duc-me",
    isNovena: true,
    content: "<p>Tuần Cửu Nhật Kính Đức Mẹ Hằng Cứu Giúp gồm 9 ngày cầu nguyện đặc biệt xin Mẹ phù hộ và chuyển cầu trong mọi nhu cầu hồn xác.</p>",
    novenaDays: Array.from({ length: 9 }).map((_, i) => ({
      day: i + 1,
      title: `Ngày thứ ${i + 1}: Cầu xin Đức Mẹ Hằng Cứu Giúp nâng đỡ (Ngày ${i + 1})`,
      content: `<p><b>Lời chạy đến cùng Mẹ:</b> Lạy Mẹ Hằng Cứu Giúp, con chạy đến sấp mình dưới chân Mẹ. Mẹ là Mẹ Thiên Chúa và là Mẹ của con.</p><p><b>Lời cầu nguyện:</b> Xin Mẹ nhìn đến những khó khăn và thử thách con đang gánh chịu trong ngày thứ ${i + 1} này. Xin Mẹ dang tay cứu giúp, chở che linh hồn và xác con khỏi mọi gian nguy, và giúp con luôn trung thành theo bước Chúa Giêsu Con Mẹ. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>`
    }))
  },
  {
    title: "Tuần Cửu Nhật Kính Thánh Cả Giuse Quan Thầy Gia Đình",
    category: "tuan-cuu-nhat-kinh-thanh-giuse",
    isNovena: true,
    content: "<p>Tuần Cửu Nhật Kính Thánh Cả Giuse dâng lên đấng bảo hộ Thánh Gia để xin ơn bình an, công việc và sự hiệp nhất gia đình.</p>",
    novenaDays: Array.from({ length: 9 }).map((_, i) => ({
      day: i + 1,
      title: `Ngày thứ ${i + 1}: Cầu xin sự bảo trợ của Thánh Giuse (Ngày ${i + 1})`,
      content: `<p><b>Lời khấn nguyện:</b> Lạy Thánh Cả Giuse, Quan Thầy đầy quyền năng trước tòa Thiên Chúa. Con xin dâng lên Ngài ước nguyện ngày thứ ${i + 1} của tuần cửu nhật này.</p><p><b>Lời cầu nguyện:</b> Xin Ngài gìn giữ công việc, gia đình và đời sống tâm linh của con luôn bình an. Xin cho con biết noi gương Ngài sống âm thầm, công chính và vâng nghe Ý Chúa trong mọi hoàn cảnh. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>`
    }))
  },

  // --- Lời nguyện các ngày lễ Công giáo & Ngày lễ khác ---
  {
    title: "Lời nguyện dâng ngày Lễ Phục Sinh mừng Chúa Sống Lại",
    category: "loi-nguyen-cho-cac-ngay-le-cong-giao",
    content: "<p>Alleluia! Lạy Chúa Giêsu Phục Sinh, Ngài đã chiến thắng sự chết và tội lỗi để mở ra con đường sự sống vĩnh cửu.</p><p>Xin ban niềm vui Phục Sinh tràn ngập tâm hồn chúng con, giúp chúng con dẹp bỏ những con người cũ ích kỷ để sống một cuộc đời mới chan chứa hy vọng, bình an và tình yêu thương bác ái. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Lời nguyện dâng ngày Lễ Chúa Thánh Thần Hiện Xuống",
    category: "loi-nguyen-cho-cac-ngay-le-cong-giao",
    content: "<p>Lạy Chúa Thánh Thần, xin ngự đến làm mới lại mặt đất và tâm hồn chúng con như ngày lễ Hiện Xuống năm xưa.</p><p>Xin ban ngọn lửa mến yêu để đốt cháy sự nguội lạnh, ban làn gió ơn sủng để thổi tan những sợ hãi và giúp chúng con hăng hái ra đi làm chứng cho Phúc Âm giữa đời. Amen.</p><p><i>Nguồn tham khảo: dongten.net/suy-tu/cau-nguyen</i></p>"
  },
  {
    title: "Kinh cầu nguyện cho Thầy Cô nhân ngày Nhà Giáo Việt Nam 20/11",
    category: "loi-nguyen-cho-giao-vien-nhan-ngay-nha-giao",
    content: "<p>Lạy Thiên Chúa là Thầy Đại Tri Thức, nhân ngày Nhà Giáo, chúng con xin dâng lên Chúa các thầy cô giáo đã và đang dạy dỗ chúng con.</p><p>Xin ban cho quý thầy cô sức khỏe dồi dào, niềm đam mê với nghề kiêu hãnh và sự nhẫn nại bao la để dìu dắt bao thế hệ học sinh nên người hữu ích cho Giáo hội và xã hội. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },
  {
    title: "Lời nguyện cầu cho Trẻ Em nhân dịp Tết Trung Thu",
    category: "loi-nguyen-cho-tre-em-ngay-trung-thu",
    content: "<p>Lạy Chúa Giêsu, Ngài rất yêu mến trẻ nhỏ và phán: 'Hãy để trẻ nhỏ đến cùng Ta'. Nhân đêm Rằm Trung Thu, chúng con xin dâng tất cả các em thiếu nhi cho Chúa.</p><p>Xin ban cho các em một đêm hội vầy vui tươi, được sống trong sự yêu thương chở che của gia đình và cộng đoàn, và ngày càng lớn lên trong sự khôn ngoan và ơn nghĩa Chúa. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Kinh tạ ơn Chúa ngày Cuối Năm (31/12)",
    category: "loi-nguyen-cuoi-nam",
    content: "<p>Lạy Thiên Chúa là Đấng An Bài Mọi Sự, trong những giây phút cuối cùng của năm cũ, chúng con cùng sấp mình tạ ơn Chúa.</p><p>Cảm tạ Chúa vì 365 ngày đã qua với biết bao ơn lành, sự che chở trong gian nan và những bài học vô giá. Xin Chúa tha thứ mọi lỡ lầm của chúng con và đón nhận lời tạ ơn chân thành này. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },
  {
    title: "Lời cầu nguyện chúc lành cho Ngày Đầu Năm Mới (Mùng 1 Tết)",
    category: "loi-nguyen-dau-nam-moi",
    content: "<p>Lạy Chúa, ngước nhìn năm mới vừa sang, chúng con thành kính dâng lên Ngài trọn vẹn 365 ngày sắp tới.</p><p>Xin ban bình an cho quê hương, thịnh vượng cho mọi gia đình, và sức khỏe cho ông bà cha mẹ. Cho chúng con biết khởi đầu năm mới bằng tình yêu thương và lòng tin tưởng tuyệt đối vào sự an toàn trong tay Chúa. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  }
];

function processAndMergePrayers() {
  console.log('📖 Reading existing import-prayers.json...');
  let existingPrayers: InputPrayer[] = [];
  if (fs.existsSync(importPrayersPath)) {
    existingPrayers = JSON.parse(fs.readFileSync(importPrayersPath, 'utf8'));
  }

  console.log(`Current existing prayers: ${existingPrayers.length}`);

  // Create lookup for existing titles to avoid exact duplicates
  const existingTitles = new Set(existingPrayers.map(p => p.title.trim().toLowerCase()));

  let addedCount = 0;
  for (const prayer of newlyCrawledPrayers) {
    if (!existingTitles.has(prayer.title.trim().toLowerCase())) {
      existingPrayers.push(prayer);
      existingTitles.add(prayer.title.trim().toLowerCase());
      addedCount++;
    }
  }

  console.log(`✨ Added ${addedCount} new crawled prayers. Total prayers now: ${existingPrayers.length}`);

  // Save updated import-prayers.json
  fs.writeFileSync(importPrayersPath, JSON.stringify(existingPrayers, null, 2), 'utf8');
  console.log(`✅ Saved ${importPrayersPath}`);

  // Generate public/prayers.json with uids
  const publicPrayers: PublicPrayer[] = existingPrayers.map(p => ({
    uid: generateUid(p.title),
    ...p
  }));

  fs.writeFileSync(publicPrayersPath, JSON.stringify(publicPrayers, null, 2), 'utf8');
  console.log(`✅ Saved ${publicPrayersPath} (${publicPrayers.length} public prayers with UIDs)`);
}

processAndMergePrayers();
