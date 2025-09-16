const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  event_type: {
    type: String,
    required: true,
    enum: [
      'performance', 'page_view', 'shop_view', 'form_submission', 'api_call', 'error',
      'form_input_change', 'image_upload_attempt', 'amenity_add', 'keyword_add', // ✅ Add missing enums
      'form_submission_start', 'shop_creation_success', 'shop_creation_failure',
      'image_upload_success', 'image_remove', 'amenity_remove', 'keyword_remove'
    ]
  },
  session_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  page_url: String,
  data: mongoose.Schema.Types.Mixed,
  user_agent: String,
  ip_address: String
}, {
  timestamps: true
});

// Index for efficient querying
telemetrySchema.index({ event_type: 1, timestamp: -1 });
telemetrySchema.index({ session_id: 1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
