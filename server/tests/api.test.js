const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('../models/Product');
const Lead = require('../models/Lead');

// יצירת Express app לטסטים (בלי להפעיל את השרת)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// סטטוסים אפשריים לליד
const LEAD_STATUSES = ['new', 'contacted', 'converted', 'closed'];

// ==================== Routes ====================

// Leads
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, email, message, source, productInterest } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'נא למלא את כל השדות החובה' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'כתובת אימייל לא תקינה' });
    }
    const lead = await Lead.create({ name, phone, email, message: message || '', source: source || 'website', productInterest: productInterest || '' });
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const { status, source } = req.query;
    let query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.get('/api/leads-statuses', (req, res) => {
  res.json({ success: true, data: LEAD_STATUSES });
});

app.get('/api/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'ליד לא נמצא' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { status, email } = req.body;
    if (status && !LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'סטטוס לא תקין' });
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'כתובת אימייל לא תקינה' });
      }
    }
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'ליד לא נמצא' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'ליד לא נמצא' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const { model, color, positions, inStock } = req.query;
    let query = {};
    if (model) query.model = model;
    if (color) query.color = color;
    if (positions) query.positions = parseInt(positions);
    if (inStock !== undefined) query.inStock = inStock === 'true';
    const products = await Product.find(query).sort({ price: 1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'מוצר לא נמצא' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, model, positions, color, price, features, inStock } = req.body;
    if (!name || !model || !positions || !color || !price) {
      return res.status(400).json({ success: false, message: 'נא למלא את כל השדות החובה' });
    }
    if (!['mark1', 'mark2'].includes(model)) {
      return res.status(400).json({ success: false, message: 'דגם לא תקין' });
    }
    if (![1, 2, 3].includes(positions)) {
      return res.status(400).json({ success: false, message: 'מספר מעגלים לא תקין' });
    }
    if (!['white', 'black', 'gray'].includes(color)) {
      return res.status(400).json({ success: false, message: 'צבע לא תקין' });
    }
    const product = await Product.create({ name, model, positions, color, price, features: features || [], inStock: inStock !== undefined ? inStock : true });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.post('/api/products/bulk', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'נא לשלוח מערך של מוצרים' });
    }
    const errors = [];
    products.forEach((p, i) => {
      if (!p.name || !p.model || !p.positions || !p.color || !p.price) errors.push(`מוצר ${i + 1}: חסרים שדות`);
      if (p.model && !['mark1', 'mark2'].includes(p.model)) errors.push(`מוצר ${i + 1}: דגם לא תקין`);
      if (p.positions && ![1, 2, 3].includes(p.positions)) errors.push(`מוצר ${i + 1}: מעגלים לא תקין`);
      if (p.color && !['white', 'black', 'gray'].includes(p.color)) errors.push(`מוצר ${i + 1}: צבע לא תקין`);
    });
    if (errors.length > 0) return res.status(400).json({ success: false, errors });
    const created = await Product.insertMany(products);
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  try {
    const { model, positions, color } = req.body;
    if (model && !['mark1', 'mark2'].includes(model)) {
      return res.status(400).json({ success: false, message: 'דגם לא תקין' });
    }
    if (positions && ![1, 2, 3].includes(positions)) {
      return res.status(400).json({ success: false, message: 'מספר מעגלים לא תקין' });
    }
    if (color && !['white', 'black', 'gray'].includes(color)) {
      return res.status(400).json({ success: false, message: 'צבע לא תקין' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'מוצר לא נמצא' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'מוצר לא נמצא' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'השרת פעיל' });
});

// ===========================================
// Test Setup
// ===========================================

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dimmer_test');
});

afterAll(async () => {
  await Product.deleteMany({ name: /Test/ });
  await Lead.deleteMany({ email: /test/ });
  await mongoose.connection.close();
});

// ===========================================
// Products API Tests
// ===========================================

