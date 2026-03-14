const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/musicgen-small';

/**
 * Génère une piste musicale via MusicGen (Hugging Face Inference API).
 * @param {string} prompt  - Description de la musique souhaitée
 * @param {number} duree   - Durée approximative en secondes (5–30)
 * @returns {Promise<Buffer>} - Buffer audio WAV/FLAC
 */
async function genererMusique(prompt, duree = 10) {
  const { default: fetch } = await import('node-fetch');

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: Math.min(Math.round(duree * 50), 1500),
      },
    }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`HuggingFace API : ${response.status} — ${msg}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

module.exports = { genererMusique };
