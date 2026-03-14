/**
 * Génération d'images via Pollinations.ai (gratuit, sans clé API).
 * Retourne une URL directe vers l'image.
 *
 * @param {string} prompt  - Description de l'image
 * @param {number} largeur - Largeur en pixels
 * @param {number} hauteur - Hauteur en pixels
 * @returns {string} URL de l'image générée
 */
function genererImageUrl(prompt, largeur = 1024, hauteur = 1024) {
  const promptEncode = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${promptEncode}?width=${largeur}&height=${hauteur}&nologo=true&enhance=true`;
}

module.exports = { genererImageUrl };
