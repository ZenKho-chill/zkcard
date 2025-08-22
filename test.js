(async () => {
  const { zkcard } = require('./build/index');
  const fs = require('fs');

  const card = new zkcard()
    .setName("Ash Again") // Tên bài hát
    .setAuthor("Gawr Gura") // Tên nghệ sĩ
    .setRequester("ZenKho") // Người yêu cầu
    .setColor("auto") // Tự động lấy màu từ thumbnail
    .setTheme("themes4") // Theme khả dụng: "zk" hoặc "theme2"
    .setBrightness(50) // Độ sáng (0-255)
    .setThumbnail("https://i.scdn.co/image/ab67616d00001e0267f1c00d9d2ed28e76e303bd")

  const cardBuffer = await card.build();
  fs.writeFileSync(`zkcard.png`, cardBuffer);
  console.log("Tạo card thành công!")
})()