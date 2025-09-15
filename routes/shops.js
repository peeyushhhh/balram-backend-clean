const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to shops data file
const shopsFilePath = path.join(__dirname, '../shops.json');

// Helper function to read shops data
function getShopsData() {
  try {
    const data = fs.readFileSync(shopsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading shops data:', error);
    return [];
  }
}

// Helper function to save shops data  
function saveShopsData(shops) {
  try {
    fs.writeFileSync(shopsFilePath, JSON.stringify(shops, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error saving shops data:', error);
    return false;
  }
}

// GET /api/shops - Get all shops
router.get('/', (req, res) => {
  console.log('📋 GET /api/shops - Fetching all shops');
  
  const shops = getShopsData();
  
  res.json({
    success: true,
    count: shops.length,
    message: 'Shops fetched successfully',
    data: shops
  });
});

// GET /api/shops/:id - Get shop by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🔍 GET /api/shops/${id} - Fetching shop by ID`);
  
  const shops = getShopsData();
  const shop = shops.find(shop => shop.id === id);
  
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
});

// POST /api/shops - Add new shop
router.post('/', (req, res) => {
  console.log('➕ POST /api/shops - Adding new shop');
  
  const shops = getShopsData();
  const newShop = {
    id: `shop${shops.length + 1}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  shops.push(newShop);
  
  if (saveShopsData(shops)) {
    res.status(201).json({
      success: true,
      message: 'Shop added successfully',
      data: newShop
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error saving shop'
    });
  }
});

// PUT /api/shops/:id - Update shop
router.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`✏️ PUT /api/shops/${id} - Updating shop`);
  
  const shops = getShopsData();
  const shopIndex = shops.findIndex(shop => shop.id === id);
  
  if (shopIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Shop not found'
    });
  }
  
  shops[shopIndex] = {
    ...shops[shopIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  if (saveShopsData(shops)) {
    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: shops[shopIndex]
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error updating shop'
    });
  }
});

// DELETE /api/shops/:id - Delete shop
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ DELETE /api/shops/${id} - Deleting shop`);
  
  const shops = getShopsData();
  const shopIndex = shops.findIndex(shop => shop.id === id);
  
  if (shopIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Shop not found'
    });
  }
  
  shops.splice(shopIndex, 1);
  
  if (saveShopsData(shops)) {
    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error deleting shop'
    });
  }
});

// GET /api/shops/search/:category - Get shops by category
router.get('/search/:category', (req, res) => {
  const { category } = req.params;
  console.log(`🔎 GET /api/shops/search/${category} - Searching shops by category`);
  
  const shops = getShopsData();
  const filteredShops = shops.filter(shop => 
    shop.category.toLowerCase().includes(category.toLowerCase())
  );
  
  res.json({
    success: true,
    count: filteredShops.length,
    message: `Shops found for category: ${category}`,
    data: filteredShops
  });
});

module.exports = router;
