const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

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
    console.log(`🔍 GET /api/shops/${id} - Fetching shop by ID`);
    
    // ✅ FIXED: Try multiple ways to find the shop
    let shop = null;
    
    // Try 1: Direct _id lookup (for ObjectId format)
    try {
      shop = await Shop.findById(id);
    } catch (err) {
      console.log('Not valid ObjectId format, trying string match...');
    }
    
    // Try 2: Find by _id as string
    if (!shop) {
      shop = await Shop.findOne({ _id: id });
    }
    
    // Try 3: Find by custom id field
    if (!shop) {
      shop = await Shop.findOne({ id: id });
    }
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Shop fetched successfully',
      data: shop
    });
  } catch (error) {
    console.error('❌ Error fetching shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shop'
    });
  }
});

// POST /api/shops - Create new shop
router.post('/', async (req, res) => {
  try {
    console.log('🆕 POST /api/shops - Creating new shop');
    
    const shopData = req.body;
    const shop = new Shop(shopData);
    
    await shop.save();
    
    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (error) {
    console.error('❌ Error creating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shop'
    });
  }
});

module.exports = router;
