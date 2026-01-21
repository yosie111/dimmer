const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'נא להזין שם'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'נא להזין טלפון'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'נא להזין אימייל'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'נא להזין אימייל תקין']
  },
  message: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: 'website'
  },
  productInterest: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true // יוצר createdAt ו-updatedAt אוטומטית
});

module.exports = mongoose.model('Lead', leadSchema);
