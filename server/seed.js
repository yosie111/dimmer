const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Dimmer Switch Pro',
    model: 'mark1',
    positions: 1,
    color: 'white',
    price: 149,
    features: ['שליטה מרחוק', 'עמעום חלק', 'התקנה קלה'],
    imageUrl: '',
    inStock: true
  },
  {
    name: 'Dimmer Switch Pro',
    model: 'mark1',
    positions: 2,
    color: 'white',
    price: 249,
    features: ['שליטה מרחוק', 'עמעום חלק', '2 מעגלים', 'התקנה קלה'],
    imageUrl: '',
    inStock: true
  },
  {
    name: 'Dimmer Switch Pro',
    model: 'mark1',
    positions: 3,
    color: 'white',
    price: 349,
    features: ['שליטה מרחוק', 'עמעום חלק', '3 מעגלים', 'התקנה קלה'],
    imageUrl: '',
    inStock: true
  },
  {
    name: 'Dimmer Switch Pro',
    model: 'mark1',
    positions: 1,
    color: 'black',
    price: 149,
    features: ['שליטה מרחוק', 'עמעום חלק', 'התקנה קלה'],
    imageUrl: '',
    inStock: true
  },
  {
    name: 'Dimmer Switch Pro',
    model: 'mark1',
    positions: 2,
    color: 'black',
    price: 249,
    features: ['שליטה מרחוק', 'עמעום חלק', '2 מעגלים', 'התקנה קלה'],
    imageUrl: '',
    inStock: false
  },
  {
    name: 'Dimmer Switch Elite',
    model: 'mark2',
    positions: 1,
    color: 'white',
    price: 199,
    features: ['שליטה מרחוק', 'עמעום חלק', 'תצוגת LED', 'חיישן תנועה', 'התקנה קלה'],
    imageUrl: '',
    inStock: true
  },
  {
    name: 'Dimmer Switch Elite',
    model: 'mark2',
    positions: 2,
    color: 'gray',
    price: 299,
    features: ['שליטה מרחוק', 'עמעום חלק', '2 מעגלים', 'תצוגת LED', 'חיישן תנועה'],
    imageUrl: '',
    inStock: true
  },
  {
    name: 'Dimmer Switch Elite',
    model: 'mark2',
    positions: 3,
    color: 'black',
    price: 399,
    features: ['שליטה מרחוק', 'עמעום חלק', '3 מעגלים', 'תצוגת LED', 'חיישן תנועה', 'תזמון אוטומטי'],
    imageUrl: '',
    inStock: true
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ מחובר ל-MongoDB');

    // מחיקת כל המוצרים הקיימים
    await Product.deleteMany({});
    console.log('🗑️  מוצרים קיימים נמחקו');

    // הכנסת מוצרים חדשים
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} מוצרים נוספו בהצלחה`);
    console.log('📷 כעת תוכל להעלות תמונות דרך ממשק הניהול או ה-API');

    process.exit(0);
  } catch (error) {
    console.error(`❌ שגיאה: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
