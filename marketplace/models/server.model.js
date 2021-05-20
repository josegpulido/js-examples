// Importaciones de terceros
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');
// Importaciones propias
const { initDatabaseConnection } = require('../db/mongoose.config');

/**
 * La intención de encapsular express y sus métodos dentro de
 * una clase es la de poder reutilizar la clase cuando
 * se desee crear nuevas instancias en futuros proyectos.
 */
class Server {

  // Constructor
  constructor() {
    // Configurando Express
    this.app = express();

    // Configurando propiedades de la clase
    this.port = process.env.PORT;

    // Estableciendo conexión entre Mongoose y MongoDB
    initDatabaseConnection();

    // Ejecutando middlewares
    this.middlewares();

    // Definiendo rutas de la aplicación
    this.routes();
  }

  // Método para ejecutar middlewares para Express
  middlewares() {
    // Protección de origenes de llamadas al endpoint
    this.app.use(cors());
    // Sirviendo contenido estático
    this.app.use(
      express.static('public')
    );
    /**
     * Configuración recomendada por express-fileupload. Básicamente,
     * almacena los archivos en una carpeta temporal en lugar de mantenerlos
     * en memoria durante su procesamiento y subida, con el propósito
     * de mejorar los tiempos de respuesta y consumo de memoria.
     */
    this.app.use(fileupload({
      useTempFiles: true,
      tempFileDir: '/tmp'
    }));
    // Parseo de los objetos json que se reciban por el request.body
    this.app.use(express.json());
  }

  // Método para declarar las rutas de Express disponibles
  routes() {

    // Rutas para manejo de usuarios
    this.app.use('/user', require('../routes/users.routes.js'));

    // Rutas para autenticación de usuarios
    this.app.use('/auth', require('../routes/auth.routes.js'));

    // Rutas para manejo de categorías del marketplace
    this.app.use('/category', require('../routes/categories.routes.js'));

    // Rutas para manejo de productos del marketplace
    this.app.use('/product', require('../routes/products.routes.js'));

    // Rutas para búsquedas del marketplace
    this.app.use('/search', require('../routes/searches.routes.js'));

    // Rutas para subir imágenes a Cloudinary
    this.app.use('/images', require('../routes/uploads.routes.js'));
    
  }

  // Método que arranca el listener del servidor de Express
  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor Express iniciado en puerto ${this.port}`);
    });
  }
}

module.exports = Server;