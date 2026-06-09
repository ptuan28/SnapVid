<div align="center">

# 🌸 SnapVid

**Tải video đa nền tảng — không logo, không giới hạn, dễ thương vô cùng**


[🚀 Demo Live](#) · [📖 Hướng dẫn nhúng](#embed-mode) · [🐛 Báo lỗi](https://github.com/ptuan28/SnapVid/issues)

</div>

---

## ✨ Tính năng

- 🎵 **TikTok & Douyin** — Tải video HD/SD không logo qua TikWM API, kèm nhạc nền MP3
- 📺 **YouTube** — Chọn chất lượng 360p / 480p / 720p / 1080p, tải qua mạng Cobalt
- 📸 **Instagram Reels & Slide** — Hỗ trợ tải từng ảnh/video trong bộ sưu tập
- 🔁 **Fallback tự động** — Thử lần lượt nhiều Cobalt instance nếu một máy chủ bị lỗi
- 🎛️ **Cài đặt linh hoạt** — Đặt chất lượng mặc định, tự cấu hình Cobalt API endpoint riêng
- 🖼️ **Chế độ nhúng (Embed Mode)** — Nhúng form tải vào website khác bằng `?embed=true`
- 🎉 **Confetti ăn mừng** — Pháo hoa giấy khi tải thành công (vì sao không? 🌸)
- 💾 **Lưu cài đặt** — Tự nhớ quality và endpoint yêu thích qua localStorage

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Animation | Framer Motion + canvas-confetti |
| Icons | Lucide React |
| Backend | Next.js API Route (`/api/download`) |
| Video Sources | TikWM API (TikTok/Douyin), Cobalt (YouTube/Instagram) |

---

## 🚀 Chạy local

```bash
# Clone repo
git clone https://github.com/ptuan28/SnapVid.git
cd SnapVid

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

---

## 📁 Cấu trúc project

```
SnapVid/
├── src/
│   ├── app/
│   │   ├── page.js              # Trang chính
│   │   ├── layout.js            # Layout gốc
│   │   ├── globals.css          # CSS global + custom animations
│   │   └── api/download/
│   │       └── route.js         # API endpoint xử lý tải video
│   └── components/
│       ├── DownloaderForm.jsx   # Form nhập link, chọn chất lượng
│       ├── VideoPreview.jsx     # Hiển thị kết quả + nút tải
│       ├── SettingsModal.jsx    # Modal cài đặt quality & API endpoint
│       ├── LegalFooter.jsx      # Footer + modal điều khoản pháp lý
│       ├── IntegrationGuide.jsx # Hướng dẫn nhúng iframe
│       └── MonetizationGuide.jsx# Gợi ý kiếm tiền
├── public/
├── AGENTS.md                    # Hướng dẫn cho AI agents
└── package.json
```

---

## 🖼️ Embed Mode

Nhúng SnapVid vào website của bạn bằng iframe:

```html
<iframe
  src="https://your-snapvid-domain.com/?embed=true"
  width="100%"
  height="400"
  frameborder="0"
  style="border-radius: 16px;"
></iframe>
```

Chế độ embed ẩn header, footer, hướng dẫn — chỉ giữ lại form tải và kết quả.

---

## ⚙️ Cách hoạt động

```
Người dùng dán link
        ↓
/api/download (POST)
        ↓
   TikTok/Douyin? ──► TikWM API → trả về HD/SD/MP3
        ↓ (nếu không phải TikTok, hoặc TikWM lỗi)
   YouTube/Instagram? ──► Cobalt instance #1
                               ↓ lỗi?
                          Cobalt instance #2
                               ↓ lỗi?
                          ... (4 instances)
        ↓
   Trả về danh sách link tải → VideoPreview hiển thị
```


## ⚠️ Lưu ý pháp lý

SnapVid là công cụ kỹ thuật phục vụ mục đích cá nhân và giáo dục. Người dùng chịu trách nhiệm đảm bảo việc tải nội dung tuân thủ điều khoản sử dụng của nền tảng gốc và luật bản quyền áp dụng. Không sử dụng công cụ này để vi phạm bản quyền hoặc phân phối nội dung trái phép.

---

## 📄 License

MIT © [ptuan28](https://github.com/ptuan28)