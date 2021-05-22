// Utilidades para trabajar con sistemas de archivos
const fs = require('fs');
// Modelos
const { Task } = require('../models/tasks');
// Constantes
const DATABASE_PATH = './db/records.json';

// Método para escribir toda la colección de datos en la BD
function overwriteCollection(data) {
  // Sobreescribiendo colección de datos completa
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(data));
}

// Método para obtener toda la colección de datos de la BD
function getCollection() {
  // Verificando que el archivo exista antes de querer leerlo
  if (!fs.existsSync(DATABASE_PATH)) {
    return {};
  }
  /**
   * Leyendo el archivo y parseando resultado.
   * 
   * En lugar de fs, es completamente posible leer un archivo json
   * mediante la sentencia de node require().
   */
  const raw = fs.readFileSync(DATABASE_PATH, { encoding: 'UTF-8' });
  const collection = JSON.parse(raw);
  let json = {};
  // Recoriendo arreglo para formar un objeto literal que use el id como llave
  collection.forEach(document => {
    /**
     * Aquí podría implementarse un constructor múltiple para la calse
     * Task, como Task,fromJson(document);
     */
    json[document.id] = new Task(document.description, document.id, document.completed);
  });
  return json;
}

module.exports = {
  overwriteCollection,
  getCollection
};