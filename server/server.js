const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { upload, deleteImage } = require('./config/cloudinary');
const Lead = require('./models/Lead');
const Product = require('./models/Product');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// סטטוסים אפשריים לליד
const LEAD_STATUSES = ['new', 'contacted', 'converted', 'closed'];

// ==================== Leads Routes ====================

// קבלת ליד חדש
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, email, message, source, productInterest } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'נא למלא את כל השדות החובה (שם, טלפון, אימייל)'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'כתובת אימייל לא תקינה'
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      message: message || '',
      source: source || 'website',
      productInterest: productInterest || ''
    });

    console.log('✅ ליד חדש נקלט:', lead);

    res.status(201).json({
      success: true,
      message: 'הפרטים נקלטו בהצלחה!',
      data: lead
    });

  } catch (error) {
    console.error('❌ שגיאה בקליטת ליד:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// קבלת כל הלידים - עם Pagination, Search ו-Sorting
app.get('/api/leads', async (req, res) => {
  try {
    const { 
      status, 
      source,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // בניית query
    let query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    
    // חיפוש בשם, טלפון או אימייל
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // מיון
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ביצוע השאילתות
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: leads.length,
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      data: leads
    });
  } catch (error) {
    console.error('❌ שגיאה בשליפת לידים:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// סטטיסטיקות לידים (Dashboard) - חייב להיות לפני :id
app.get('/api/leads/stats', async (req, res) => {
  try {
    // סה"כ לידים
    const total = await Lead.countDocuments();
    
    // לידים לפי סטטוס
    const byStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // לידים לפי מקור
    const bySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    
    // לידים חדשים היום
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await Lead.countDocuments({
      createdAt: { $gte: today }
    });
    
    // לידים השבוע
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = await Lead.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    // לידים החודש
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const newThisMonth = await Lead.countDocuments({
      createdAt: { $gte: monthAgo }
    });
    
    // אחוז המרה (converted מתוך סה"כ)
    const converted = byStatus.find(s => s._id === 'converted')?.count || 0;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
    
    // 5 לידים אחרונים
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email status createdAt');

    res.json({
      success: true,
      data: {
        total,
        newToday,
        newThisWeek,
        newThisMonth,
        conversionRate: parseFloat(conversionRate),
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySource: bySource.reduce((acc, item) => {
          acc[item._id || 'unknown'] = item.count;
          return acc;
        }, {}),
        recentLeads
      }
    });
  } catch (error) {
    console.error('❌ שגיאה בשליפת סטטיסטיקות:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// קבלת ליד בודד לפי ID
app.get('/api/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'ליד לא נמצא'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('❌ שגיאה בשליפת ליד:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// עדכון ליד
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { name, phone, email, message, source, productInterest, status } = req.body;
    
    if (status && !LEAD_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `סטטוס לא תקין. אפשרויות: ${LEAD_STATUSES.join(', ')}`
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'כתובת אימייל לא תקינה'
        });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, message, source, productInterest, status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'ליד לא נמצא'
      });
    }

    res.json({
      success: true,
      message: 'הליד עודכן בהצלחה',
      data: lead
    });
  } catch (error) {
    console.error('❌ שגיאה בעדכון ליד:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// מחיקת ליד
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'ליד לא נמצא'
      });
    }

    res.json({
      success: true,
      message: 'הליד נמחק בהצלחה',
      data: lead
    });
  } catch (error) {
    console.error('❌ שגיאה במחיקת ליד:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// קבלת סטטוסים אפשריים
app.get('/api/leads-statuses', (req, res) => {
  res.json({
    success: true,
    data: LEAD_STATUSES
  });
});

// ==================== Products Routes ====================

// שליפת כל המוצרים
app.get('/api/products', async (req, res) => {
  try {
    const { model, color, positions, inStock } = req.query;
    
    let query = {};
    if (model) query.model = model;
    if (color) query.color = color;
    if (positions) query.positions = parseInt(positions);
    if (inStock !== undefined) query.inStock = inStock === 'true';

    const products = await Product.find(query).sort({ price: 1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ שגיאה בשליפת מוצרים:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// שליפת מוצר בודד
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ שגיאה בשליפת מוצר:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// הוספת מוצר עם תמונה
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, model, positions, color, price, features, inStock } = req.body;

    if (!name || !model || !positions || !color || !price) {
      return res.status(400).json({
        success: false,
        message: 'נא למלא את כל השדות החובה (name, model, positions, color, price)'
      });
    }

    if (!['mark1', 'mark2'].includes(model)) {
      return res.status(400).json({
        success: false,
        message: 'דגם לא תקין. אפשרויות: mark1, mark2'
      });
    }

    const posNum = parseInt(positions);
    if (![1, 2, 3].includes(posNum)) {
      return res.status(400).json({
        success: false,
        message: 'מספר מעגלים לא תקין. אפשרויות: 1, 2, 3'
      });
    }

    if (!['white', 'black', 'gray'].includes(color)) {
      return res.status(400).json({
        success: false,
        message: 'צבע לא תקין. אפשרויות: white, black, gray'
      });
    }

    // פרסור features אם נשלח כ-string
    let featuresArray = features;
    if (typeof features === 'string') {
      try {
        featuresArray = JSON.parse(features);
      } catch {
        featuresArray = features.split(',').map(f => f.trim());
      }
    }

    const product = await Product.create({
      name,
      model,
      positions: posNum,
      color,
      price: parseFloat(price),
      features: featuresArray || [],
      imageUrl: req.file ? req.file.path : '',
      inStock: inStock === 'true' || inStock === true
    });

    console.log('✅ מוצר חדש נוסף:', product);

    res.status(201).json({
      success: true,
      message: 'המוצר נוסף בהצלחה!',
      data: product
    });

  } catch (error) {
    console.error('❌ שגיאה בהוספת מוצר:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// הוספת רשימת מוצרים (bulk) - ללא תמונות
app.post('/api/products/bulk', async (req, res) => {
  try {
    const { products: productsList } = req.body;

    if (!productsList || !Array.isArray(productsList) || productsList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'נא לשלוח מערך של מוצרים בשדה products'
      });
    }

    const errors = [];
    productsList.forEach((product, index) => {
      if (!product.name || !product.model || !product.positions || !product.color || !product.price) {
        errors.push(`מוצר ${index + 1}: חסרים שדות חובה`);
      }
      if (product.model && !['mark1', 'mark2'].includes(product.model)) {
        errors.push(`מוצר ${index + 1}: דגם לא תקין`);
      }
      if (product.positions && ![1, 2, 3].includes(product.positions)) {
        errors.push(`מוצר ${index + 1}: מספר מעגלים לא תקין`);
      }
      if (product.color && !['white', 'black', 'gray'].includes(product.color)) {
        errors.push(`מוצר ${index + 1}: צבע לא תקין`);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'שגיאות בולידציה',
        errors
      });
    }

    const createdProducts = await Product.insertMany(productsList);

    console.log(`✅ ${createdProducts.length} מוצרים נוספו בהצלחה`);

    res.status(201).json({
      success: true,
      message: `${createdProducts.length} מוצרים נוספו בהצלחה!`,
      count: createdProducts.length,
      data: createdProducts
    });

  } catch (error) {
    console.error('❌ שגיאה בהוספת מוצרים:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// עדכון מוצר עם אפשרות לתמונה חדשה
app.patch('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, model, positions, color, price, features, inStock } = req.body;

    if (model && !['mark1', 'mark2'].includes(model)) {
      return res.status(400).json({
        success: false,
        message: 'דגם לא תקין. אפשרויות: mark1, mark2'
      });
    }

    const posNum = positions ? parseInt(positions) : null;
    if (posNum && ![1, 2, 3].includes(posNum)) {
      return res.status(400).json({
        success: false,
        message: 'מספר מעגלים לא תקין. אפשרויות: 1, 2, 3'
      });
    }

    if (color && !['white', 'black', 'gray'].includes(color)) {
      return res.status(400).json({
        success: false,
        message: 'צבע לא תקין. אפשרויות: white, black, gray'
      });
    }

    // מצא את המוצר הקיים
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא'
      });
    }

    // אם יש תמונה חדשה, מחק את הישנה
    if (req.file && existingProduct.imageUrl) {
      await deleteImage(existingProduct.imageUrl);
    }

    // פרסור features
    let featuresArray = features;
    if (typeof features === 'string') {
      try {
        featuresArray = JSON.parse(features);
      } catch {
        featuresArray = features.split(',').map(f => f.trim());
      }
    }

    // בנה אובייקט עדכון
    const updateData = {};
    if (name) updateData.name = name;
    if (model) updateData.model = model;
    if (posNum) updateData.positions = posNum;
    if (color) updateData.color = color;
    if (price) updateData.price = parseFloat(price);
    if (featuresArray) updateData.features = featuresArray;
    if (inStock !== undefined) updateData.inStock = inStock === 'true' || inStock === true;
    if (req.file) updateData.imageUrl = req.file.path;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('✅ מוצר עודכן:', product);

    res.json({
      success: true,
      message: 'המוצר עודכן בהצלחה',
      data: product
    });
  } catch (error) {
    console.error('❌ שגיאה בעדכון מוצר:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// העלאת תמונה בלבד למוצר קיים
app.post('/api/products/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'נא להעלות תמונה'
      });
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא'
      });
    }

    // מחק תמונה קודמת אם קיימת
    if (existingProduct.imageUrl) {
      await deleteImage(existingProduct.imageUrl);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { imageUrl: req.file.path },
      { new: true }
    );

    console.log('✅ תמונה עודכנה למוצר:', product._id);

    res.json({
      success: true,
      message: 'התמונה עודכנה בהצלחה',
      data: product
    });
  } catch (error) {
    console.error('❌ שגיאה בהעלאת תמונה:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// מחיקת תמונה ממוצר
app.delete('/api/products/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא'
      });
    }

    if (product.imageUrl) {
      await deleteImage(product.imageUrl);
    }

    product.imageUrl = '';
    await product.save();

    console.log('🗑️ תמונה נמחקה ממוצר:', product._id);

    res.json({
      success: true,
      message: 'התמונה נמחקה בהצלחה',
      data: product
    });
  } catch (error) {
    console.error('❌ שגיאה במחיקת תמונה:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// מחיקת מוצר (כולל התמונה)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא'
      });
    }

    // מחק את התמונה מ-Cloudinary
    if (product.imageUrl) {
      await deleteImage(product.imageUrl);
    }

    await Product.findByIdAndDelete(req.params.id);

    console.log('🗑️ מוצר נמחק:', product);

    res.json({
      success: true,
      message: 'המוצר נמחק בהצלחה',
      data: product
    });
  } catch (error) {
    console.error('❌ שגיאה במחיקת מוצר:', error);
    res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בשרת'
    });
  }
});

