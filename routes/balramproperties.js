const { Router } = require('express');
const router = Router();
const Property = require('../models/Property');

// GET all properties
router.get('/', async (req, res) => {
  console.log('🏠 GET /api/properties called');
  try {
    // Remove .populate() since createdBy might not exist for all records
    const properties = await find()
      .sort({ createdAt: -1 });
    
    console.log(`Found ${properties.length} properties`);
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
});

// GET single property by ID
router.get('/:id', async (req, res) => {
  console.log(`🏠 GET /api/properties/${req.params.id} called`);
  try {
    const property = await findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment view count
    property.viewCount += 1;
    await property.save();
    
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
});

// POST create new property
router.post('/', async (req, res) => {
  console.log('🏠 POST /api/properties called');
  console.log('Request body:', req.body);
  
  try {
    const newProperty = new Property(req.body);
    const savedProperty = await newProperty.save();
    
    console.log('Property created successfully:', savedProperty._id);
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: savedProperty
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
});

// PUT update property
router.put('/:id', async (req, res) => {
  console.log(`🏠 PUT /api/properties/${req.params.id} called`);
  try {
    const updatedProperty = await findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
});

// DELETE property
router.delete('/:id', async (req, res) => {
  console.log(`🏠 DELETE /api/properties/${req.params.id} called`);
  try {
    const deletedProperty = await findByIdAndDelete(req.params.id);
    
    if (!deletedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
});

module.exports = router;
