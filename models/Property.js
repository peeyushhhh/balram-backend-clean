const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'office', 'shop', 'warehouse'],
    required: true
  },
  bhk: {
    type: String,
    required: true
  },
  area: {
    size: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'sqft'
    }
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['sale', 'rent'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented'],
    default: 'available'
  },
  location: {
    address: String,
    city: String
  },
  contact: {
    phone: String
  }
}, {
  timestamps: true
});

// Simple slug generation
propertySchema.pre('save', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
