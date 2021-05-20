// Importaciones de terceros
const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const { check } = require('express-validator');
// Importaciones propias
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');
const User = require('../models/user.model');
const { generateToken } = require('../middlewares/jwt.middleware');

// Inicializaciones
const router = Router();

// =====================================================================================
// Ruta para crear un JWT al iniciar sesión ============================================
// =====================================================================================
router.post('/login', [
  check('email', 'Campo email inválido').isEmail(),
  check('password', 'Campo password obligatorio').not().isEmpty().isLength({ min: 6 })
], checkExpValErrors, async (req, res) => {
  /**
   * Generando el JWT para el manejo de la sesión. Este artefacto
   * permitirá a un usuario interactuar con las rutas protegidas del API
   * sin tener que iniciar sesión cada vez que se requiera cersiorarse
   * de su autenticidad. En este caso, el token dura 4h, y una vez pasado
   * dicho tiempo, el API identificará que se trata de un token
   * expirado, y entonces no podrá continuar con la ejecución de las rutas.
   * 
   * ...Desestructurando los valores de interés
   */
  const { email, password } = req.body;
  /**
   * Validando que el correo proporcionado exista. Esto se puede hacer
   * en los middlewares, pero se necesita recuperar el documento de MongoDB,
   * por lo que la conviene hacerla en este bloque.
   */
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    return res.status(400).json({
      status: 400,
      error: `La dirección ${email} no existe`
    });
  }
  // Validando que el usuario no se encuentre deshabilitado
  if (user.disabled === true) {
    return res.status(400).json({
      status: 400,
      error: 'El usuario se encuentra deshabilitado'
    });
  }
  /**
   * Validando si la contraseña proporcionada en raw es igual
   * a la contraseña encriptada que se encuentra en la BD.
   * 
   * compareSync() compara el valor hasheado contra el valor
   * que debería encontrarse hasheado dentro de la cadena.
   */
  const passwordIsValid = bcryptjs.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(400).json({
      status: 400,
      error: 'La contraseña es incorrecta'
    });
  }
  // Generando el JWT para el manejo de la sesión.
  const token = await generateToken(user.id, user.email);
  // Retornando respuesta
  return res.status(200).json({
    status: 200,
    user: user,
    token: token
  });
});

module.exports = router;