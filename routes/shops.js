const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const slugify = require('slugify');


// GET /api/shops - Get all shops
router.get('/', async (req, res) => {
  try {
    console.log('🔍 GET /api/shops - Fetching all shops');
    const shops = await Shop.find();
    res.json({
      success: true,
      count: shops.length,
      message: 'Shops fetched successfully',
      data: shops
    });
  } catch (error) {
    console.error('❌ Error fetching shops:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shops'
    });
  }
});


// GET /api/shops/:id - Get shop by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/shops/${id} - Fetching by ID`);
    let shop;
    try {
      shop = await Shop.findById(id);
    } catch {
      shop = await Shop.findOne({ _id: id }) || await Shop.findOne({ id: id });
    }
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    res.json({ success: true, message: 'Shop fetched', data: shop });
  } catch (error) {
    console.error('❌ Error fetching shop:', error);
    res.status(500).json({ success: false, message: 'Error fetching shop' });
  }
});


// POST /api/shops - Create new shop with unique slug creation
router.post('/', async (req, res) => {
  try {
    console.log('🆕 POST /api/shops - Creating new shop');
    const data = req.body;

    // Create new shop instance
    const newShop = new Shop(data);

    // Generate unique slug if missing
    if (!newShop.slug) {
      let baseSlug = slugify(newShop.name, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      while (await Shop.exists({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      newShop.slug = slug;
    }

    await newShop.save();

    res.status(201).json({ success: true, message: 'Shop created successfully', data: newShop });

  } catch (err) {
    console.error('❌ Error creating shop:', err);
    res.status(500).json({ success: false, message: 'Error creating shop', error: err.message });
  }
});


module.exports = router;
