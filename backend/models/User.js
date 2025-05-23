const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  type: { type: String, enum: ['proprietaire', 'locataire'] },
  dateInscription: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
