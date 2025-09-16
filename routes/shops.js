const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// GET /api/shops - Get all shops
router.get('/', async (req, res) => {
  try {
    console.log('📋 GET /api/shops - Fetching all shops');
    
    const shops = await Shop.find({});
    
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
      message: 'Error fetching shops',
      error: error.message
    });
  }
});

// GET /api/shops/:id - Get shop by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/shops/${id} - Fetching shop by ID`);
    
    const shop = await Shop.findOne({ id: id });
    
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

// POST /api/shops - Add new shop
router.post('/', async (req, res) => {
  try {
    console.log('➕ POST /api/shops - Adding new shop');
    console.log('📝 Request body:', req.body);
    
    // ✅ Generate slug from name
    const generateSlug = (name) => {
      return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };
    
    const newShop = new Shop({
      id: `shop${Date.now()}`,
      ...req.body,
      slug: generateSlug(req.body.name), // ✅ Generate slug
      featured: false, // ✅ Default value
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const savedShop = await newShop.save();
    console.log('✅ Shop saved successfully:', savedShop.id);
    
    res.status(201).json({
      success: true,
      message: 'Shop added successfully',
      data: savedShop
    });
  } catch (error) {
    console.error('❌ Error saving shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving shop',
      error: error.message
    });
  }
});

// PUT /api/shops/:id - Update shop
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ PUT /api/shops/${id} - Updating shop`);
    
    const updatedShop = await Shop.findOneAndUpdate(
      { id: id },
      { ...req.body, updatedAt: new Date().toISOString() },
      { new: true }
    );
    
    if (!updatedShop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop
    });
  } catch (error) {
    console.error('❌ Error updating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shop'
    });
  }
});

// DELETE /api/shops/:id - Delete shop
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/shops/${id} - Deleting shop`);
    
    const deletedShop = await Shop.findOneAndDelete({ id: id });
    
    if (!deletedShop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shop'
    });
  }
});

module.exports = router;
