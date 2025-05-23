const express = require('express');
const router = express.Router();
const Logement = require('../models/Logement');
const Reservation = require('../models/Reservation');

// ➕ Ajouter un nouveau logement
router.post('/', async (req, res) => {
  try {
    const logement = new Logement(req.body);
    await logement.save();
    res.status(201).json(logement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Requêtes avancées AVANT les routes dynamiques

// Trier les logements par prix
router.get('/tri/prix', async (req, res) => {
  const logements = await Logement.find().sort({ prixParNuit: 1 });
  res.json(logements);
});

// Filtrer par chambres et prix
router.get('/filtre', async (req, res) => {
  const chambres = parseInt(req.query.chambres);
  const prix = parseFloat(req.query.prix);
  const logements = await Logement.find({
    nombreChambres: { $gt: chambres },
    prixParNuit: { $lt: prix }
  });
  res.json(logements);
});

// Filtrer par équipements
router.get('/equipements', async (req, res) => {
  const equipements = req.query.eq;
  const query = Array.isArray(equipements)
    ? { equipements: { $all: equipements } }
    : {};
  const logements = await Logement.find(query);
  res.json(logements);
});

// Lister par ville
router.get('/ville/:ville', async (req, res) => {
  const logements = await Logement.find({ ville: req.params.ville });
  res.json(logements);
});

// Lister les logements d’un propriétaire
router.get('/proprietaire/:id', async (req, res) => {
  const logements = await Logement.find({ proprietaireId: req.params.id });
  res.json(logements);
});

// 📄 Récupérer tous les logements
router.get('/', async (req, res) => {
  try {
    const logements = await Logement.find();
    res.json(logements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Récupérer un logement par ID
router.get('/:id', async (req, res) => {
  try {
    const logement = await Logement.findById(req.params.id);
    if (!logement) return res.status(404).json({ error: 'Logement non trouvé' });
    res.json(logement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Modifier un logement
router.put('/:id', async (req, res) => {
  try {
    const logement = await Logement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(logement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Supprimer un logement et ses réservations
router.delete('/:id', async (req, res) => {
  try {
    const logementId = req.params.id;
    await Reservation.deleteMany({ logementId }); // supprime les résas liées
    await Logement.findByIdAndDelete(logementId);
    res.json({ message: 'Logement et ses réservations supprimés' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
