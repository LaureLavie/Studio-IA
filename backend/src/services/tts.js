const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

/**
 * Synthèse vocale via edge-tts (Microsoft Edge TTS — gratuit, sans clé).
 * Nécessite que edge-tts soit installé : pip install edge-tts
 *
 * @param {string} texte - Texte à synthétiser
 * @param {string} voix  - ID de voix (ex: fr-FR-DeniseNeural)
 * @returns {Promise<Buffer>} - Buffer audio MP3
 */
async function synthetiserVoix(texte, voix = 'fr-FR-DeniseNeural') {
  const sortie = path.join(os.tmpdir(), `tts-${uuidv4()}.mp3`);

  return new Promise((resolve, reject) => {
    // Échappe les guillemets dans le texte
    const texteSafe = texte.replace(/"/g, '\\"');
    const cmd = `edge-tts --voice "${voix}" --text "${texteSafe}" --write-media "${sortie}"`;

    exec(cmd, (err) => {
      if (err) return reject(new Error(`TTS échoué : ${err.message}`));
      const buffer = fs.readFileSync(sortie);
      fs.unlinkSync(sortie);
      resolve(buffer);
    });
  });
}

const VOIX_DISPONIBLES = [
  { id: 'fr-FR-DeniseNeural', label: 'Denise (FR, femme)' },
  { id: 'fr-FR-HenriNeural',  label: 'Henri (FR, homme)' },
  { id: 'fr-BE-CharlineNeural', label: 'Charline (BE, femme)' },
  { id: 'en-US-JennyNeural',  label: 'Jenny (EN, femme)' },
  { id: 'en-US-GuyNeural',    label: 'Guy (EN, homme)' },
];

module.exports = { synthetiserVoix, VOIX_DISPONIBLES };
