/**
 * Middleware de gestion centralisée des erreurs Express.
 */
function errorHandler(err, req, res, next) {
  console.error('[Éther Error]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Erreur interne du serveur',
  });
}

module.exports = { errorHandler };
