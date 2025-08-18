const canvas = require('@napi-rs/canvas');
const colorFetch = require('../functions/colorFetch');

canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/circularstd-black.otf`, "circular-std");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notosans-jp-black.ttf`, "noto-sans-jp");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notosans-black.ttf`, "noto-sans");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notoemoji-bold.ttf`, "noto-emoji");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notosans-kr-black.ttf`, "noto-sans-kr");

class zkcard {
  constructor(options) {
    this.name = options?.name ?? null;
    this.author = options?.author ?? null;
    this.color = options?.color ?? null;
    this.theme = options?.theme ?? null;
    this.brightness = options?.brightness ?? null;
    this.thumbnail = options?.thumbnail ?? null;
    this.progress = options?.progress ?? null;
    this.starttime = options?.starttime ?? null;
    this.endtime = options?.endtime ?? null;
    this.requester = options?.requester ?? null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setAuthor(author) {
    this.author = author;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setTheme(theme) {
    this.theme = theme;
    return this;
  }

  setBrightness(brightness) {
    this.brightness = brightness;
    return this;
  }

  setThumbnail(thumbnail) {
    this.thumbnail = thumbnail;
    return this;
  }

  setProgress(progress) {
    this.progress = progress;
    return this;
  }

  setStartTime(starttime) {
    this.starttime = starttime;
    return this;
  }

  setEndTime(endtime) {
    this.endtime = endtime;
    return this;
  }

  setRequester(requester) {
    this.requester = `${requester}`;
    return this;
  }

  async build() {
    if (!this.name) throw new Error('Thiếu giá trị name');
    if (!this.author) throw new Error('Thiếu giá trị author');
    if (!this.requester) throw new Error('Thiếu giá trị requester');
    if (!this.color) this.setColor('ff0000'); // Màu mặc định nếu không có giá trị color(đỏ)
    if (!this.theme) this.setTheme('classic'); // Mặc định là theme classic
    if (!this.brightness) this.setBrightness(0); // Mặc định là độ sáng 0
    if (!this.thumbnail) this.setThumbnail('https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/avatar.png'); // Mặc định là ảnh đại diện của zkcard
    if (!this.progress) this.setProgress(0); // Mặc định là tiến trình 0
    if (!this.starttime) this.setStartTime('0:00'); // Mặc định là thời gian bắt đầu 0:00
    if (!this.endtime) this.setEndTime('0:00'); // Mặc định là thời gian kết thúc 0:00

    let validatedProgress = parseFloat(this.progress);
    if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Giá trị progress phải là một số trong khoảng từ 0 đến 100');

    if (validatedProgress < 2) validatedProgress = 2;
    if (validatedProgress > 99) validatedProgress = 99;

    const validatedStartTime = this.starttime || '0.00';
    const validatedEndTime = this.endtime || '0.00';

    const validatedColor = await colorFetch(
      this.color || 'ff0000', // Mặc định là màu đỏ nếu không có giá trị color
      parseInt(this.brightness) || 0,
      this.thumbnail
    );

    if (thisname.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
    if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}...`;
    if (this.requester.replace(/\s/g, '').length > 35) this.requester = `${this.requester.slice(0, 35)}...`;

    if (this.theme === 'classic') {
      const frame = canvas.createCanvas(800, 200);
      const ctx = frame.getContext('2d');

      const progressBarWidth = (validatedProgress / 100) * 670;
      const circleX = progressBarWidth + 60;

      const progressBarCanvas = canvas.createCanvas(670, 25);
      const progressBarCtx = progressBarCanvas.getContext('2d');
      const cornerRadius = 10;

      progressBarCtx.beginPath();
      progressBarCtx.moveTo(cornerRadius, 0);
      progressBarCtx.lineTo(670 - cornerRadius, 0);
      progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
      progressBarCtx.lineTo(670, 25 - cornerRadius);
      progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
      progressBarCtx.lineTo(cornerRadius, 25);
      progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
      progressBarCtx.lineTo(0, cornerRadius);
      progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
      progressBarCtx.closePath();
      progressBarCtx.fillStyle = '#ababab';
      progressBarCtx.fill();
      progressBarCtx.beginPath();
      progressBarCtx.moveTo(cornerRadius, 0);
      progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
      progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
      progressBarCtx.lineTo(progressBarWidth, 25);
      progressBarCtx.lineTo(cornerRadius, 25);
      progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
      progressBarCtx.lineTo(0, cornerRadius);
      progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
      progressBarCtx.closePath();
      progressBarCtx.fillStyle = `#${validatedColor}`;
      progressBarCtx.fill();

      const circleCanvas = canvas.createCanvas(1000, 1000);
      const circleCtx = circleCanvas.getContext('2d');

      const circleRadius = 20;
      const circleY = 97;

      // URL hình ảnh được chọn ngẫu nhiên
      const imageUrls = [
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/1.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/2.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/3.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/4.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/5.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/6.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/7.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/8.png',
        // Thêm các URL hình ảnh khác nếu cần
      ];

      // Lấy URL an toàn từ mảng
      function getRandomImageUrl() {
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        return imageUrls[randomIndex];
      }

      // Tải hình ảnh từ URL
      const backgroundUrl = getRandomImageUrl();
      const background = await canvas.loadImage(backgroundUrl);
      ctx.drawImage(background, 0, 0, frame.width, frame.height);

      const thumbnailCanvas = canvas.createCanvas(800, 200); // Thay đổi kích thước canvas
      const thumbnailCtx = thumbnailCanvas.getContext('2d');

      let thumbnailImage;

      thumbnailImage = await canvas.loadImage(this.thumbnail, {
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          }
        }
      }).catch(() => {
        thumbnailImage = canvas.loadImage(`https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/avatar.png`);
      })

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 5, 40, 180, 130);

      // Thêm đường viền màu trắng
      ctx.strokeStyle = '#fff'; // Màu trắng
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.strokeRect(50, 40, 180, 130); // Vẽ đường viền quanh hình thu nhỏ

      // Hàm tạo màu hex ngẫu nhiên
      // Mảng chứa các màu sắc
      const allowedColors = [
        '#000000',
        '#FF0000',
        '#FFFFFF',
        '#800080',
        '#000080',
        '#2F4F4F'
      ];

      // Chọn màu ngẫu nhiên từ mảng
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Chọn màu ngẫu nhiên từ mảng được phép
      ctx.font = "bold 38px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
      ctx.fillStyle = getRandomColor(); // Sử dụng màu ngẫu nhiên
      ctx.fillText(this.name, 250, 90);

      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";

      // Vẽ tên tác giả
      ctx.fillStyle = '#FF0000'
      ctx.fillText(this.author, 250, 120);

      // Vẽ tên người yêu cầu
      ctx.fillStyle = getRandomColor();
      ctx.fillText(this.requester, 250 + ctx.measureText(this.author).width + 10, 120);

      ctx.fillStyle = '#000000';
      ctx.font = "17px circular-std";
      ctx.fillText(validatedStartTime, 270, 160);

      ctx.fillStyle = '#000000';
      ctx.font - "18px circular-std";
      ctx.fillText(validatedEndTime, 550, 160);

      ctx.drawImage(progressBarCanvas, 270, 140, 330, 5);
      ctx.drawImage(circleCanvas, 10, 255, 1000, 1000);

      return frame.toBuffer("image/png");
    } else {
      throw new Error('Theme không hợp lệ. Hiện tại chỉ hỗ trợ theme "classic".');
    }
  }
}

module.exports = { zkcard };