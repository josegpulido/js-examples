/**
 * Capturando objeto socket expuesto por la librería
 * de Socket.io provista por el servidor.
 */
const socket = io();
// Recuperando entidades HTML del documento
const socketIndicator = document.querySelector('#socket-indicator');
const txtMessage = document.querySelector('#txt-message');
const btnSendMessage = document.querySelector('#btn-send-message');

/**
 * Eventos para detectar cuando el cliente se ha conectado
 * o desconectado del servidor.
 */
socket.on('connect', () => {
  socketIndicator.textContent = 'Conectado';
  socketIndicator.classList.add('socket-connected');
  socketIndicator.classList.remove('socket-disconnected');
});
socket.on('disconnect', () => {
  socketIndicator.textContent = 'Desconectado';
  socketIndicator.classList.add('socket-disconnected');
  socketIndicator.classList.remove('socket-connected');
});

/**
 * Evento para enviar mensaje a servidor a través de la
 * conexión socket.
 */
btnSendMessage.addEventListener('click', () => {
  // Capturando valor del input de texto
  const text = txtMessage.value;
  /**
   * Emitir valor a través del socket. El nombre del evento
   * puede ser cualquiera, pero se acostumbra usar solo
   * minúsculas y guiones medios. Este nombre tienen que coincidir
   * en nombre con el evento que lo recibe del lado del servidor.
   */
  socket.emit('send-simple-message', {
    message: text
  });
  // Limpiar input de texto
  txtMessage.value = '';
});

// Evento personalizado de conexión socket
socket.on('send-simple-message', payload => {
  console.log(payload);
});