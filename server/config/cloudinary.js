const dotenv = require('dotenv');
dotenv.config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// הגדרת Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// בדיקה שהמפתחות נטענו
console.log('☁️ Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '✓ loaded' : '✗ missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ loaded' : '✗ missing'
});

// הגדרת Storage ל-Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dimmer', // תיקייה ב-Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// פונקציה למחיקת תמונה מ-Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // חילוץ ה-public_id מה-URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `dimmer/${filename.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
    console.log('🗑️ תמונה נמחקה מ-Cloudinary:', publicId);
  } catch (error) {
    console.error('❌ שגיאה במחיקת תמונה:', error);
  }
};

module.exports = { cloudinary, upload, deleteImage };