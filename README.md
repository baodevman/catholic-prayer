# 🌾 Catholic Prayer PWA - Lời Cầu Nguyện Công Giáo

Một ứng dụng **Progressive Web App (PWA)** hiện đại, thanh lịch giúp tín hữu Công giáo dễ dàng tra cứu, thực hành các lời cầu nguyện hàng ngày, theo dõi Tuần Cửu Nhật và xây dựng Cuốn Sách Lời Nguyện Cá Nhân với giao diện lật trang 3D sống động.

Ứng dụng được thiết kế theo phong cách tối giản, sang trọng lấy cảm hứng từ các cuốn sách Thánh Kinh bìa da kết hợp với biểu tượng **Hạt Lúa Mì 🌾** đại diện cho đức tin và sự sinh hoa kết quả.

---

## 🌟 Các Tính Năng Nổi Bật

### 1. 🌾 Giao diện Hạt Lúa Mì & Chủ đề Thánh Kinh Cổ Điển
* Biểu tượng PWA **Hạt Lúa Mì (Wheat Grain)** đại diện cho tinh thần "Hạt lúa gieo vào lòng đất".
* Màu sắc hài hòa (Gold Accent, Deep Navy, Warm Parchment) mang lại cảm giác trang trọng, ấm áp khi cầu nguyện.

### 2. 🎯 Gợi Ý Lời Cầu Nguyện Thông Minh Theo Buổi & Vai Trò
* **Tự động nhận diện thời gian**: Gợi ý các lời cầu nguyện Buổi Sáng (khi bắt đầu ngày mới/đi làm/đi học) và Buổi Tối (khi kết thúc ngày sống).
* **Phân loại theo Đa Vai Trò (Multi-Role)**: Người dùng có thể chọn nhiều vai trò cùng lúc trong đời sống:
  * 🎓 *Học sinh / Sinh viên*
  * 💼 *Người đi làm / Doanh nhân*
  * 🏡 *Gia đình / Vợ chồng / Con cái*
  * 🌿 *Độc thân / Ơn gọi*
  * 👴 *Người cao tuổi*
  * 🕊️ *Bệnh nhân / Người đau yếu*
* **Nút "Đổi lời nguyện khác"**: Cho phép chuyển đổi ngẫu nhiên sang một lời cầu nguyện khác phù hợp với cùng buổi và vai trò đã chọn.

### 3. 📖 Sách Lời Nguyện Cá Nhân Hàng Tuần (3D Flipbook)
* Thiết kế dạng cuốn sách lật trang 3D (`CSS 3D Transforms`).
* Người dùng tự do tùy biến lời cầu nguyện cho từng ngày trong tuần từ Thứ Hai đến Chủ Nhật.
* Trải nghiệm lật trang sống động như đang cầm cuốn sổ tay cầu nguyện thực tế.

### 4. 📿 Theo Dõi Tiến Trình Tuần Cửu Nhật (Novena Tracker)
* Hỗ trợ các Tuần Cửu Nhật phổ biến (Đức Mẹ Hằng Cứu Giúp, Lòng Thương Xót Chúa, Thánh Giuse).
* Tự động tính toán và theo dõi tiến trình 9 ngày cầu nguyện, liên kết trực tiếp tới lời nguyện của ngày hiện tại.

### 5. 🌹 Tưởng Niệm Đức Mẹ Fatima Hàng Tháng
* Tự động hiển thị banner thông báo đặc biệt vào **ngày 13 hàng tháng** để nhắc nhở tín hữu hướng về Đức Mẹ Fatima và đọc Kinh Mân Côi.

### 6. 🤖 Crawl & Phân Loại Lời Cầu Nguyện Tự Động Bằng AI Gemini
* Hệ thống script tự động cào (crawl) nội dung lời cầu nguyện mới từ các nguồn Công giáo uy tín.
* Tích hợp **Google Gemini AI (`gemini-1.5-flash`)** tự động phân loại lời cầu nguyện theo thời gian (`sang`, `toi`, `bat_ky`) và gán vai trò tương ứng (`student`, `worker`, `family`, v.v.).
* Tự động đồng bộ bản ghi phân loại lên Prismic Headless CMS.

### 7. ⏱️ Hệ Thống Cronjob Chạy Tự Động Miễn Phí (Vercel Cron & GitHub Actions)
* Tự động chạy lịch crawl và sync dữ liệu hàng tuần mà không cần can thiệp thủ công.
* Hỗ trợ cả **GitHub Actions Cron (Free 100%)** và **Vercel Cron (Hobby Tier)**.

### 8. 📱 Hoạt Động Ngoại Tuyến 100% (PWA & IndexedDB)
* Tải toàn bộ cơ sở dữ liệu lời cầu nguyện về thiết bị thông qua `idb-keyval` (IndexedDB).
* Giúp người dùng đọc lời cầu nguyện bình an ngay cả khi ở nhà thờ hoặc nơi không có kết nối internet.

### 9. 💾 Sao Lưu & Khôi Phục Dữ Liệu
* Cho phép Xuất/Nhập file sao lưu dạng `.json` để đồng bộ cài đặt cá nhân, danh sách lời nguyện yêu thích và tiến trình Tuần Cửu Nhật giữa các thiết bị.

---

