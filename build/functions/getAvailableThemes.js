const fs = require('fs');
const path = require('path');

/**
 * Lấy danh sách tất cả themes khả dụng
 * @returns {Array} Mảng chứa tên các themes
 */
function getAvailableThemes() {
  const structuresPath = path.join(__dirname, '..', 'structures');
  const imagesPath = path.join(structuresPath, 'images');
  
  try {
    // Kiểm tra xem thư mục images có tồn tại không
    if (!fs.existsSync(imagesPath)) {
      console.error('Thư mục images không tồn tại');
      return [];
    }

    // Đọc tất cả các thư mục con trong images
    const items = fs.readdirSync(imagesPath, { withFileTypes: true });
    
    // Lọc lấy tất cả các thư mục (không giới hạn tên)
    const themeFolders = items.filter(item => item.isDirectory());

    const availableThemes = [];

    // Duyệt qua từng folder
    themeFolders.forEach(themeFolder => {
      const themeName = themeFolder.name;
      const themePath = path.join(imagesPath, themeName);
      
      try {
        // Đọc các file trong folder
        const files = fs.readdirSync(themePath);
        
        // Lọc chỉ lấy các file ảnh (png, jpg, jpeg, gif, webp, bmp)
        const imageFiles = files.filter(file => {
          const ext = file.toLowerCase();
          return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
                 ext.endsWith('.gif') || ext.endsWith('.webp') || ext.endsWith('.bmp');
        });
        
        // Chỉ thêm vào danh sách nếu folder có chứa ảnh
        if (imageFiles.length > 0) {
          availableThemes.push(themeName);
        }
      } catch (error) {
        console.warn(`Không thể đọc thư mục ${themeName}:`, error.message);
      }
    });

    return availableThemes.sort(); // Sắp xếp theo alphabet

  } catch (error) {
    console.error('Lỗi khi đọc danh sách themes:', error.message);
    return [];
  }
}

module.exports = {
  getAvailableThemes
};
