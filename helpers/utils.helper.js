// Importaciones de terceros
const path = require('path');
require('dotenv').config();

/**
 * Método para comprobar si un filename contiene una extensión de
 * tipo imagen admitida. Esta lógica podría mejorarse puesto que
 * podrían subir archivos, por ejemplo, con extensión .jpg cuando
 * en realidad son un ejecutable para Windows/Unix e instalar
 * sofwate malicioso dentro del equipo.
 */
function isAdmittedImageFile(filename) {
  const admittedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const ext = filename[filename.length - 1];
  return {
    isAdmitted: admittedExtensions.includes(ext),
    ext: ext
  };
}

// Promesa para dejar un archivo tratado por express-uploadfile en directorio /uploads
function moveUploadedFile(file, filename) {
  // Capturando el path donde express-fileupload subió el archivo a la carpeta temporal
  const filePath = path.join(__dirname, '../uploads', filename);
  // Arrancando promesa
  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) {
        return reject(err);
      }
      // Retornando respuesta
      return resolve();
    });
  });
}

module.exports = {
  isAdmittedImageFile,
  moveUploadedFile
};