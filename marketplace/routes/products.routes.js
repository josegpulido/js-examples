// Importaciones de terceros
const { Router } = require('express');
const { check } = require('express-validator');
// Importaciones propias
const Product = require('../models/product.model');
const { isAdminRole } = require('../middlewares/roles.middleware');
const { verifyToken } = require('../middlewares/jwt.middleware');
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');

// Inicializaciones
const router = Router();

// =====================================================================================
// Obtener todos los productos =========================================================
// =====================================================================================
router.get('/', async (req, res, next) => {
  // Desestructurando valores de interés
  let { limit = 10, page = 0 } = req.query;
  // Casteando parámetros query, lo cual también podría hacerse con middlewares...
  limit = Number(limit);
  page = Number(page);
  // Obteniendo un conjunto de documentos de MongoDB a partir de un query
  const products = await Product.find()
  .skip(page)
  .limit(limit)
  /**
   * populate() permite interpolar dentro de un campo (el cual
   * forzosamente necesita ser un ObjectId) contenido específico
   * de otro documento de la BD que tenga por identificador el
   * valor encontrado en dicho campo.
   */
  .populate('category', [ 'name' ])
  .populate('author', [ 'displayName', 'email', 'photoURL' ]);
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    length: products.length,
    results: products
  });
});

// =====================================================================================
// Obtener un producto en específico ===================================================
// =====================================================================================
router.get('/:id', [
  check('id', 'Campo id inválido').isMongoId()
], checkExpValErrors, async (req, res, next) => {
  // Cachando parámetro posicional desestructurandolo del objeto request
  const { id } = req.params;
  // Obteniendo un documento de la BD
  const product = await Product.findById(id)
  .populate('category', [ 'name' ])
  .populate('author', [ 'displayName', 'email', 'photoURL' ]);
  if (!product) {
    return res.status(400).json({
      status: 400,
      error: `El producto con el id ${id} no existe en la BD`
    });
  }
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    result: product
  });
});

// =====================================================================================
// Crear nuevo producto ================================================================
// =====================================================================================
router.post('/', verifyToken, [
  check('name', 'Campo name inválido').not().isEmpty(),
  check('description', 'Campo description inválido').not().isEmpty(),
  check('price', 'Campo price inválido').not().isEmpty().bail().isNumeric(),
  check('category', 'Campo category inválido').isMongoId()
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { uid } = req.jwt.payload;
  const { name, description, price, category } = req.body;
  // Creando instancia de un nuevo producto
  const product = new Product({
    name: name,
    description: description,
    price: price,
    available: true,
    category: category,
    author: uid
  });
  /**
  * Guardando instancia en nuevo documento de la
  * colección Products de MongoDB.
  */
  product.save((err, doc) => {
    if (err || !doc) {
      /**
       * Aquí podrían ocurrir varios tipos de errores, pero este ejercicio
       * no está diseñado para optimizar su manejo.
       */
      return res.status(500).json({
        status: 500,
        error: `No fue posible crear el producto ${name}`
      });
    }
    // Retornando respuesta
    res.status(201).json({
      status: 201,
      product: product
    });
  });
});

// =====================================================================================
// Actualizar un producto en específico ================================================
// =====================================================================================
router.put('/:id', verifyToken, [
  check('id', 'Campo id inválido').isMongoId(),
  check('photoUrl', 'Campo photoUrl inválido').isURL().optional(),
  check('name', 'Campo name inválido').isString().optional(),
  check('description', 'Campo description inválido').isString().optional(),
  check('price', 'Campo price inválido').isNumeric().optional(),
  check('available', 'Campo available inválido').isBoolean().optional(),
  check('category', 'Campo category inválido').isMongoId().optional()
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { id } = req.params;
  // Buscar un registro por su id único y actualizarlo una vez encontrado
  Product.findByIdAndUpdate(id, req.body, (err, doc) => {
    // Verificando errores en la escritura
    if (err || !doc) {
      return res.status(400).json({
        status: 400,
        error: `El producto con el id ${id} no existe en la BD`
      });
    }
    // Retornando respuesta
    res.status(200).json({
      status: 200,
      lastSnapshot: doc
    });
  });
});

// =====================================================================================
// Borrar un producto en específico ====================================================
// =====================================================================================
router.delete('/:id', verifyToken, isAdminRole, [
  check('id', 'Campo id inválido').isMongoId()
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { id } = req.params;
  // Buscar un registro por su id único y eliminarlo una vez encontrado
  Product.findByIdAndDelete(id, (err, doc) => {
    // Verificando errores en la escritura
    if (err || !doc) {
      return res.status(400).json({
        status: 400,
        error: `El producto con el id ${id} no existe en la BD`
      });
    }
    // Retornando respuesta
    res.status(200).json({
      status: 200,
      lastSnapshot: doc
    });
  });
});

module.exports = router;