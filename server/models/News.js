const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true, default: '' },
    content: { type: String, required: true },
    alert: { type: Boolean, default: false },
    campaign: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
