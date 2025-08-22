const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: Number, required: true },
  cropType: { type: String, required: true },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Region', regionSchema);
