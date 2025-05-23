const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// ➕ Ajouter une réservation
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📊 Statistiques : total dépensé par utilisateur
router.get('/statistiques', async (req, res) => {
  const stats = await Reservation.aggregate([
    {
      $group: {
        _id: "$locataireId",
        totalDepense: { $sum: "$prixTotal" },
        nbReservations: { $sum: 1 }
      }
    }
  ]);
  res.json(stats);
});

// 🔍 Obtenir les réservations d’un utilisateur
router.get('/utilisateur/:id', async (req, res) => {
  const reservations = await Reservation.find({ locataireId: req.params.id });
  res.json(reservations);
});

// 📄 Obtenir toutes les réservations
router.get('/', async (req, res) => {
  const reservations = await Reservation.find();
  res.json(reservations);
});

// 🔍 Obtenir une réservation par ID
router.get('/:id', async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });
  res.json(reservation);
});

// ✏️ Modifier une réservation
router.put('/:id', async (req, res) => {
  const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ❌ Supprimer une réservation
router.delete('/:id', async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ message: 'Réservation supprimée' });
});

module.exports = router;