// ==================== Health Check ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'השרת פעיל',
    database: 'MongoDB Connected',
    timestamp: new Date()
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 השרת פועל על פורט ${PORT}                              ║
║   📦 MongoDB מחובר                                         ║
║   ☁️  Cloudinary מוגדר                                      ║
║                                                            ║
║   Leads Endpoints:                                         ║
║   POST   /api/leads              - הוספת ליד               ║
║   GET    /api/leads              - כל הלידים               ║
║   GET    /api/leads/:id          - ליד בודד                ║
║   PATCH  /api/leads/:id          - עדכון ליד               ║
║   DELETE /api/leads/:id          - מחיקת ליד               ║
║                                                            ║
║   Products Endpoints:                                      ║
║   GET    /api/products           - כל המוצרים              ║
║   GET    /api/products/:id       - מוצר בודד               ║
║   POST   /api/products           - הוספת מוצר (עם תמונה)   ║
║   POST   /api/products/bulk      - הוספת רשימת מוצרים      ║
║   PATCH  /api/products/:id       - עדכון מוצר (עם תמונה)   ║
║   DELETE /api/products/:id       - מחיקת מוצר              ║
║                                                            ║
║   Image Endpoints:                                         ║
║   POST   /api/products/:id/image - העלאת תמונה למוצר       ║
║   DELETE /api/products/:id/image - מחיקת תמונה ממוצר       ║
║                                                            ║
║   GET    /api/health             - בדיקת תקינות            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
