// Utilidades para trabajar con sistemas de archivos
const fs = require('fs');
// Constantes
const DATABASE_PATH = './db/records.json';

class History {

  // Propiedades estáticas
  static instance;

  // Propiedades de clase
  records = [];

  // Constructor Singleton
  constructor() {
    if (!!History.instance) {
      return History.instance;
    }
    History.instance = this;
  }

  /**
   * TODO: Se podría mejorar mucho la lógica en que Node
   * detecta si el archivo existe, está vacío, etc.
   * 
   * Método para inicializar el historial recuperando la BD
   */
  init() {
    // Verificando que el archivo exista antes de querer leerlo
    if (!fs.existsSync(DATABASE_PATH)) {
      this.records = [];
    }
    // Leyendo el archivo y parseando resultado
    console.log('eeees');
    const raw = fs.readFileSync(DATABASE_PATH, { encoding: 'UTF-8' });
    if (raw.length > 0) {
      this.records = JSON.parse(raw);
    } else {
      this.records = [];
    }
  }

  // Método para agregar un registro al historial de búsquedas
  addRecord(record) {
    // Colocando nuevo registro al inicio de la lista
    this.records.unshift(record);
    // Sobreescribiendo colección de datos completa
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(this.records));
  }

}

module.exports = History;