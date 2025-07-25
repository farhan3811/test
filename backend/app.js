require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('API is running securely...');
});
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
