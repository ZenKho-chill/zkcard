<p align="center">
  <img src="./build/structures/images/logo.png" alt="ZKCard logo" width="140" />

  <h1 align="center">ZKCard</h1>
  <em>Thư viện Node.js tạo thẻ card đẹp, tối ưu cho ứng dụng âm nhạc và media.</em>
</p>

## 📝 Tổng quan

ZKCard là một thư viện nhỏ gọn cho Node.js giúp bạn tạo các thẻ (card) PNG tùy chỉnh — hỗ trợ trích xuất màu tự động từ thumbnail, nhiều font quốc tế, thanh tiến trình có animation và 18+ theme background đa dạng.

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
  color: 'auto',
  theme: 'zk', // "zk" hoặc "themes2"
  brightness: 50
});

const buffer = await card.build();
require('fs').writeFileSync('card.png', buffer);
```

## ✨ Tính năng

- ✨ Tạo card PNG tùy chỉnh với design đẹp mắt
- 🎨 Tự động trích xuất màu chủ đạo từ thumbnail (`auto`)
- 🌈 Hỗ trợ màu hex và điều chỉnh độ sáng tùy chỉnh
- ️ Hỗ trợ thumbnail từ URL hoặe buffer
- 🔤 Hỗ trợ nhiều font quốc tế (JP / KR / Emoji)
- 🎯 **28 theme background đa dạng** - từ anime characters đến abstract designs
- 🌈 Hiệu ứng màu sắc ngẫu nhiên cho text và border
- 📏 Tự động cắt text dài để tối ưu hiển thị
- 🖼️ Tự động tải ảnh thumbnail với headers giả lập để tránh chặn
- 🎭 Themes đặc biệt: bebe, cute, miko, kobokanaeru, vestiazeta, yui và nhiều hơn nữa

## 📦 Project index

- Package: `zkcard` — API chính để tạo card
- Build: `build/` — bản dựng (index.js, index.d.ts)
- Functions: `functions/` — helper (colorFetch, adjustBrightness, rgbToHex, getAvailableThemes)
- Structures: `structures/` — layout, fonts, themes và sample images
  - fonts/ — Font quốc tế (CircularStd, NotoSans, NotoEmoji)
  - images/ — Avatar mặc định, logo và **28 theme backgrounds đa dạng**
    - **Character Themes**: bebe, cute, kobokanaeru, miko, vestiazeta, yui
    - **Abstract Themes**: themes1-20 (20 themes với design trừu tượng)
    - **Special Themes**: blank (minimal design), zk (original theme)

## 🗂️ Cấu trúc dự án

```
zkcard/
├── LICENSE — Giấy phép MIT
├── package.json — Metadata & dependencies
├── README.md — Tài liệu tiếng Việt
├── README_en.md — Tài liệu tiếng Anh
└── build/ — Bản dựng phát hành
    ├── index.js — Entry point chính
    ├── index.d.ts — TypeScript definitions
    ├── functions/ — Hàm hỗ trợ
    │   ├── adjustBrightness.js — Điều chỉnh độ sáng
    │   ├── colorFetch.js — Trích xuất màu từ ảnh
    │   ├── getAvailableThemes.js — Lấy danh sách themes
    │   └── rgbToHex.js — Chuyển đổi RGB sang Hex
    └── structures/ — Tài nguyên card
        ├── zkcard.js — Logic tạo card chính  
        ├── fonts/ — Font quốc tế
        │   ├── circularstd-black.otf
        │   ├── notoemoji-bold.ttf
        │   ├── notosans-black.ttf
        │   ├── notosans-jp-black.ttf
        │   └── notosans-kr-black.ttf
        └── images/ — Hình ảnh templates
            ├── avatar.png — Avatar mặc định
            ├── logo.png — Logo ZKCard
            ├── bebe/ — Bebe theme (1 background)
            ├── blank/ — Minimal theme (1 background)
            ├── cute/ — Cute theme (8 backgrounds)
            ├── kobokanaeru/ — Kobo Kanaeru theme (15 backgrounds)
            ├── miko/ — Miko theme (42 backgrounds)
            ├── themes1/ — Abstract theme 1 (1 background)
            ├── themes2/ — Abstract theme 2 (10 backgrounds)
            ├── themes3/ — Abstract theme 3 (10 backgrounds)
            ├── themes4/ — Abstract theme 4 (14 backgrounds)
            ├── themes5/ — Abstract theme 5 (15 backgrounds)
            ├── themes6-20/ — Abstract themes 6-20 (varied backgrounds)
            ├── vestiazeta/ — Vestia Zeta theme
            ├── yui/ — Yui theme
            └── zk/ — Original ZK theme (8 backgrounds)
