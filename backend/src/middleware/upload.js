const multer = require('multer');
const path = require('path');
const os = require('os');

/**
 * Stockage temporaire dans /tmp — supprimé après traitement.
 */
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp3', '.wav', '.webm', '.m4a', '.ogg', '.flac'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Format non supporté : ${ext}`));
    }
  },
});

module.exports = { upload };