## 🛠️ Kiến Trúc & Công Nghệ Áp Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện áp dụng |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite |
| **PWA & Service Worker** | `vite-plugin-pwa`, Web App Manifest, Cache API |
| **Styling & 3D UI** | Vanilla CSS (CSS Variables, HSL Tokens, Glassmorphism, 3D Transforms) |
| **Client Storage** | `idb-keyval` (IndexedDB Cache) & LocalStorage |
| **Headless CMS** | Prismic CMS (`@prismicio/client`, `@prismicio/migrate`) |
| **AI Integration** | Google Gemini API (`@google/genai` / `gemini-1.5-flash`) |
| **Automation / Scripts** | Node.js, `tsx` CLI execution |
| **Cronjob / CI/CD** | GitHub Actions Workflows & Vercel Serverless Crons |
| **Code Quality** | Oxlint, TypeScript strict mode |

---

## ⏰ Hướng Dẫn Cấu Hình Cronjob Tự Động Crawl & Sync (Miễn Phí 100%)

Để hệ thống tự động cào các lời cầu nguyện mới, dùng AI Gemini phân loại và đẩy lên Prismic CMS hàng tuần, bạn có thể áp dụng 1 trong 2 giải pháp miễn phí dưới đây:

### 🌟 Cách 1: Sử dụng GitHub Actions Cron (KHUYÊN DÙNG - 100% Miễn Phí & Tốt Nhất)

GitHub Actions cung cấp tính năng chạy scheduled workflow **miễn phí không giới hạn** cho các repository public.

#### Ưu điểm:
* **Không bị giới hạn thời gian chạy (Execution Timeout)**: Quá trình crawl và gọi AI Gemini phân loại có thể tốn từ 20s đến vài phút mà không lo bị ngắt.
* **Không lo bị tính phí hay vượt quota Serverless**.

#### Các bước thiết lập:
1. Vào repository của bạn trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Thêm các Secret sau:
   * `GEMINI_API_KEY`: API Key lấy từ Google AI Studio.
   * `PRISMIC_REPO`: Tên repository Prismic của bạn.
   * `PRISMIC_WRITE_TOKEN`: Migration token lấy trong cài đặt Prismic.
   * `PRISMIC_ACCESS_TOKEN`: Permanent access token của Prismic (nếu có).
3. File workflow đã được cài đặt sẵn tại `.github/workflows/weekly-prayer-cron.yml`:
   ```yaml
   name: Weekly Prayer Crawl & Prismic Sync Cron

   on:
     schedule:
       - cron: '0 0 * * 0' # Chạy vào 00:00 UTC Chủ Nhật hàng tuần
     workflow_dispatch:

   jobs:
     crawl-and-sync:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run cron:crawl-and-sync
           env:
             GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
             PRISMIC_REPO: ${{ secrets.PRISMIC_REPO }}
             PRISMIC_WRITE_TOKEN: ${{ secrets.PRISMIC_WRITE_TOKEN }}
   ```

---

### ⚡ Cách 2: Sử Dụng Vercel Cron (Dành cho gói Vercel Hobby Free)

Vercel hỗ trợ cài đặt Cronjob kích hoạt Serverless Function dựa trên file `vercel.json`.

#### Đã được cấu hình sẵn trong project:
1. File `vercel.json` khai báo đường dẫn cron:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron-crawl-and-sync",
         "schedule": "0 0 * * 0"
       }
     ]
   }
   ```
2. API endpoint xử lý tại `api/cron-crawl-and-sync.js`.

#### Các bước thiết lập trên Vercel:
1. Đăng nhập Vercel Dashboard -> Chọn Project -> **Settings** -> **Environment Variables**.
2. Thêm các biến môi trường:
   * `PRISMIC_REPO`: Tên repo Prismic.
   * `PRISMIC_WRITE_TOKEN`: Migration API Token của Prismic.
   * `CRON_SECRET`: Tạo một chuỗi ngẫu nhiên (ví dụ: `my_super_secret_cron_key_123`) để bảo mật API.
3. Khi deploy lên Vercel, tab **Crons** trong Vercel Dashboard sẽ tự động nhận diện lịch trình và kích hoạt API hàng tuần.

> [!NOTE]
> **Lưu ý với gói Vercel Free (Hobby):** Vercel giới hạn Serverless Function tối đa **10-15 giây** xử lý. Do đó, nếu bài crawl lớn hoặc gọi AI Gemini tốn thời gian, bạn nên ưu tiên **Cách 1 (GitHub Actions)**.

---

## 🚀 Hướng Dẫn Chạy Project Cục Bộ (Local Development)

### 1. Yêu cầu hệ thống
* Node.js (phiên bản v18+)
* npm hoặc pnpm

### 2. Cài đặt & Chạy ứng dụng
```bash
# Clone project & chuyển vào thư mục
cd catholic-prayer-pwa

# Cài đặt các thư viện
npm install

# Chạy dev server cục bộ
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173`

### 3. Chạy thử Script Crawl & AI Phân loại cục bộ
```bash
# Tạo file .env dựa theo .env.example và điền các API Keys
GEMINI_API_KEY=your_gemini_key PRISMIC_REPO=your_repo PRISMIC_WRITE_TOKEN=your_token npm run cron:crawl-and-sync
```

### 4. Build sản phẩm cho Production
```bash
npm run build
```
Thư mục đầu ra `dist/` đã sẵn sàng để deploy lên Vercel, Firebase Hosting hoặc Netlify.

---

## 📄 Giấy Phép & Tuyên Bố
Ứng dụng được phát triển vì mục đích phi thương mại nhằm phục vụ cộng đồng Công giáo. Mọi nội dung lời cầu nguyện được sưu tầm và trích dẫn tôn trọng từ các nguồn trang web Công giáo chính thức.
