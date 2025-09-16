// GET /api/shops/:id - Get shop by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/shops/${id} - Fetching shop by ID`);
    
    // ✅ FIXED - Use MongoDB _id instead of custom id field
    const shop = await Shop.findById(id);
    
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
