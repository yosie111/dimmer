const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true
      // שים לב: לא חייבים required אם מייצרים אוטומטית
    },
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
    features: [{ type: String }],
    imageUrl: {
      type: String,
      default: ''
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// מיפוי צבע לקיצור
const COLOR_CODE = {
  white: 'WHT',
  black: 'BLK',
  gray: 'GRY'
};

// מיפוי מודל לקיצור
const MODEL_CODE = {
  mark1: 'M1',
  mark2: 'M2'
};

function buildSku(doc) {
  const m = MODEL_CODE[doc.model];
  const p = doc.positions;
  const c = COLOR_CODE[doc.color];

  // אם אחד חסר – לא נבנה עדיין (validate יטפל בשדות החסרים)
  if (!m || !p || !c) return null;

  // תבנית: DIM-M1-P2-BLK
  return `DIM-${m}-P${p}-${c}`;
}

/**
 * יצירה/נרמול SKU לפני ולידציה
 * - אם אין sku => ניצור
 * - אם יש sku => ננרמל (trim + uppercase)
 */
productSchema.pre('validate', function (next) {
  if (!this.sku) {
    const autoSku = buildSku(this);
    if (autoSku) this.sku = autoSku;
  } else {
    this.sku = String(this.sku).trim().toUpperCase();
  }
  next();
});

// אינדקסים
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index(
  { name: 1, model: 1, positions: 1, color: 1 },
  { unique: true }
);

module.exports = mongoose.model('Product', productSchema);
