const express = require('express');
const { appellerLLM } = require('../services/groq');

const router = express.Router();

/**
 * POST /api/texte/generer
 * Body: { prompt: string, systeme?: string }
 */
router.post('/generer', async (req, res, next) => {
  try {
    const { prompt, systeme } = req.body;
    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Le champ "prompt" est requis.' });
    }
    const texte = await appellerLLM(prompt, systeme);
    res.json({ texte });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
