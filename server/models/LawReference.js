const mongoose = require('mongoose');

const lawReferenceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    reference: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    fullTextUrl: { type: String, trim: true, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LawReference', lawReferenceSchema);
