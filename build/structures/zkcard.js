const canvas = require('@napi-rs/canvas');
const { colorFetch } = require('../functions/colorFetch');
const { getAvailableThemes } = require('../functions/getAvailableThemes');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'circularstd-black.otf'), "circular-std");
canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'notosans-jp-black.ttf'), "noto-sans-jp");
canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'notosans-black.ttf'), "noto-sans");
canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'notoemoji-bold.ttf'), "noto-emoji");
canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'notosans-kr-black.ttf'), "noto-sans-kr");

/**
 * Load image từ URL với headers
 * @param {string} url - URL của image
 * @returns {Promise<Buffer>} - Buffer của image
 */
async function loadImageWithHeaders(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    // Giả lập headers
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
    
    const req = client.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      res.on('error', reject);
    });

    req.on('error', (err) => {
      reject(err);
    });

    // Timeout sau 10 giây
    req.setTimeout(10000, () => {
      req.destroy();
    });
  });
}

/**
 * Load thumbnail với headers giả lập
 * @param {string} thumbnailSource - Đường dẫn hoặc URL của thumbnail
 * @param {string} themeName - Tên theme cho log
 * @returns {Promise<any>} - Canvas image object
 */
async function loadThumbnailWithHeaders(thumbnailSource, themeName) {
  const _avatarFallback = path.join(__dirname, 'images', 'avatar.png');
  
  const isString = typeof thumbnailSource === 'string';
  const imageExtRegex = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i;
  const isDataImage = isString && /^data:image\//i.test(thumbnailSource);
  const hasImageExt = isString && imageExtRegex.test(thumbnailSource);
  const isLocalFile = isString && !isDataImage && fs.existsSync(thumbnailSource);
  const isUrl = isString && (thumbnailSource.startsWith('http://') || thumbnailSource.startsWith('https://'));

  let finalSource = thumbnailSource;
  if (!isString || (!isDataImage && !hasImageExt && !isLocalFile && !isUrl)) {
    finalSource = _avatarFallback;
  }

  try {
    // Load ảnh với xử lý khác nhau cho từng loại
    if (isUrl && !isLocalFile) {
      const imageBuffer = await loadImageWithHeaders(finalSource);
      return await canvas.loadImage(imageBuffer);
    } else {
      return await canvas.loadImage(finalSource);
    }
  } catch (err) {
    return await canvas.loadImage(_avatarFallback);
  }
}

class zkcard {
  constructor(options) {
    this.name = options?.name ?? null;
    this.author = options?.author ?? null;
    this.color = options?.color ?? null;
    this.theme = options?.theme ?? null;
    this.brightness = options?.brightness ?? null;
    this.thumbnail = options?.thumbnail ?? null;
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

  setRequester(requester) {
    this.requester = `${requester}`;
    return this;
  }

  async build() {
    if (!this.name) throw new Error('Thiếu giá trị name');
    if (!this.author) throw new Error('Thiếu giá trị author');
    if (!this.requester) throw new Error('Thiếu giá trị requester');
    if (!this.color) this.setColor('ff0000'); // Màu mặc định nếu không có giá trị color(đỏ)
    if (!this.theme) this.setTheme('themes1'); // Mặc định là theme theme1
    if (!this.brightness) this.setBrightness(0); // Mặc định là độ sáng 0
    if (!this.thumbnail) this.setThumbnail(path.join(__dirname, 'images', 'avatar.png')); // Mặc định là ảnh đại diện của zkcard

    const validatedColor = await colorFetch(
      this.color || 'ff0000', // Mặc định là màu đỏ nếu không có giá trị color
      parseInt(this.brightness) || 0,
      this.thumbnail
    );

    if (this.name.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
    if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}...`;
    if (this.requester.replace(/\s/g, '').length > 35) this.requester = `${this.requester.slice(0, 35)}...`;

    if (this.theme === 'themes1') {
      const frame = canvas.createCanvas(800, 200);
      const ctx = frame.getContext('2d');

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

      // Đường dẫn tới các ảnh background theme1
      const themesPath = path.join(__dirname, 'images', 'themes1');
      
      // Lấy danh sách tất cả file png trong folder themes1
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục themes1:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục themes1');
        }
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        return imageFiles[randomIndex];
      }

      // Tải hình ảnh từ file local
      const backgroundPath = getRandomImagePath();
      const background = await canvas.loadImage(backgroundPath);
      ctx.drawImage(background, 0, 0, frame.width, frame.height);

      const thumbnailCanvas = canvas.createCanvas(800, 200); // Thay đổi kích thước canvas
      const thumbnailCtx = thumbnailCanvas.getContext('2d');

      // Load thumbnail với headers giả lập
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'themes1');

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
    } else if (this.theme === 'themes2') {
      const frame = canvas.createCanvas(800, 200);
      const ctx = frame.getContext('2d');

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

      // Đường dẫn tới các ảnh background theme2
      const themesPath = path.join(__dirname, 'images', 'themes2');
      
      // Lấy danh sách tất cả file png trong folder themes2
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục themes2:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục themes2');
        }
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        return imageFiles[randomIndex];
      }

      // Tải hình ảnh từ file local
      const backgroundPath = getRandomImagePath();
      const background = await canvas.loadImage(backgroundPath);
      ctx.drawImage(background, 0, 0, frame.width, frame.height);

      const thumbnailCanvas = canvas.createCanvas(800, 200); // Thay đổi kích thước canvas
      const thumbnailCtx = thumbnailCanvas.getContext('2d');

      // Load thumbnail với headers giả lập
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'themes2');

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
      const availableThemes = getAvailableThemes();
      
      // Kiểm tra xem theme có tồn tại trong danh sách không
      if (availableThemes.includes(this.theme)) {
        // Theme hợp lệ nhưng chưa có config
        console.warn(`⚠️  THEME CHƯA ĐƯỢC CẤU HÌNH: Theme '${this.theme}' là một theme hợp lệ (có folder và ảnh) nhưng chưa được implement trong code.`);
        console.warn(`📋 VUI LÒNG BÁO CÁO VỚI ADMIN: Theme '${this.theme}' cần được thêm cấu hình xử lý.`);
        console.warn(`🔧 Thông tin kỹ thuật: Cần thêm logic xử lý trong hàm build() cho theme '${this.theme}'`);
        console.warn(`🔧 Bạn có thể gửi issues tại: https://github.com/ZenKho-chill/zkcard/issues`);
        
        throw new Error(`Theme '${this.theme}' hiện tại chưa được hỗ trợ.\nVui lòng báo cáo với admin để được hỗ trợ thêm theme này.`);
      } else {
        // Theme không tồn tại
        throw new Error(`Theme '${this.theme}' không hợp lệ.\nCác theme khả dụng: ${availableThemes.join(', ')}`);
      }
    }
  }
}

module.exports = { zkcard };