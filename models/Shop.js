const mongoose = require('mongoose');
const slugify = require('slugify');

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
    phone: { type: String }
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

  // Slug with unique index
  slug: { type: String, unique: true, sparse: true },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'properties'
});


// Pre-save middleware to auto-generate slug with uniqueness check
shopSchema.pre('save', async function(next) {
  if (this.isModified('name') || !this.slug) {  // Regenerate slug if name changed or slug missing
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Exclude current document from check to avoid false positive on update
    while (await mongoose.models.Shop.exists({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Shop', shopSchema);
