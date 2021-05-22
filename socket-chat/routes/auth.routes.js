// Importaciones de terceros
const { Router } = require('express');
const { check } = require('express-validator');
// Importaciones propias
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');
const { generateToken, verifyToken, renewToken } = require('../middlewares/jwt.middleware');
const { validUserByEmailAndPassword } = require('../helpers/utils');
const users = require('../db/data.json');

// Inicializaciones
const router = Router();

// =====================================================================================
// Ruta para crear un JWT al iniciar sesión ============================================
// =====================================================================================
router.post('/login', [
  check('email', 'Campo email inválido').isEmail(),
  check('password', 'Campo password obligatorio').not().isEmpty().isLength({ min: 6 })
], checkExpValErrors, async (req, res) => {
  // Emulando verificación de usuario en BD y regresando token a usuario
  const { email, password } = req.body;
  const index = validUserByEmailAndPassword(email, password);
  if (typeof index === 'undefined') {
    return res.status(400).json({
      status: 400,
      error: 'Usuario o contraseña incorrectos'
    });
  }
  // Generando el JWT para el manejo de la sesión
  const token = await generateToken({
    uid: users[index].uid
  });
  // Retornando respuesta
  return res.status(200).json({
    status: 200,
    token: token,
    user: users[index]
  });
});

// =====================================================================================
// Ruta para renovar JWT en caso de ser válido =========================================
// =====================================================================================
router.get('/', verifyToken, renewToken);

module.exports = router;