describe('Products API', () => {
  let productId;

  describe('GET /api/products', () => {
    test('should return all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter products by model', async () => {
      const res = await request(app).get('/api/products?model=mark1');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(p => expect(p.model).toBe('mark1'));
    });

    test('should filter products by color', async () => {
      const res = await request(app).get('/api/products?color=white');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(p => expect(p.color).toBe('white'));
    });

    test('should filter products by positions', async () => {
      const res = await request(app).get('/api/products?positions=2');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(p => expect(p.positions).toBe(2));
    });

    test('should filter products by inStock', async () => {
      const res = await request(app).get('/api/products?inStock=true');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(p => expect(p.inStock).toBe(true));
    });
  });

  describe('POST /api/products', () => {
    test('should create a new product', async () => {
      const res = await request(app).post('/api/products').send({
        name: 'Test Product',
        model: 'mark1',
        positions: 1,
        color: 'white',
        price: 99
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      productId = res.body.data._id;
    });

    test('should fail without required fields', async () => {
      const res = await request(app).post('/api/products').send({ name: 'Test' });
      expect(res.statusCode).toBe(400);
    });

    test('should fail with invalid model', async () => {
      const res = await request(app).post('/api/products').send({
        name: 'Test', model: 'mark99', positions: 1, color: 'white', price: 100
      });
      expect(res.statusCode).toBe(400);
    });

    test('should fail with invalid color', async () => {
      const res = await request(app).post('/api/products').send({
        name: 'Test', model: 'mark1', positions: 1, color: 'red', price: 100
      });
      expect(res.statusCode).toBe(400);
    });

    test('should fail with invalid positions', async () => {
      const res = await request(app).post('/api/products').send({
        name: 'Test', model: 'mark1', positions: 5, color: 'white', price: 100
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return a single product', async () => {
      const res = await request(app).get(`/api/products/${productId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data._id).toBe(productId);
    });

    test('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/000000000000000000000000');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/products/:id', () => {
    test('should update product', async () => {
      const res = await request(app).patch(`/api/products/${productId}`).send({ price: 149 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.price).toBe(149);
    });

    test('should fail with invalid model', async () => {
      const res = await request(app).patch(`/api/products/${productId}`).send({ model: 'invalid' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should delete a product', async () => {
      const res = await request(app).delete(`/api/products/${productId}`);
      expect(res.statusCode).toBe(200);
    });

    test('should return 404 for deleted product', async () => {
      const res = await request(app).delete(`/api/products/${productId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/products/bulk', () => {
    test('should create multiple products', async () => {
      const res = await request(app).post('/api/products/bulk').send({
        products: [
          { name: 'Test Bulk 1', model: 'mark1', positions: 1, color: 'white', price: 100 },
          { name: 'Test Bulk 2', model: 'mark2', positions: 2, color: 'black', price: 200 }
        ]
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.count).toBe(2);
    });

    test('should fail with empty array', async () => {
      const res = await request(app).post('/api/products/bulk').send({ products: [] });
      expect(res.statusCode).toBe(400);
    });
  });
});

// ===========================================
// Leads API Tests
// ===========================================

describe('Leads API', () => {
  let leadId;

  describe('POST /api/leads', () => {
    test('should create a new lead', async () => {
      const res = await request(app).post('/api/leads').send({
        name: 'Test User',
        phone: '050-1234567',
        email: 'test@example.com'
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      leadId = res.body.data._id;
    });

    test('should fail without required fields', async () => {
      const res = await request(app).post('/api/leads').send({ name: 'Test' });
      expect(res.statusCode).toBe(400);
    });

    test('should fail with invalid email', async () => {
      const res = await request(app).post('/api/leads').send({
        name: 'Test', phone: '050-1234567', email: 'invalid'
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/leads', () => {
    test('should return all leads', async () => {
      const res = await request(app).get('/api/leads');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter by status', async () => {
      const res = await request(app).get('/api/leads?status=new');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(l => expect(l.status).toBe('new'));
    });
  });

  describe('GET /api/leads/:id', () => {
    test('should return a single lead', async () => {
      const res = await request(app).get(`/api/leads/${leadId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data._id).toBe(leadId);
    });

    test('should return 404 for non-existent lead', async () => {
      const res = await request(app).get('/api/leads/000000000000000000000000');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/leads/:id', () => {
    test('should update lead status', async () => {
      const res = await request(app).patch(`/api/leads/${leadId}`).send({ status: 'contacted' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('contacted');
    });

    test('should fail with invalid status', async () => {
      const res = await request(app).patch(`/api/leads/${leadId}`).send({ status: 'invalid' });
      expect(res.statusCode).toBe(400);
    });

    test('should fail with invalid email', async () => {
      const res = await request(app).patch(`/api/leads/${leadId}`).send({ email: 'invalid' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/leads/:id', () => {
    test('should delete a lead', async () => {
      const res = await request(app).delete(`/api/leads/${leadId}`);
      expect(res.statusCode).toBe(200);
    });

    test('should return 404 for deleted lead', async () => {
      const res = await request(app).delete(`/api/leads/${leadId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/leads-statuses', () => {
    test('should return all statuses', async () => {
      const res = await request(app).get('/api/leads-statuses');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toContain('new');
      expect(res.body.data).toContain('contacted');
    });
  });
});

// ===========================================
// Health Check
// ===========================================

describe('Health Check', () => {
  test('GET /api/health should return success', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
