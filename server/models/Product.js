const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'נא להזין שם מוצר'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'נא להזין דגם'],
    enum: ['mark1', 'mark2']
  },
  positions: {
    type: Number,
    required: [true, 'נא להזין מספר מעגלים'],
    enum: [1, 2, 3]
  },
  color: {
    type: String,
    required: [true, 'נא להזין צבע'],
    enum: ['white', 'black', 'gray']
  },
  price: {
    type: Number,
    required: [true, 'נא להזין מחיר']
  },
  features: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
