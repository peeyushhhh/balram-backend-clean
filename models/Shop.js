const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  // Form fields
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'available' },
  description: String,
  amenities: [String],

  // Contact phone nested object
  contact: {
    phone: { type: String },
  },

  // SEO fields
  seoTitle: String,
  seoDescription: String,
  keywords: [String],
  canonicalUrl: String,

  // Images array
  images: [{
    url: String,
    altText: String,
    caption: String
  }],

  slug: String,
  featured: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'properties'
});

module.exports = mongoose.model('Shop', shopSchema);
