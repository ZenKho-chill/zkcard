<p align="center">
  <img src="./build/structures/images/logo.png" alt="ZKCard logo" width="140" />

  <h1 align="center">ZKCard</h1>
  <em>Thư viện Node.js tạo thẻ card đẹp, tối ưu cho ứng dụng âm nhạc và media.</em>
</p>

## 📝 Tổng quan

ZKCard là một thư viện nhỏ gọn cho Node.js giúp bạn tạo các thẻ (card) PNG tùy chỉnh — hỗ trợ trích xuất màu tự động từ thumbnail, nhiều font quốc tế và thanh tiến trình có animation.

## 📚 Mục lục

- [🚀 Bắt đầu nhanh (Quickstart)](#-bắt-đầu-nhanh-quickstart)
- [✨ Tính năng](#-tính-năng)
- [📦 Project index](#-project-index)
- [🗂️ Cấu trúc dự án](#-cấu-trúc-dự-án)
- [⚡ Ví dụ nhanh](#-ví-dụ-nhanh)
- [🔐 License](#-license)
- [🔁 Chuyển sang README (EN)](README_en.md)

## 🚀 Bắt đầu nhanh (Quickstart)

```bash
npm install zkcard
```

Ví dụ cơ bản:

```javascript
const { zkcard } = require('zkcard');

const card = new zkcard({
  name: 'Tên bài hát',
  author: 'Tên nghệ sĩ',
  requester: 'Người yêu cầu',
  progress: 45
});

const buffer = await card.build();
require('fs').writeFileSync('card.png', buffer);
```

## ✨ Tính năng

- ✨ Tạo card PNG tùy chỉnh
- 🎨 Tự động trích xuất màu chủ đạo từ thumbnail (`auto`)
- 🌈 Hỗ trợ màu hex và điều chỉnh độ sáng
- 📊 Thanh tiến trình có animation
- 🖼️ Hỗ trợ thumbnail từ URL hoặc buffer
- 🔤 Hỗ trợ nhiều font (JP / KR / Emoji)

## 📦 Project index

- Package: `zkcard` — API chính để tạo card
- Build: `build/` — bản dựng (index.js, index.d.ts)
- Functions: `functions/` — helper (color extraction, brightness)
- Structures: `structures/` — layout, fonts, sample images

## 🗂️ Cấu trúc dự án

- LICENSE — Giấy phép dự án
- package.json — Metadata & scripts
- build/ — Bản dựng phát hành
- functions/ — Hàm hỗ trợ (adjustBrightness, colorFetch, ...)
- structures/ — Font & ảnh mẫu (fonts/, images/)

## ⚡ Ví dụ nhanh

Tạo card và lưu ra file:

```javascript
(async () => {
  const { zkcard } = require('zkcard');
  const fs = require('fs');

  const card = new zkcard()
    .setName("Ash Again") // Tên bài hát
    .setAuthor("Gawr Gura") //  Tên tác giả
    .setRequester("ZenKho") // Tên người yêu cầu
    .setColor("auto")
    .setTheme("classic") // Đừng thay đổi, hiện tại chỉ hỗ trợ classic
    .setBrightness(50) // Độ sáng
    .setThumbnail("https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/avatar.png")
    .setProgress(10) // Thanh thời gian(%)
    .setStartTime("0.00")
    .setEndTime("4:59")

  const cardBuffer = await card.build();

  fs.writeFileSync(`zkcard.png`, cardBuffer);
  console.log("Task Done!")
})()
```

## 🔐 License

Dự án này được cấp phép theo MIT — xem file `LICENSE` để biết chi tiết.

## 🔁 Chuyển đổi ngôn ngữ

Muốn xem README bằng tiếng Anh? Mở [README_en.md](README_en.md).

---

**Tác giả:** ZenKho-chill — https://github.com/ZenKho-chill