```

## ⚡ Ví dụ nhanh

### Ví dụ cơ bản với method chaining

```javascript
(async () => {
  const { zkcard } = require('zkcard');
  const fs = require('fs');

  const card = new zkcard()
    .setName("Ash Again") // Tên bài hát
    .setAuthor("Gawr Gura") // Tên nghệ sĩ
    .setRequester("ZenKho") // Người yêu cầu
    .setColor("auto") // Tự động lấy màu từ thumbnail
    .setTheme("zk") // Theme khả dụng: "zk" hoặc "themes2"
    .setBrightness(50) // Độ sáng (0-255)
    .setThumbnail("https://your-image-url.com/cover.jpg")

  const cardBuffer = await card.build();
  fs.writeFileSync(`zkcard.png`, cardBuffer);
  console.log("Tạo card thành công!")
})()
```

### Ví dụ với constructor options

```javascript
(async () => {
  const { zkcard } = require('zkcard');
  const fs = require('fs');

  const card = new zkcard({
    name: "Beautiful Song",
    author: "Amazing Artist", 
    requester: "Music Lover",
    color: "#ff6b6b", // Màu hex tùy chỉnh (hoặc 'auto' để tự động)
    theme: "themes2",  // Theme card (zk hoặc themes2)
    brightness: 75,   // Độ sáng (0-255)
    thumbnail: "https://your-image-url.com/cover.jpg",
  });

  const cardBuffer = await card.build();
  fs.writeFileSync(`custom_card.png`, cardBuffer);
})()
```

### Kiểm tra themes khả dụng

```javascript
const { zkcard, getAvailableThemes } = require('zkcard');

// Lấy danh sách tất cả themes có sẵn (28 themes)
const availableThemes = getAvailableThemes();
console.log('Themes khả dụng:', availableThemes); 
// ['bebe', 'blank', 'cute', 'kobokanaeru', 'miko', 'themes1', 'themes2', ..., 'zk']

// Sử dụng theme ngẫu nhiên
const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
const card = new zkcard()
  .setName("Random Theme Song")
  .setAuthor("Artist")
  .setRequester("User")
  .setTheme(randomTheme)
  .setColor("#ff6b6b");
