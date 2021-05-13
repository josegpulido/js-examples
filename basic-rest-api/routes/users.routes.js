/**
 * Paquete de Express que permite encapsular una configuración
 * de routing dentro de una constante.
 */
const { Router } = require('express');

const router = Router();

/**
 * ...Por método GET
 * Se suele usar cuando el usuario simplemente
 * quiere consultar un recurso.
 */
router.get('/', (req, res) => {
  res.send('Hello world from get');
});
/**
 * ...Por método PUT
 * Se suele usar cuando el usuario ha actualizado
 * recursos existentes de la BD.
 * 
 * Esta ruta recibe el parámetro de segmento id
 * de la siguiente forma:
 * http://localhost:3000/users/my_id_example
 */ 
router.put('/:id', (req, res) => {
  // Leyendo parámetros de segmento
  res.json({
    'yourId': req.params.id
  });
});
/**
 * ...Por método POST
 * Se suele usar cuando el usuario ha creado
 * nuevos recursos en la BD.
 * 
 * Esta ruta recibe parámetros opcionales de
 * la siguiente forma:
 * http://localhost:3000/users?name=Jose&city=Durango
 */ 
router.post('/', (req, res) => {
  // Leyendo parámetros query
  let { name, city = 'Monterrey' } = req.query;
  res.send(`Hola, soy ${name || 'Anónimo'} y soy de ${city}.`);
});
/**
 * ...Por método DELETE
 * Se suele usar cuando el usuario ha creado
 * borrado un recurso de la BD.
 */ 
router.delete('/', (req, res) => {
  res.send('Hello world from delete');
});
/**
 * ...Por método PATCH
 * ...
 */ 
router.patch('/', (req, res) => {
  res.send('Hello world from patch');
});

module.exports = router;