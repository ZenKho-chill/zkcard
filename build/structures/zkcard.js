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
canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'Chewy-Regular.ttf'), "chewy");
canvas.GlobalFonts.registerFromPath(path.join(__dirname, 'fonts', 'Space.ttf', "space"));

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
      // Kiểm tra status code
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage || 'Unknown error'} khi tải ảnh từ ${url}`));
        return;
      }

      // Kiểm tra content-type có phải là ảnh không
      const contentType = res.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        reject(new Error(`Content-Type không phải là ảnh: ${contentType} từ ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length === 0) {
          reject(new Error(`Dữ liệu ảnh rỗng từ ${url}`));
          return;
        }
        resolve(buffer);
      });
      res.on('error', reject);
    });

    req.on('error', (err) => {
      reject(new Error(`Lỗi kết nối khi tải ảnh từ ${url}: ${err.message}`));
    });

    // Timeout sau 10 giây
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout khi tải ảnh từ ${url} (>10s)`));
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

  // Kiểm tra nếu thumbnailSource không phải là string hoặc là null/undefined
  if (!thumbnailSource || typeof thumbnailSource !== 'string') {
    return await canvas.loadImage(_avatarFallback);
  }

  const isString = typeof thumbnailSource === 'string';
  const imageExtRegex = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i;
  const isDataImage = isString && /^data:image\//i.test(thumbnailSource);
  const hasImageExt = isString && imageExtRegex.test(thumbnailSource);
  const isLocalFile = isString && !isDataImage && fs.existsSync(thumbnailSource);
  const isUrl = isString && (thumbnailSource.startsWith('http://') || thumbnailSource.startsWith('https://'));

  // Kiểm tra validation cơ bản
  let finalSource = thumbnailSource;
  if (!isDataImage && !hasImageExt && !isLocalFile && !isUrl) {
    finalSource = _avatarFallback;
  }

  // Kiểm tra nếu là file local nhưng không tồn tại
  if (isString && !isDataImage && !isUrl && hasImageExt && !fs.existsSync(thumbnailSource)) {
    finalSource = _avatarFallback;
  }

  try {
    // Load ảnh với xử lý khác nhau cho từng loại
    if (isUrl && !isLocalFile) {
      try {
        const imageBuffer = await loadImageWithHeaders(finalSource);
        // Kiểm tra nếu buffer có dữ liệu
        if (!imageBuffer || imageBuffer.length === 0) {
          return await canvas.loadImage(_avatarFallback);
        }
        return await canvas.loadImage(imageBuffer);
      } catch (urlError) {
        return await canvas.loadImage(_avatarFallback);
      }
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
    if (!this.theme) this.setTheme('zk'); // Mặc định là theme zk
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

    if (this.theme === 'zk') {
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

      // Đường dẫn tới các ảnh background zk
      const themesPath = path.join(__dirname, 'images', 'zk');

      // Lấy danh sách tất cả file png trong folder zk
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục zk:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục zk');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'zk');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 45, 35, 190, 140);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#f2d7b7';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(45, 35, 190, 140, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#77797c',
        '#0641c7',
        '#967e58',
        '#628fa4',
        '#d34d52',
        '#f00c8f'
      ]

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor(); // Sử dụng màu ngẫu nhiên
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
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
    } else if (this.theme === 'kobokanaeru') {
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

      // Đường dẫn tới các ảnh background kobokanaeru
      const themesPath = path.join(__dirname, 'images', 'kobokanaeru');

      // Lấy danh sách tất cả file png trong folder kobokanaeru
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục kobokanaeru:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục kobokanaeru');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'kobokanaeru');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#79b8d5';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(50, 40, 180, 130, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#FF0000',
        '#FFFFFF',
        '#800080',
        '#000080',
        '#2F4F4F'
      ];

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(authorText, 250, 140);

      // Đo kích thước của tên tác giả để tính toán vị trí vẽ tên người yêu cầu
      const authorTextWidth = ctx.measureText(authorText).width;

      // Vẽ tên người yêu cầu (kích thước và phông chữ khác nhau)
      const requesterText = this.requester;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140);

      return frame.toBuffer("image/png");
    } else if (this.theme === 'bebe') {
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

      // Đường dẫn tới các ảnh background bebe
      const themesPath = path.join(__dirname, 'images', 'bebe');

      // Lấy danh sách tất cả file png trong folder bebe
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục bebe:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục bebe');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'bebe');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#f2d7b7';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(50, 40, 180, 130, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#77797c',
        '#0641c7',
        '#967e58',
        '#628fa4',
        '#d34d52',
        '#f00c8f'
      ];

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(authorText, 250, 140);

      // Đo kích thước của tên tác giả để tính toán vị trí vẽ tên người yêu cầu
      const authorTextWidth = ctx.measureText(authorText).width;

      // Vẽ tên người yêu cầu (kích thước và phông chữ khác nhau)
      const requesterText = this.requester;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140);

      return frame.toBuffer("image/png");
    } else if (this.theme === 'vestiazeta') {
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

      // Đường dẫn tới các ảnh background vestiazeta
      const themesPath = path.join(__dirname, 'images', 'vestiazeta');

      // Lấy danh sách tất cả file png trong folder vestiazeta
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục vestiazeta:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục vestiazeta');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'vestiazeta');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#f2d7b7';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(50, 40, 180, 130, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#b6b5ba',
        '#b2a085',
        '#747fa6',
        '#fef7f1',
        '#d6d5dd',
        '#b0c8ea'
      ];

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(authorText, 250, 140);

      // Đo kích thước của tên tác giả để tính toán vị trí vẽ tên người yêu cầu
      const authorTextWidth = ctx.measureText(authorText).width;

      // Vẽ tên người yêu cầu (kích thước và phông chữ khác nhau)
      const requesterText = this.requester;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140);

      return frame.toBuffer("image/png");
    } else if (this.theme === 'cute') {
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

      // Đường dẫn tới các ảnh background cute
      const themesPath = path.join(__dirname, 'images', 'cute');

      // Lấy danh sách tất cả file png trong folder cute
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục cute:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục cute');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'cute');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#f4e0c7';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(50, 40, 180, 130, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#96dcfc',
        '#b6b5ba',
        '#f4e0c7',
        '#e2b379',
        '#f9cfc2',
        '#ff4158'
      ];

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(authorText, 250, 140);

      // Đo kích thước của tên tác giả để tính toán vị trí vẽ tên người yêu cầu
      const authorTextWidth = ctx.measureText(authorText).width;

      // Vẽ tên người yêu cầu (kích thước và phông chữ khác nhau)
      const requesterText = this.requester;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140);

      return frame.toBuffer("image/png");
    } else if (this.theme === 'yui') {
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

      // Đường dẫn tới các ảnh background yui
      const themesPath = path.join(__dirname, 'images', 'yui');

      // Lấy danh sách tất cả file png trong folder yui
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục yui:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục yui');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'yui');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#f2d7b7';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(50, 40, 180, 130, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#f2d7b7',
        '#fbc5f9',
        '#00ff2a',
        '#ff00a8',
        '#00ffe4',
        '#ff6000'
      ];

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(authorText, 250, 140);

      // Đo kích thước của tên tác giả để tính toán vị trí vẽ tên người yêu cầu
      const authorTextWidth = ctx.measureText(authorText).width;

      // Vẽ tên người yêu cầu (kích thước và phông chữ khác nhau)
      const requesterText = this.requester;
      ctx.fillStyle = getRandomColor();
      ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140);

      return frame.toBuffer("image/png");
    } else if (this.theme === 'themes1') { 
      // Đường dẫn tới các ảnh background themes1
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

      const thumbnailCanvas = canvas.createCanvas(650, 650);
      const thumbnailCtx = thumbnailCanvas.getContext('2d');

      // Load thumbnail với headers giả lập
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'themes1');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      const cornerRadius = 45;

      thumbnailCtx.beginPath();
      thumbnailCtx.moveTo(0 + cornerRadius, 0);
      thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius);
      thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius);
      thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius);
      thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius);
      thumbnailCtx.closePath();
      thumbnailCtx.clip();

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      const image = canvas.createCanvas(1280, 450);
      const ctx = image.getContext('2d');

      // Draw the background
      ctx.drawImage(background, 0, 0, 1280, 450);

      // Vẽ tên bài hát
      ctx.fillStyle = `#${validatedColor}`;
      ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space`;
      ctx.fillText(this.name, 490, 180);

      // Vẽ tên tác giả
      ctx.fillStyle = '#f40cb5';
      ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space`;
      ctx.fillText(this.author, 510, 260);

      // Vẽ tên người yêu cầu
      ctx.fillStyle = '#0cf4bb';
      ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space`;
      ctx.fillText(this.requester, 520, 330);

      // Vẽ thumbnail
      ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);

      return image.toBuffer('image/png');
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

      // Đường dẫn tới các ảnh background themes2
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
      ctx.strokeStyle = '#f00c8f';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(45, 35, 190, 140, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#77797c',
        '#0641c7',
        '#967e58',
        '#628fa4',
        '#d34d52',
        '#f00c8f'
      ]

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor(); // Sử dụng màu ngẫu nhiên
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
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
    } else if (this.theme === 'themes3') {
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

      // Đường dẫn tới các ảnh background themes3
      const themesPath = path.join(__dirname, 'images', 'themes3');

      // Lấy danh sách tất cả file png trong folder themes3
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục themes3:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục themes3');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'themes3');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 45, 35, 190, 140);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#f2d7b7';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(45, 35, 190, 140, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#f2d7b7',
        '#cc8eca',
        '#00ff2a',
        '#13776c',
        '#ffffff'
      ]

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor(); // Sử dụng màu ngẫu nhiên
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
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
    } else if (this.theme === 'themes4') {
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

      // Đường dẫn tới các ảnh background themes4
      const themesPath = path.join(__dirname, 'images', 'themes4');

      // Lấy danh sách tất cả file png trong folder themes4
      function getThemeImages() {
        try {
          const files = fs.readdirSync(themesPath);
          return files.filter(file => file.endsWith('.png')).map(file => path.join(themesPath, file));
        } catch (error) {
          console.error('Không thể đọc thư mục themes4:', error);
          return [];
        }
      }

      // Lấy ảnh ngẫu nhiên từ folder
      function getRandomImagePath() {
        const imageFiles = getThemeImages();
        if (imageFiles.length === 0) {
          throw new Error('Không tìm thấy ảnh nào trong thư mục themes4');
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
      const thumbnailImage = await loadThumbnailWithHeaders(this.thumbnail, 'themes4');

      const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
      const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
      const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

      thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Vẽ hình thu nhỏ
      ctx.drawImage(thumbnailCanvas, 45, 35, 190, 140);

      // Thêm đường viền màu cho hình thu nhỏ
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 5; // Độ dày đường viền
      ctx.roundRect(45, 35, 190, 140, 3); // Vẽ đường viền quanh hình thu nhỏ
      ctx.stroke();

      // Danh sách các màu sắc ngẫu nhiên
      const allowedColors = [
        '#f2d7b7',
        '#504e4d',
        '#5b0656',
        '#eb6e68',
        '#ff6000'
      ]

      // Hàm để lấy màu sắc ngẫu nhiên từ danh sách
      function getRandomColor() {
        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
      }

      // Vẽ tên bài hát
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
      ctx.fillStyle = getRandomColor(); // Sử dụng màu ngẫu nhiên
      ctx.fillText(this.name, 250, 100);

      // Vẽ tên tác giả (kích thước và phông chữ khác nhau)
      const authorText = this.author;
      ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr, chewy, space";
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