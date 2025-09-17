const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// GET /api/shops - Get all shops
router.get('/', async (req, res) => {
  try {
    console.log('📋 GET /api/shops - Fetching all shops');
    const shops = await Shop.find().sort({ createdAt: -1 });
    
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
    const shop = await Shop.findById(req.params.id);
    
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
      message: 'Error fetching shop',
      error: error.message
    });
  }
});

// POST /api/shops - Add new shop
router.post('/', async (req, res) => {
  try {
    console.log('➕ POST /api/shops - Adding new shop');
    const shop = new Shop(req.body);
    await shop.save();
    
    res.status(201).json({
      success: true,
      message: 'Shop added successfully',
      data: shop
    });
  } catch (error) {
    console.error('❌ Error adding shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding shop',
      error: error.message
    });
  }
});

// PUT /api/shops/:id - Update shop
router.put('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    console.error('❌ Error updating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shop',
      error: error.message
    });
  }
});

// DELETE /api/shops/:id - Delete shop
router.delete('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    
    if (!shop) {
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
      message: 'Error deleting shop',
      error: error.message
    });
  }
});

module.exports = router;
