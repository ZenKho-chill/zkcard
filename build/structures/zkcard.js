const canvas = require('@napi-rs/canvas');
const { colorFetch } = require('../functions/colorFetch');

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
    this.starttime = options?.startTime ?? null;
    this.endtime = options?.endTime ?? null;
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

    let validatedProgress = parseFloat(this.progress);
    if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Giá trị progress phải là một số trong khoảng từ 0 đến 100');

    if (validatedProgress < 2) validatedProgress = 2;
    if (validatedProgress > 99) validatedProgress = 99;

    const validatedColor = await colorFetch(
      this.color || 'ff0000', // Mặc định là màu đỏ nếu không có giá trị color
      parseInt(this.brightness) || 0,
      this.thumbnail
    );

    if (this.name.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
    if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}...`;
    if (this.requester.replace(/\s/g, '').length > 35) this.requester = `${this.requester.slice(0, 35)}...`;

    if (this.theme === 'classic') {
      const frame = canvas.createCanvas(800, 200);
      const ctx = frame.getContext('2d');

      const progressBarWidth = (validatedProgress / 100) * 670;
      const circleX = progressBarWidth + 60;

      function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }


      const circleCanvas = canvas.createCanvas(1000, 1000);
      const circleCtx = circleCanvas.getContext('2d');

      const circleRadius = 20;
      const circleY = 97;

      // URL hình ảnh được chọn ngẫu nhiên
      const imageUrls = [
        // Theme 1
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/1.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/2.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/3.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/4.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/5.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/6.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/7.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes1/8.png',
        // Theme 2
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/1.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/2.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/3.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/4.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/5.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/6.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/7.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/8.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/9.png',
        'https://raw.githubusercontent.com/ZenKho-chill/zkcard/0d81720c3e0c1f5737e1c90107ee059437b77082/build/structures/images/themes2/10.png',
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
      const _avatarFallback = `https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/avatar.png`;

      let thumbnailSource = this.thumbnail;
      const isString = typeof thumbnailSource === 'string';
      const imageExtRegex = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i;
      const isDataImage = isString && /^data:image\//i.test(thumbnailSource);
      const hasImageExt = isString && imageExtRegex.test(thumbnailSource);

      if (!isString || (!isDataImage && !hasImageExt)) {
        thumbnailSource = _avatarFallback;
      }

      try {
        thumbnailImage = await canvas.loadImage(thumbnailSource, {
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            }
          }
        });
      } catch (err) {
        thumbnailImage = await canvas.loadImage(_avatarFallback);
      }

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 45, 35, 190, 140);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(45, 35, 190, 140, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#000000',
        '#FF0000',
        '#FFFFFF',
        '#800080',
        '#000080',
        '#2F4F4F'
      ]

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
      ctx.fillStyle = getRandomColor(); // Sử dụng màu ngẫu nhiên
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.font = "bold 30px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(authorText, 250, 143);

      // Đo kích thước của tên tác giả để tính toán vị trí vẽ tên người yêu cầu
      const authorTextWidth = ctx.measureText(authorText).width;

      // Vẽ tên người yêu cầu
      const requesterText = this.requester;
      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(requesterText, 250 + authorTextWidth + 15, 143);

      return frame.toBuffer("image/png");
    } else {
      throw new Error('Theme không hợp lệ. Hiện tại chỉ hỗ trợ theme "classic".');
    }
  }
}

module.exports = { zkcard };