const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Telemetry Schema
const telemetrySchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  event_type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  page_name: String,
  shop_id: String,
  shop_name: String,
  form_name: String,
  success: Boolean,
  endpoint: String,
  method: String,
  response_time: Number,
  status_code: Number,
  user_agent: String,
  ip_address: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  collection: 'telemetry'
});

const Telemetry = mongoose.model('Telemetry', telemetrySchema);

// POST /api/telemetry - Save telemetry data
router.post('/', async (req, res) => {
  try {
    const telemetryData = req.body;
    
    // Add IP and user agent
    telemetryData.ip_address = req.ip || req.connection.remoteAddress;
    telemetryData.user_agent = req.get('User-Agent');
    
    const telemetry = new Telemetry(telemetryData);
    await telemetry.save();
    
    res.status(201).json({
      success: true,
      message: 'Telemetry data saved successfully'
    });
  } catch (error) {
    console.error('❌ Error saving telemetry:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving telemetry data'
    });
  }
});

// GET /api/telemetry - Get telemetry data (optional, for debugging)
router.get('/', async (req, res) => {
  try {
    const telemetryData = await Telemetry.find().limit(100).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: telemetryData.length,
      data: telemetryData
    });
  } catch (error) {
    console.error('❌ Error fetching telemetry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching telemetry data'
    });
  }
});

module.exports = router;
