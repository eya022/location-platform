const mongoose = require('mongoose');

const logementSchema = new mongoose.Schema({
  titre: String,
  description: String,
  ville: String,
  prixParNuit: Number,
  proprietaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nombreChambres: Number,
  equipements: [String]
});

module.exports = mongoose.model('Logement', logementSchema);
