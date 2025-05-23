const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const logementRoutes = require('./routes/logementRoutes'); 
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Init Express
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);           // ✅ PAS: authRoutes()
app.use('/api/users', userRoutes);
app.use('/api/logements', logementRoutes);
app.use('/api/reservations', reservationRoutes);
// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
 
