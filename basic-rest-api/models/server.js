// Importaciones de terceros
require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

    // Ejecutando middlewares
    this.middlewares();

    // Definiendo rutas de la aplicación
    this.routes();
  }

  // Método para ejecutar middlewares para Express
  middlewares() {
    // Protección de origenes de llamadas al endpoint
    this.app.use(cors());
    // Parseo de los objetos json que se reciban por el request.body
    this.app.use(express.json());
    // Sirviendo directorio public
    this.app.use(
      express.static('public')
    );
  }

  // Método para declarar las rutas de Express disponibles
  routes() {

    // Rutas para manejo de usuarios
    this.app.use('/users', require('../routes/users.routes.js'));
    
  }

  // Método que arranca el listener del servidor de Express
  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor Express iniciado en puerto ${this.port}`);
    });
  }
}

module.exports = Server;