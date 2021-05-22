
// Verificando si hay un token en el localStorage o no
const token = localStorage.getItem('token');
if (!token) {
  // Redirigiendo a login
  window.location = 'index.html';
  throw new Error('Se requiere autenticación para acceder a este contenido');
}

let user;
const chatHeadline = document.querySelector('#chat-headline');
const ulOnlineUsers = document.querySelector('#ul-online-users');
const ulChat = document.querySelector('#ul-chat');
const txtMessage = document.querySelector('#txt-message');

(async () => {
  // Renovando el token
  const response = await fetch('http://localhost:5000/auth', {
    method: 'GET',
    headers: {
      'my-jwt': token
    }
  });
  const body = await response.json();
  user = body.user;
  // Guardando nuevo token en el localStorage
  localStorage.setItem('token', body.token);
  chatHeadline.innerHTML = `${user.displayName}, escribe un mensaje`;
  // Modificaciones a la interfaz
  modifyInterface();
  // Levantar conexión socket
  initSocketComm();
})();

// Modificaciones a la interfaz gráfica
function modifyInterface() {
  document.title = `${user.displayName} - Chat Online`
}

// Conectar con servidor mediante web socket
function initSocketComm() {
  /**
   * Capturando objeto socket expuesto por la librería
   * de Socket.io provista por el servidor. Este objeto
   * puede recibir un objeto literal de configuración, y
   * es ahí donde se enviará el header que contendrá el JWT.
   */
  const socket = io({
    'extraHeaders': {
      mysocketjwt: localStorage.getItem('token')
    }
  });
  // Evento keyip para enviar mensaje a chat al teclear ENTER en la caja de texto
  txtMessage.addEventListener('keyup', event => {
    // Verificando que el evento se dispare solo en la tecla ENTER
    if (event.keyCode !== 13) return;
    if (!txtMessage.value || txtMessage.value[0] == ' ') return;
    // Enviando mensaje por socket
    socket.emit('send-message', {
      message: txtMessage.value,
      author: user.uid
    });
    // Limpiando interfaz
    txtMessage.value = '';
  });
  // Evento de mensaje del servidor sobre la conexión
  socket.on('connection-status', message => {
    console.log('Imposible conectar: ', message);
  });
  // Evento de mensaje público recibido
  socket.on('chat-state', chat => {
    let rawHtml = '';
    chat.forEach(message => {
      rawHtml += `
        <li class="chat-bubble">
          <p class="message">${message.content}</p>
          <p class="timestamp">${new Date(message.timestamp).toUTCString()}</p>
          <div class="author">
            <p class="author--name">${message.author}</p>
          </div>
        </li>
      `;
    });
    ulChat.innerHTML = rawHtml;
  });
  // Evento para observar los usuarios conectados actualmente
  socket.on('connected-users', users => {
    // Modificando interfaz para mostrar usuarios conectados
    let rawHtml = '';
    users.forEach(singleUser => {
      rawHtml += `
        <li class="single-user">
          <img src="./assets/default.png"/>
          <div>
            <p class="display-name">${singleUser.displayName}</p>
            <p>${singleUser.email}</p>
          </div>
        </li>
      `;
    });
    ulOnlineUsers.innerHTML = rawHtml;
  });
}