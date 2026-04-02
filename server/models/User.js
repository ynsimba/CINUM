const mongoose = require('mongoose');

const ROLES = ['admin', 'moderator'];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ROLES, default: 'moderator' },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function toJSON() {
  const o = this.toObject();
  delete o.passwordHash;
  return o;
};

module.exports = { User: mongoose.model('User', userSchema), ROLES };
