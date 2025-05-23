const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  logementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Logement', required: true },
  locataireId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  prixTotal: { type: Number, required: true },
  statut: {
    type: String,
    enum: ['en attente', 'confirmée', 'annulée'], // ✅ ici on ajoute 'en attente'
    default: 'en attente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
