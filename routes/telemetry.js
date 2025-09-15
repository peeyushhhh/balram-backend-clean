const express = require('express');
const Telemetry = require('../models/Telemetry');
const router = express.Router();

// Receive telemetry events
router.post('/', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid events data' });
    }

    // Process and save events
    const telemetryEvents = events.map(event => ({
      ...event,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      timestamp: new Date(event.timestamp)
    }));

    await Telemetry.insertMany(telemetryEvents);
    
    res.json({ success: true, processed: events.length });
  } catch (error) {
    console.error('Telemetry error:', error);
    res.status(500).json({ error: 'Failed to process telemetry' });
  }
});

// Get analytics summary
router.get('/analytics', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    // Calculate time range
    const now = new Date();
    const timeRanges = {
      '1h': new Date(now.getTime() - 60 * 60 * 1000),
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    };
    
    const startTime = timeRanges[timeframe] || timeRanges['24h'];

    // Aggregate analytics data
    const analytics = await Promise.all([
      // Page views
      Telemetry.countDocuments({
        event_type: 'page_view',
        timestamp: { $gte: startTime }
      }),
      
      // Unique sessions
      Telemetry.distinct('session_id', {
        timestamp: { $gte: startTime }
      }),
      
      // Average page load time
      Telemetry.aggregate([
        {
          $match: {
            event_type: 'performance',
            timestamp: { $gte: startTime },
            'data.page_load_time': { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            avg_load_time: { $avg: '$data.page_load_time' }
          }
        }
      ]),
      
      // Error count
      Telemetry.countDocuments({
        event_type: 'error',
        timestamp: { $gte: startTime }
      }),
      
      // Most viewed shops
      Telemetry.aggregate([
        {
          $match: {
            event_type: 'shop_view',
            timestamp: { $gte: startTime }
          }
        },
        {
          $group: {
            _id: '$data.shop_name',
            views: { $sum: 1 }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ])
    ]);

    const [pageViews, uniqueSessions, avgLoadTime, errorCount, topShops] = analytics;

    res.json({
      timeframe,
      metrics: {
        page_views: pageViews,
        unique_sessions: uniqueSessions.length,
        avg_load_time: avgLoadTime[0]?.avg_load_time || 0,
        error_count: errorCount,
        top_shops: topShops
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get real-time metrics
router.get('/realtime', async (req, res) => {
  try {
    const last5Minutes = new Date(Date.now() - 5 * 60 * 1000);
    
    const realtimeData = await Promise.all([
      // Active sessions (last 5 minutes)
      Telemetry.distinct('session_id', {
        timestamp: { $gte: last5Minutes }
      }),
      
      // Recent page views
      Telemetry.countDocuments({
        event_type: 'page_view',
        timestamp: { $gte: last5Minutes }
      }),
      
      // Recent shop views
      Telemetry.countDocuments({
        event_type: 'shop_view',
        timestamp: { $gte: last5Minutes }
      }),
      
      // Recent errors
      Telemetry.countDocuments({
        event_type: 'error',
        timestamp: { $gte: last5Minutes }
      })
    ]);

    const [activeSessions, pageViews, shopViews, errors] = realtimeData;

    res.json({
      timestamp: Date.now(),
      active_sessions: activeSessions.length,
      page_views_5m: pageViews,
      shop_views_5m: shopViews,
      errors_5m: errors
    });
  } catch (error) {
    console.error('Realtime error:', error);
    res.status(500).json({ error: 'Failed to get realtime data' });
  }
});

module.exports = router;
