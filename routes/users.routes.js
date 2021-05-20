// Importaciones de terceros
const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const { check } = require('express-validator');
// Importaciones propias
const User = require('../models/user.model');
const databaseValidators = require('../db/validators');
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');
const { verifyToken, verifyGoogleToken } = require('../middlewares/jwt.middleware');
const { isAdminRole, isRole } = require('../middlewares/roles.middleware');

// Inicializaciones
const router = Router();

// =====================================================================================
// Ruta para crear un usuario ==========================================================
// =====================================================================================
router.post('/', [
  /**
   * check() es un middleware de ruta que valida un campo del
   * objeto req.body y los adjunta en el mismo objeto request.
   * Es preferible enviar un arreglo de middlewares
   * que estarlos separando cada uno por comas.
   */
  check('email', 'Campo email inválido').isEmail().custom(databaseValidators.checkIfEmailNotExists),
  check('password', 'Campo password obligatorio').not().isEmpty().isLength({ min: 6 }),
  check('displayName', 'Campo displayName obligatorio').not().isEmpty(),
  check('role', 'Campo role inválido').custom(databaseValidators.checkIfRoleExists)
], checkExpValErrors, async (req, res) => {
  /**
   * Creando instancia de un nuevo usuario.
   * Es posible enviar todo el objeto body, ya
   * que el model() de Mongoose ignora el resto
   * de propiedades y solo toma las usa las
   * definidas en el Schema.
   */
  const user = new User(req.body);
  /**
   * Crear hash de contraseña. Un salt es un método
   * que itera n veces una cadena de texto intercambiando
   * sus caracteres. Entre mayor sea el número de iteraciones, más
   * transformada quedará la contraseña, pero también más
   * tardará en realizar dicha encriptación. El número
   * por defecto es 10.
   */
  const { password } = req.body;
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  /**
   * Guardando instancia en nuevo documento de la
   * colección Users de MongoDB.
   */
  await user.save();
  // Retornando respuesta
  res.status(201).json({
    status: 201,
    lastSnapshot: user
  });
});

// =====================================================================================
// Ruta para crear un usuario mediante Google Sign In ==================================
// =====================================================================================
router.post('/with-google', verifyGoogleToken(false), async (req, res) => {
  // Hasta este punto, el token ya se encuentra dentro del objeto request
  const { payload } = req.jwt;
  // Agregando otra información al payload para completar el registro en la BD
  payload.password = 'none';
  payload.signedWithGoogle = true;
  /**
   * TODO: Controlar el id de documento de MongoDB, ya que al momento
   * de verificar el token, el uid de usuario del token de Google no es el mismo
   * que el uid de usuario de la BD. De igual manera, las rutas están protegidas
   * para usuarios creados en la plataforma debido a su middleware, ya que este
   * valdia con el paquete jsonwebtoken. Se debería construir un middleware que pueda
   * distinguir entre ambos, pero pasando únicamente el mismo token a la misma ruta.
   */
  // Creando Schema de usuario, recordar que el rol por defecto es USER_ROLE
  const user = new User(payload);
  /**
   * Guardando instancia en nuevo documento de la
   * colección Users de MongoDB.
   */
  await user.save((err, beenStored) => {
    if (err) {
      /**
       * Aquí podrían ocurrir varios tipos de errores, pero este ejercicio
       * no está diseñado para optimizar su manejo, simplemente es una 
       * demostración de cuál sería el workflow creando un usuario con
       * Google Sign In.
       */
      return res.status(400).json({
        status: 400,
        error: `La dirección ${payload.email} ya se encuentra registrada`
      });
    }
    // Retornando respuesta
    res.status(201).json({
      status: 201,
      lastSnapshot: user
    });
  });
});

// =====================================================================================
// Ruta para actualizar la información de perfil de un usuario =========================
// =====================================================================================
router.put('/:id', verifyToken, isRole('SALES_ROLE', 'ADMIN_ROLE'), [
  /**
   * check() no solo revisa los parámetros tipo query, sino también
   * los parámetros de segmento (o posicionales) que se encuentra
   * dentro del url.
   * 
   * bail() impide que se continue con las validaciones si se encontró
   * un error en el validador que le antecede.
   */
   check('id', 'Campo id inválido').isMongoId().bail().custom(databaseValidators.checkIfUserIdExists)
], checkExpValErrors, async (req, res) => {
  // Cachando parámetro posicional desestructurandolo del objeto request
  const { id } = req.params;
  /**
   * Desestructurando el body para excluir campos que coincidan con
   * otros campos de MongoDB. 'body' contiene el resto de parámetros
   * que no se excluyeron. Esta estrategía no es tan segura ni precisa,
   * puesto que podrían incluir campos y valores personalizados tan solo
   * agregadolos al body del request.
   */
  const { password, email, _id, role, disabled, signedWithGoogle, ...body } = req.body;
  // Encriptando nueva contraseña (en caso de que el body contenga el campo password)
  if (password) {
    const salt = bcryptjs.genSaltSync();
    body.password = bcryptjs.hashSync(password, salt);
  }
  // Buscar un registro por su id único y actualizarlo una vez encontrado
  const user = await User.findByIdAndUpdate(id, body);
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    lastSnapshot: user
  });
});

// =====================================================================================
// Ruta para obtener una lista de usuarios =============================================
// =====================================================================================
router.get('/', verifyToken, async (req, res) => {
  // Desestructurando parámetro opcional para definir la página a consultar
  let { limit = 10, page = 0 } = req.query;
  // Casteando parámetros query, lo cual también podría hacerse con middlewares...
  limit = Number(limit);
  page = Number(page);
  // Obteniendo un conjunto de documentos de MongoDB a partir de un query
  const users = await User.find(
    /**
     * Este método recibe un objeto que sirve para ejecutar
     * un filtro sobre la búsqueda. En este caso, según la lógica
     * de negocio, los usuarios 'existentes' solo son aquellos que
     * no están deshabilitados.
     */
    {
      disabled: false
    }
  )
  .skip(page) // <-- De los resultados obtenidos, ignora los primeros n documentos
  .limit(limit); // <-- De los resultados obtenidos, ignora los últimos n documentos
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    length: users.length,
    results: users
  });
});

// =====================================================================================
// Ruta para borrar un usuario =========================================================
// =====================================================================================
router.delete('/:id', verifyToken, isAdminRole, [
   check('id', 'Campo id inválido').isMongoId().bail().custom(databaseValidators.checkIfUserIdExists)
], checkExpValErrors, async (req, res) => {
  // Cachando los parametros posicionales y query desestructurandolos del objeto request
  const { id } = req.params;
  let { disable } = req.query;
  // Casteando parámetros query, lo cual también podría hacerse con middlewares...
  disable = disable === 'true';
  // Verificando si se borrará el registro de forma definitva o no de la BD
  let user;
  if (disable) {
    // ...Solo deshabilitando la cuenta del usuario
    user = await User.findByIdAndUpdate(id, {
      disabled: true
    });
  } else {
    // ...Borrando definitivamente
    user = await User.findByIdAndDelete(id);
  }
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    lastSnapshot: user
  });
});

module.exports = router;