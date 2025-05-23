const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
// 📝 REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      type,
      dateInscription: new Date()
    });

    await newUser.save();

    res.status(201).json({
      message: 'Inscription réussie',
      userId: newUser._id,
      user: {
        name: newUser.name,
        email: newUser.email,
        type: newUser.type
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Connexion réussie',
      token,
      userId: user._id,
      user: {
        name: user.name,
        email: user.email,
        type: user.type // ✅ très important !
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;