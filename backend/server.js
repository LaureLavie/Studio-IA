require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./src/middleware/errorHandler');

const texteRouter = require('./src/routes/texte');
const imageRouter = require('./src/routes/image');
const audioRouter = require('./src/routes/audio');

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Éther Backend' }));
app.use('/api/texte', texteRouter);
app.use('/api/image', imageRouter);
app.use('/api/audio', audioRouter);

// ── Erreurs ───────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎛  Éther Backend démarré sur le port ${PORT}`);
});
