// Importaciones de terceros
require('dotenv').config();
// Importaciones propias
const Server = require('./models/server.model');

// Arrancando servidor de Express
const server = new Server();
server.start();
