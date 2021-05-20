// Importaciones de terceros
const path = require('path');
const fs = require('fs');
const { Router } = require('express');
const { v4:uuid } = require('uuid');
const { check } = require('express-validator');
// Importaciones propias
const { verifyToken } = require('../middlewares/jwt.middleware');
const { checkExpValErrors } = require('../middlewares/errors-checker.middleware');
const Product = require('../models/product.model');
const { isAdmittedImageFile, moveUploadedFile } = require('../helpers/utils.helper');
const databaseValidators = require('../db/validators');

// Inicializaciones
const router = Router();

// =====================================================================================
// Subir imagen a servidor y guardar url en BD =========================================
// =====================================================================================
router.post('/product/:id', verifyToken, [
  check('id', 'Campo id inválido').isMongoId().bail().custom(databaseValidators.checkIfProductIdExists)
], checkExpValErrors, (req, res, next) => {
  // Desestructurando valores de interés
  const { id } = req.params;
  /**
   * Verificando si express-fileupload procesó los archivos entrantes
   * y los adjunto a la propiedad files del objeto request.
   */
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.myAttachedFile) {
    return res.status(400).json({
      status: 400,
      error: 'No se adjuntaron archivos a la petición'
    });
  }
  // Desestructurando el archivo del objeto files
  const { myAttachedFile:file } = req.files;
  // Validando la extensión del archivo
  let filename = file.name.split('.');
  const { ext, isAdmitted } = isAdmittedImageFile(filename);
  if (!isAdmitted) {
    return res.status(400).json({
      status: 400,
      error: 'Tipo de archivo no permitido, solo se aceptan imágenes'
    });
  }
  // Generando nuevo nombre para archivo
  filename = uuid() + '.' + ext;
  // Moviendo el archivo desde la carpeta temporal hasta la carpeta /uploads
  moveUploadedFile(file, filename)
  .then(_ => {
    // Buscar un registro por su id único y actualizarlo una vez encontrado
    return new Promise((resolve, reject) => {
      Product.findByIdAndUpdate(id, {
        photoUrl: filename
      }, (err, doc) => {
        // Verificando errores en la escritura
        if (err || !doc) {
          return reject(new Error(`El producto con el id ${id} no existe en la BD`));
        }
        // Retornando respuesta
        return resolve(doc);
      });
    });
  })
  .then(_ => {
    return res.status(201).json({
      status: 201,
      error: `Archivo /${filename} subido`
    });
  })
  .catch(e => {
    return res.status(500).json({
      status: 500,
      error: `Ocurrió un error al procesar el archivo /${filename}`
    });
  });
});

// =====================================================================================
// Descargar imagen de un producto =====================================================
// =====================================================================================
router.get('/product/:id', [
  check('id', 'Campo id inválido').isMongoId().bail().custom(databaseValidators.checkIfProductIdExists)
], checkExpValErrors, async (req, res, next) => {
  // Desestructurando valores de interés
  const { id } = req.params;
  // Obteniendo filename del producto
  const product = await Product.findById(id);
  const filePath = path.join(__dirname, '../uploads', product.photoUrl);
  // Validando si el archivo en dicha ubicación aún existe
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({
      status: 500,
      error: `Ocurrió un error en el servidor al procesar la imagen ${filePath}`
    });
  }
  return res.status(200).sendFile(filePath);
});

module.exports = router;