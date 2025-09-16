const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  // ✅ UPDATED to match AddShopForm fields
  name: { type: String, required: true },        // From form: name
  category: { type: String, required: true },    // From form: category  
  location: { type: String, required: true },    // From form: location
  area: { type: String, required: true },        // From form: area
  price: { type: Number, required: true },       // From form: price
  status: { type: String, default: 'available' }, // From form: status
  description: String,                            // From form: description
  amenities: [String],                           // From form: amenities
  
  // SEO fields from form
  seoTitle: String,                              // From form: seoTitle
  seoDescription: String,                        // From form: seoDescription
  keywords: [String],                            // From form: keywords
  canonicalUrl: String,                          // From form: canonicalUrl
  
  // Images array
  images: [{                                     // From form: images
    url: String,
    altText: String,
    caption: String
  }],
  
  // Auto-generated fields
  slug: String,
  featured: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'properties' // ✅ Keep using properties collection
});

module.exports = mongoose.model('Shop', shopSchema);
