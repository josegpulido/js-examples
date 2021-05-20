// Importaciones de terceros
require('dotenv').config();
const mongoose = require('mongoose');

const initDatabaseConnection = async () => {
  try {
    // Conectando Mongoose con base de datos MongoDB
    await mongoose.connect(process.env.MONGODB_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('Conexión a MongoDB Atlas exitosa');
  } catch (err) {
    console.error(err);
    throw new Error('Error al intentar conectar Mongoose con MongoDB Atlas a través del url de conexión');
  }
}

module.exports = {
  initDatabaseConnection
};