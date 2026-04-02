const mongoose = require('mongoose');

const ABUSE_TYPES = [
  'cyberharcelement',
  'desinformation',
  'fraude',
  'usurpation',
  'autre',
];

const STATUSES = ['pending', 'reviewed', 'forwarded_arptc', 'closed'];

const reportSchema = new mongoose.Schema(
  {
    abuseType: { type: String, enum: ABUSE_TYPES, required: true },
    description: { type: String, required: true, maxlength: 600 },
    contactEmail: { type: String, trim: true, lowercase: true, default: '' },
    contactPhone: { type: String, trim: true, default: '' },
    /** Référence affichée à l’usager (ex. CIN-2026-A1B2C3). */
    reference: { type: String, unique: true, sparse: true, trim: true, uppercase: true },
    /** Hash bcrypt du code secret de suivi (jamais exposé en JSON). */
    lookupSecretHash: { type: String, select: false },
    attachments: [{ path: String, originalName: String }],
    status: { type: String, enum: STATUSES, default: 'pending' },
    internalNote: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = { Report: mongoose.model('Report', reportSchema), ABUSE_TYPES, STATUSES };
