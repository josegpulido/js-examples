// Importaciones de terceros
require('dotenv').config();
const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');

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
    // Ruta para ...
    // this.app.use('/user', require('../routes/users.routes.js'));
  }

  // Método para definir y trabajar los eventos tipo web sockets que recibe el servidor
  sockets() {
    /**
     * Evento que se dispara cuando un nuevo cliente se conecta por
     * primera vez. Retorna en su callback una instancia que representa
     * al cliente conectado.
     */
    this.socketio.on('connection', socket => {
      console.log('Cliente conectado');
      // Evento que se dispara cuando el cliente conectado se desconecta
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
      /**
       * Callback personalizado para disparar cuando el cliente
       * ejecute el evento llamado 'send-simple-message'. Al utilizar
       * la instancia del cliente y no la instancia de socket.io, el
       * efecto de propagación unicast.
       */
      socket.on('send-simple-message', payload => {
        /**
         * Emitiendo un evento de vuelta. La idea es enviar el
         * payload modificado de vuelta únicamente al cliente
         * que envió el payload (unicast).
         * 
         * Adicionalmente, se puede recibir como segundo parámetro
         * del callback otro callback enviado desde el cliente.
         */
        payload.receivedAt = new Date();
        socket.emit('send-simple-message', payload);
        /**
         * Para enviar un mensaje a todos los clientes (broadcast),
         * se emite el mismo evento pero en su lugar con la instancia
         * global de socket.io.
         */
        this.socketio.emit('send-simple-message', 'Message broadcasted...');
        /**
         * También es posible emitir un evento tipo broadcast que ignore
         * al cliente conectado. Por ejemplo, el cliente 1 envía un mensaje,
         * y el servidor envía un mensaje a todos los clientes conectados
         * exceptuando el cliente 1.
         */
        socket.broadcast.emit('send-simple-message', 'Broadcast but also ignore...');
      });
    });
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