```

### Các tùy chọn thiết lập

| Method | Mô tả | Giá trị mặc định | Lưu ý |
|--------|-------|------------------|-------|
| `setName(string)` | Tên bài hát | **Required** | Tự động cắt nếu >15 ký tự |
| `setAuthor(string)` | Tên nghệ sĩ | **Required** | Tự động cắt nếu >15 ký tự |
| `setRequester(string)` | Người yêu cầu phát nhạc | **Required** | Tự động cắt nếu >35 ký tự |
| `setColor(string)` | Màu theme (`auto` hoặc hex) | `#ff0000` | `auto` sẽ lấy từ thumbnail |
| `setTheme(string)` | Theme card | `zk` | Xem [danh sách 28 themes](#-themes-có-sẵn) |
| `setBrightness(number)` | Độ sáng (0-255) | `0` | Chỉ áp dụng khi color=`auto` |
| `setThumbnail(string)` | URL thumbnail | Avatar mặc định | Hỗ trợ URL và data URI |

### Tính năng nổi bật v1.5.9

- 🎨 **28 Background Themes đa dạng**: 
  - **Character themes**: bebe, cute, kobokanaeru, miko (42 backgrounds), vestiazeta, yui
  - **Abstract themes**: themes1-20 với design trừu tượng độc đáo
  - **Special themes**: blank (minimal), zk (original)
- 🌈 **Random Color System**: 
  - Tên bài hát: 6 màu được phép (#000000, #FF0000, #FFFFFF, #800080, #000080, #2F4F4F)
  - Thumbnail border: Màu trắng với hiệu ứng shadow
- 📏 **Smart Text Truncation**: Tự động cắt text dài và thêm "..." 
- 🖼️ **Enhanced Visual**: Rounded corners, gradient effects và professional layout
- 🔗 **Improved Image Loading**: Headers giả lập để tránh bị chặn khi tải thumbnail
- 🎯 **Optimized Performance**: Cải thiện tốc độ render và memory usage
- 🎭 **Theme Variety**: Từ anime characters đến abstract art, phù hợp mọi sở thích

## 🎨 Themes có sẵn

ZKCard cung cấp **28 themes đa dạng** được chia thành các nhóm sau:

### 👥 Character Themes (6 themes)
- `bebe` - Bebe theme với 1 background
- `cute` - Cute theme với 8 backgrounds đáng yêu
- `kobokanaeru` - Kobo Kanaeru theme với 15 backgrounds
- `miko` - Miko theme với 42 backgrounds phong phú nhất
- `vestiazeta` - Vestia Zeta theme
- `yui` - Yui theme

### 🌈 Abstract Themes (20 themes)
- `themes1` đến `themes20` - Các design trừu tượng và nghệ thuật
- Mỗi theme có từ 1-15 backgrounds khác nhau
- Phong cách đa dạng từ minimalist đến vibrant

### ⭐ Special Themes (2 themes)
- `blank` - Minimal design với canvas 800x200, phù hợp cho simple card
- `zk` - Original ZK theme với 8 backgrounds kinh điển

### 🖼️ Xem Preview
Để xem preview tất cả themes, chạy lệnh sau:

```bash
# Clone repo và tạo preview
git clone https://github.com/ZenKho-chill/zkcard.git
cd zkcard
npm install
node test.js

# Mở file preview/README.md để xem gallery với tất cả 28 themes
```

**🔗 [Xem Preview Gallery Đầy Đủ](./preview/README.md)**

### 📋 Danh sách themes theo category:

#### 👥 Character Themes:
- [`bebe`](./preview/README.md#bebe) - [`cute`](./preview/README.md#cute) - [`kobokanaeru`](./preview/README.md#kobokanaeru) 
- [`miko`](./preview/README.md#miko) - [`vestiazeta`](./preview/README.md#vestiazeta) - [`yui`](./preview/README.md#yui)

#### 🌈 Abstract Themes:
- [`themes1`](./preview/README.md#themes1) - [`themes2`](./preview/README.md#themes2) - [`themes3`](./preview/README.md#themes3) - [`themes4`](./preview/README.md#themes4) - [`themes5`](./preview/README.md#themes5)
- [`themes6`](./preview/README.md#themes6) - [`themes7`](./preview/README.md#themes7) - [`themes8`](./preview/README.md#themes8) - [`themes9`](./preview/README.md#themes9) - [`themes10`](./preview/README.md#themes10)
- [`themes11`](./preview/README.md#themes11) - [`themes12`](./preview/README.md#themes12) - [`themes13`](./preview/README.md#themes13) - [`themes14`](./preview/README.md#themes14) - [`themes15`](./preview/README.md#themes15)
- [`themes16`](./preview/README.md#themes16) - [`themes17`](./preview/README.md#themes17) - [`themes18`](./preview/README.md#themes18) - [`themes19`](./preview/README.md#themes19) - [`themes20`](./preview/README.md#themes20)

#### ⭐ Special Themes:
- [`blank`](./preview/README.md#blank) - [`zk`](./preview/README.md#zk)

Hoặc sử dụng code để tạo preview:

```javascript
const { zkcard, getAvailableThemes } = require('zkcard');

// Tạo preview cho theme cụ thể
async function createPreview(themeName) {
  const card = new zkcard({
    name: 'Preview Song',
    author: 'Artist Name',
    requester: 'Preview User',
    theme: themeName,
    color: 'auto',
    brightness: 80
  });
  
  const buffer = await card.build();
  require('fs').writeFileSync(`${themeName}_preview.png`, buffer);
  console.log(`Preview cho ${themeName} đã được tạo!`);
}

// Tạo preview cho tất cả themes
getAvailableThemes().forEach(theme => createPreview(theme));
```

## 🔐 License

Dự án này được cấp phép theo MIT — xem file `LICENSE` để biết chi tiết.

## 🔁 Chuyển đổi ngôn ngữ

Muốn xem README bằng tiếng Anh? Mở [README_en.md](README_en.md).

---

**Tác giả:** ZenKho-chill — https://github.com/ZenKho-chill