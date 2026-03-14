const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Génère une réponse texte via Llama 3 (Groq).
 * @param {string} prompt - Message utilisateur
 * @param {string} systeme - Personnalité de l'assistant
 * @returns {Promise<string>}
 */
async function appellerLLM(prompt, systeme = "Tu es un assistant créatif pour un studio multimédia.") {
  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: systeme },
      { role: 'user', content: prompt },
    ],
    max_tokens: 2048,
  });
  return completion.choices[0].message.content;
}

/**
 * Transcrit un fichier audio via Groq Whisper large-v3.
 * @param {string} cheminFichier - Chemin local du fichier audio
 * @returns {Promise<string>}
 */
async function transcrireAudio(cheminFichier) {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(cheminFichier),
    model: 'whisper-large-v3',
    language: 'fr',
  });
  return transcription.text;
}

module.exports = { appellerLLM, transcrireAudio };
