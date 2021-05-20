// Importaciones de terceros
const { Router } = require('express');
const { check } = require('express-validator');
// Importaciones propias
const { isAdminRole } = require('../middlewares/roles.middleware');
const { verifyToken } = require('../middlewares/jwt.middleware');
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');
const Category = require('../models/category.model');

// Inicializaciones
const router = Router();

// =====================================================================================
// Obtener todas las categorías ========================================================
// =====================================================================================
router.get('/', async (req, res, next) => {
  // Desestructurando valores de interés
  let { limit = 10, page = 0 } = req.query;
  // Casteando parámetros query, lo cual también podría hacerse con middlewares...
  limit = Number(limit);
  page = Number(page);
  // Obteniendo un conjunto de documentos de MongoDB a partir de un query
  const categories = await Category.find()
  .skip(page)
  .limit(limit)
  /**
   * populate() permite interpolar dentro de un campo (el cual
   * forzosamente necesita ser un ObjectId) contenido específico
   * de otro documento de la BD que tenga por identificador el
   * valor encontrado en dicho campo.
   */
  .populate('author', [ 'displayName', 'email', 'photoURL' ]);
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    length: categories.length,
    results: categories
  });
});

// =====================================================================================
// Obtener una categoría en específico =================================================
// =====================================================================================
router.get('/:id', [
  check('id', 'Campo id inválido').isMongoId()
], checkExpValErrors, async (req, res, next) => {
  // Cachando parámetro posicional desestructurandolo del objeto request
  const { id } = req.params;
  // Obteniendo un documento de la BD
  const category = await Category.findById(id)
  .populate('author', [ 'displayName', 'email', 'photoURL' ]);
  if (!category) {
    return res.status(400).json({
      status: 400,
      error: `La categoría con el id ${id} no existe en la BD`
    });
  }
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    result: category
  });
});

// =====================================================================================
// Crear nueva categoría ===============================================================
// =====================================================================================
router.post('/', verifyToken, [
  check('name', 'Campo name inválido').not().isEmpty()
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { uid } = req.jwt.payload;
  let { name:categoryName } = req.body;
  categoryName = categoryName.toUpperCase();
  // Verificando que no exista otra categoría con el mismo nombre
  const cateoryExists = await Category.findOne({
    name: categoryName
  });
  if (cateoryExists) {
    return res.status(400).json({
      status: 400,
      error: `La categoría con el nombre ${categoryName} ya existe en la BD`
    });
  }
  // Creando instancia de un nueva categoría
  const category = new Category({
    name: categoryName,
    author: uid
  });
  /**
  * Guardando instancia en nuevo documento de la
  * colección Categories de MongoDB.
  */
  category.save((err, beenStored) => {
    if (err) {
      /**
       * Aquí podrían ocurrir varios tipos de errores, pero este ejercicio
       * no está diseñado para optimizar su manejo.
       */
      return res.status(500).json({
        status: 500,
        error: `No fue posible crear la categoría ${categoryName}`
      });
    }
    // Retornando respuesta
    res.status(201).json({
      status: 201,
      category: category
    });
  });
});

// =====================================================================================
// Actualizar una categoría en específico ==============================================
// =====================================================================================
router.put('/:id', verifyToken, [
  check('id', 'Campo id inválido').isMongoId(),
  check('name', 'Campo name inválido').not().isEmpty(),
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { id } = req.params;
  const { name:newName } = req.body;
  // Buscar un registro por su id único y actualizarlo una vez encontrado
  Category.findByIdAndUpdate(id, {
    name: newName.toUpperCase()
  }, (err, doc) => {
    // Verificando errores en la escritura
    if (err || !doc) {
      return res.status(400).json({
        status: 400,
        error: `La categoría con el id ${id} no existe en la BD`
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
// Borrar una categoría en específico ==================================================
// =====================================================================================
router.delete('/:id', verifyToken, isAdminRole, [
  check('id', 'Campo id inválido').isMongoId()
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { id } = req.params;
  // Buscar un registro por su id único y eliminarlo una vez encontrado
  Category.findByIdAndDelete(id, (err, doc) => {
    // Verificando errores en la escritura
    if (err || !doc) {
      return res.status(400).json({
        status: 400,
        error: `La categoría con el id ${id} no existe en la BD`
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