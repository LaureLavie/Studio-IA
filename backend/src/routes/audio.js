const express = require('express');
const fs = require('fs');
const { upload } = require('../middleware/upload');
const { transcrireAudio } = require('../services/groq');
const { synthetiserVoix, VOIX_DISPONIBLES } = require('../services/tts');
const { genererMusique } = require('../services/music');

const router = express.Router();

/**
 * GET /api/audio/voix
 * Retourne la liste des voix TTS disponibles.
 */
router.get('/voix', (req, res) => {
  res.json({ voix: VOIX_DISPONIBLES });
});

/**
 * POST /api/audio/transcrire
 * Multipart: fichier audio → transcription texte.
 */
router.post('/transcrire', upload.single('fichier'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier audio fourni.' });
    }
    const transcription = await transcrireAudio(req.file.path);
    fs.unlinkSync(req.file.path); // nettoyage
    res.json({ transcription });
  } catch (err) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    next(err);
  }
});

/**
 * POST /api/audio/synthese-vocale
 * Body: { texte: string, voix?: string }
 * Retourne un buffer MP3.
 */
router.post('/synthese-vocale', async (req, res, next) => {
  try {
    const { texte, voix = 'fr-FR-DeniseNeural' } = req.body;
    if (!texte?.trim()) {
      return res.status(400).json({ error: 'Le champ "texte" est requis.' });
    }
    const buffer = await synthetiserVoix(texte, voix);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="voix.mp3"',
    });
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/audio/musique
 * Body: { prompt: string, duree?: number }
 * Retourne un buffer audio WAV.
 */
router.post('/musique', async (req, res, next) => {
  try {
    const { prompt, duree = 10 } = req.body;
    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Le champ "prompt" est requis.' });
    }
    const buffer = await genererMusique(prompt, Math.min(Math.max(parseInt(duree), 5), 30));
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'attachment; filename="musique.wav"',
    });
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
