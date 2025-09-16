const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  location: String,
  area: String,
  price: Number,
  status: { type: String, default: 'available' },
  description: String,
  amenities: [String],
  seoTitle: String,
  seoDescription: String,
  keywords: [String],
  canonicalUrl: String,
  slug: String,
  featured: { type: Boolean, default: false },
  images: [{
    url: String,
    altText: String,
    caption: String
  }]
}, {
  timestamps: true,
  collection: 'properties' // ✅ CRITICAL FIX - Use properties collection
});

module.exports = mongoose.model('Shop', shopSchema);
