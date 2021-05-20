// Importaciones de terceros
const { validationResult } = require('express-validator');

/**
 * Método que revisa si el objeto request contiene
 * errores adjuntados por el middleware check() de express-validator.
 */
function checkExpValErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  next();
}

module.exports = {
  checkExpValErrors
};