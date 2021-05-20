// Importaciones de terceros
const { Router } = require('express');
const { check, query } = require('express-validator');
// Importaciones propias
const Product = require('../models/product.model');
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');

// Inicializaciones
const router = Router();

// =====================================================================================
// Realizar búsqueda de productos ======================================================
// =====================================================================================
router.get('/products/:query', [
  check('query', 'El parámetro query es incorrecto').isString(),
  /**
   * query() revisa los parámetros tipo query (parámetros opcionales) y
   * trabaja de la misma forma que un check().
   */
  query('limit', 'El parámetro limit es incorrecto').isNumeric().optional(),
  query('page', 'El parámetro page es incorrecto').isNumeric().optional(),
  query('filterBy', 'El parámetro filterBy es incorrecto').isIn([
    'name',
    'description',
    'price',
    'available'
  ]).optional()
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { query } = req.params;
  const { limit = 10, page = 0, filterBy } = req.query;
  let results;
  // Verificando si realizar la búsqueda por un valor en específico de interés
  switch (filterBy) {
    case 'price':
      results = await Product.find({
        price: {
          $gt: 0,
          $lt: Number(query) || 0
        }
      })
      .limit(limit)
      .skip(page)
      .populate('category', [ 'name' ])
      .populate('author', [ 'displayName', 'email', 'photoURL' ]);
    break;
    case 'available':
      results = await Product.find({
        available: (query === 'true')
      })
      .limit(limit)
      .skip(page)
      .populate('category', [ 'name' ])
      .populate('author', [ 'displayName', 'email', 'photoURL' ]);
    break;
    default:
      results = await Product.find({
        /**
         * MongoDB tiene propiedades exclusivas para ejecutar búsquedas
         * que poseen características especiales. Más información en:
         * - https://docs.mongodb.com/manual/reference/operator/query/
         * y
         * - https://docs.mongodb.com/manual/reference/operator/query/text/
         */
        $text: {
          $search: query,
          $caseSensitive: false
        }
      })
      .limit(limit)
      .skip(page)
      .populate('category', [ 'name' ])
      .populate('author', [ 'displayName', 'email', 'photoURL' ]);
      /**
       * Otra forma de ejecutar una búsqueda similar es buscar productos
       * que su nombre contengan la palabra que indica 'query' es
       * pasarle a Mongo una expresión regular, que en este caso indica
       * que haga check en los match sin importar mayúsculas o minúsculas.
       */
      /*
      const regex = new RegExp(query, 'i');
      results = await Product.find({
        [filterBy]: regex
      })
      .limit(limit)
      .skip(page)
      .populate('category', [ 'name' ])
      .populate('author', [ 'displayName', 'email', 'photoURL' ]);
       */
    break;
  }
  // Retornando respuesta
  res.status(200).json({
    status: 200,
    length: results.length,
    results: results
  });
});

module.exports = router;