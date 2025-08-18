# ZKCard

Một thư viện Node.js để tạo các thẻ card đẹp mắt với nhiều tùy chỉnh cho các ứng dụng âm nhạc và media.

## Cài đặt

```bash
npm install zkcard
```

## Tính năng

- ✨ Tạo các thẻ card với thiết kế đẹp mắt
- 🎨 Tự động trích xuất màu sắc từ hình ảnh thumbnail
- 🌈 Hỗ trợ tùy chỉnh màu sắc và độ sáng
- 📊 Hiển thị thanh tiến trình với animation
- 🖼️ Hỗ trợ hình ảnh thumbnail từ URL
- 🎯 Tự động cắt và resize hình ảnh
- 🌍 Hỗ trợ nhiều font chữ quốc tế (tiếng Nhật, tiếng Hàn, emoji)

## Sử dụng cơ bản

```javascript
const { zkcard } = require('zkcard');

// Tạo card đơn giản
const card = new zkcard({
  name: "Tên bài hát",
  author: "Tên nghệ sĩ", 
  requester: "Người yêu cầu",
  progress: 45,
  startTime: "1:30",
  endTime: "3:45"
});

// Tạo buffer ảnh
const imageBuffer = await card.build();

// Lưu file hoặc gửi qua Discord/Telegram
require('fs').writeFileSync('card.png', imageBuffer);
```

## API Reference

### Constructor

```javascript
new zkcard(options)
```

#### Options

| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| `name` | string | null | Tên bài hát hoặc nội dung chính |
| `author` | string | null | Tên nghệ sĩ hoặc tác giả |
| `requester` | string | null | Tên người yêu cầu |
| `color` | string | 'ff0000' | Màu chủ đạo (hex code) |
| `theme` | string | 'classic' | Theme hiển thị |
| `brightness` | number | 0 | Độ sáng (-255 đến 255) |
| `thumbnail` | string | default avatar | URL hình ảnh thumbnail |
| `progress` | number | 0 | Tiến trình (0-100) |
| `startTime` | string | '0:00' | Thời gian bắt đầu |
| `endTime` | string | '0:00' | Thời gian kết thúc |

### Phương thức

#### Setter Methods (Chainable)

```javascript
card.setName(name: string)
card.setAuthor(author: string)  
card.setRequester(requester: string)
card.setColor(color: string)
card.setTheme(theme: string)
card.setBrightness(brightness: number)
card.setThumbnail(thumbnail: string)
card.setProgress(progress: number)
card.setStartTime(startTime: string)
card.setEndTime(endTime: string)
```

#### Build Method

```javascript
card.build(): Promise<Buffer>
```

Trả về Promise với Buffer của ảnh PNG.

## Ví dụ nâng cao

### Tạo card với màu tự động từ thumbnail

```javascript
const card = new zkcard()
  .setName("Shape of You")
  .setAuthor("Ed Sheeran")
  .setRequester("Music Lover")
  .setThumbnail("https://example.com/album-cover.jpg")
  .setColor("auto") // Tự động trích xuất màu từ hình ảnh
  .setBrightness(50) // Tăng độ sáng
  .setProgress(65)
  .setStartTime("2:15")
  .setEndTime("4:20");

const buffer = await card.build();
```

### Tạo card với màu tùy chỉnh

```javascript
const card = new zkcard({
  name: "Nơi Này Có Anh",
  author: "Sơn Tùng M-TP",
  requester: "Vpop Fan",
  color: "00ff00", // Màu xanh lá
  brightness: -30, // Giảm độ sáng
  progress: 80,
  startTime: "1:45",
  endTime: "3:30",
  thumbnail: "https://example.com/sontung.jpg"
});

const imageBuffer = await card.build();
```

## Xử lý lỗi

```javascript
try {
  const card = new zkcard({
    // name, author, requester là bắt buộc
    name: "Test Song",
    author: "Test Artist", 
    requester: "Test User",
    progress: 150 // Lỗi: progress phải từ 0-100
  });
  
  const buffer = await card.build();
} catch (error) {
  console.error('Lỗi tạo card:', error.message);
}
```

## Các lỗi thường gặp

- `Thiếu giá trị name` - Chưa cung cấp tên bài hát
- `Thiếu giá trị author` - Chưa cung cấp tên tác giả  
- `Thiếu giá trị requester` - Chưa cung cấp tên người yêu cầu
- `Giá trị progress phải là một số trong khoảng từ 0 đến 100` - Progress không hợp lệ
- `Theme không hợp lệ` - Chỉ hỗ trợ theme "classic"

## Giới hạn

- Tên bài hát tối đa 15 ký tự (tự động cắt)
- Tên tác giả tối đa 15 ký tự (tự động cắt)  
- Tên người yêu cầu tối đa 35 ký tự (tự động cắt)
- Progress từ 0-100 (tự động điều chỉnh về 2-99 để hiển thị)
- Hiện tại chỉ hỗ trợ theme "classic"

## Dependencies

- `@napi-rs/canvas` - Vẽ canvas và xử lý hình ảnh
- `color-thief-node` - Trích xuất màu sắc từ hình ảnh

## Tác giả

**ZenKho-chill** - [GitHub](https://github.com/ZenKho-chill)

## License

ISC License

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request trên GitHub.

## Changelog

### v1.0.0
- Phiên bản đầu tiên
- Hỗ trợ theme "classic"
- Tự động trích xuất màu từ thumbnail
- Hỗ trợ nhiều font chữ quốc tế
