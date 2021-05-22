// Importaciones de terceros
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Importaciones propias
const { validUserByUid } = require('../helpers/utils');
const users = require('../db/data.json');
const ChatRoom = require('../models/chat.model');
const chatroom = new ChatRoom();

// Controlador de socket de conexión entrante
function onConnection(socket, io) {
  // Autenticando el header 'mysocketjwt' que contiene el token de autenticación
  try {

    // Verificando el token y recuperando el payload en caso de pasar validación
    const { uid } = jwt.verify(socket.handshake.headers.mysocketjwt, process.env.JWT_SECRET_KEY);
    // Obteniendo usuario
    const index = validUserByUid(uid);
    const user = users[index];
    if (!user) {
      throw new Error(`El usuario con el uid ${uid} no existe`);
    }

    // Conexión establecida... Informando de nuevo usuario conectado a dependientes
    chatroom.connectUser(user);
    io.emit('connected-users', chatroom.usersOnline);

    // Enviando primera tanda de mensajes en caso de haberlos
    socket.emit('chat-state', chatroom.allMessages);

    // Eventos
    // ...Evento que actualiza el arreglo de usuarios conectados en caso de perder la conexión actual
    socket.on('disconnect', () => {
      chatroom.disconnectUser(user.uid);
      io.emit('connected-users', chatroom.usersOnline);
    });
    
    // ...Evento que envía un mensaje al chat
    socket.on('send-message', payload => {
      chatroom.joinMessage(payload.message, payload.author);
      io.emit('chat-state', chatroom.allMessages);
    });

  } catch (err) {
    socket.emit('connection-status', 'Autenticación requerida');
    socket.disconnect();
  }
}

module.exports = {
  onConnection
};