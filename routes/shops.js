// GET /api/shops/:id - Get shop by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/shops/${id} - Fetching shop by ID`);
    
    // ✅ NEW: Try multiple ways to find the shop
    let shop = null;
    
    // Try 1: Direct _id lookup (for ObjectId format)
    try {
      shop = await shop.findById(id);
    } catch (err) {
      console.log('Not valid ObjectId format, trying string match...');
    }
    
    // Try 2: Find by _id as string
    if (!shop) {
      shop = await shop.findOne({ _id: id });
    }
    
    // Try 3: Find by custom id field
    if (!shop) {
      shop = await shop.findOne({ id: id });
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
