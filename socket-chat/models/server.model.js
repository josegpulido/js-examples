// Importaciones de terceros
require('dotenv').config();
const express = require('express');
// Importaciones propias
const socketsControllers = require('../sockets/controllers.socket');

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

    /**
     * Creando instancia de servidor HTTP con paquete http
     * para pasar instancia a Socket.io y habilitar conexiones
     * activas con protocolo ws.
     */
    this.server = require('http').createServer(this.app);
    /**
     * La propiedad 'sio' contiene todas las funcionalidades que
     * permiten interactuar con los clientes conectados al web socket,
     * como por ejemplo eventos broadcast o comunicación bidireccional.
     * 
     * También, Socket.io sirve de forma automática la ruta .../socket.io.js,
     * por lo que, por ejemplo, las apps web solo tienen que jalar el recurso
     * de Javascript de dicha ruta y podrán disponer de todas las herramientas
     * de Socket.io del lado del cliente.
     */
    this.socketio = require('socket.io')(this.server);

    // Configurando propiedades de la clase
    this.port = process.env.PORT;

    // Ejecutando middlewares
    this.middlewares();

    // Definiendo rutas de la aplicación
    this.routes();

    // Definiendo eventos de web sockets
    this.sockets();
  }

  // Método para ejecutar middlewares para Express
  middlewares() {
    // Sirviendo contenido estático
    this.app.use(
      express.static('public')
    );
    // Parseo de los objetos json que se reciban por el request.body
    this.app.use(express.json());
  }

  // Método para declarar las rutas de Express disponibles
  routes() {

    // Ruta para autenticar un usuario
    this.app.use('/auth', require('../routes/auth.routes.js'));
    
  }

  // Método para definir y trabajar los eventos tipo web sockets que recibe el servidor
  sockets() {

    // Socket controlador de conexión entrante
    this.socketio.on('connection', (socket) => socketsControllers.onConnection(socket, this.socketio));

  }

  // Método que arranca el listener del servidor de Express
  start() {
    /**
     * Para integrar Socket.io al servidor de express, ahora la instancia
     * de express se encuentra dentro de la propiedad de clase 'server',
     * por lo que el listen se hará en la instancia de 'server', y no en
     * la de 'app'.
     */
    this.server.listen(this.port, () => {
      console.log(`Servidor Express iniciado en puerto ${this.port}`);
    });
  }
}

module.exports = Server;