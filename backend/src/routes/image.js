const express = require('express');
const { genererImageUrl } = require('../services/imageService');

const router = express.Router();

/**
 * POST /api/image/generer
 * Body: { prompt: string, largeur?: number, hauteur?: number }
 */
router.post('/generer', (req, res, next) => {
  try {
    const { prompt, largeur = 1024, hauteur = 1024 } = req.body;
    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Le champ "prompt" est requis.' });
    }

    const l = Math.min(Math.max(parseInt(largeur), 256), 2048);
    const h = Math.min(Math.max(parseInt(hauteur), 256), 2048);

    const url = genererImageUrl(prompt, l, h);
    res.json({ url, largeur: l, hauteur: h });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
