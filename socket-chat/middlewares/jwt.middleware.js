// Importaciones de terceros
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Importaciones propias
const users = require('../db/data.json');
const { validUserByUid } = require('../helpers/utils');

// Promesa para generar un JWT
function generateToken(payload) {
  /**
   * Este JWT simplemente guardará el identificador
   * de usuario, o uid.
   */
  return new Promise((resolve, reject) => {
    /**
     * sign() pide un 'secreto' para generar tokens.
     * Quien conozca o tenga en su poder el secreto
     * del generador, podrá generar tokens firmados que serán
     * totalmente auténticos.
     */
    jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h', // Este JWT tendrá que renovarse cada hora
      algorithm: 'HS256' // El algoritmo por defecto es el HS256, pero puede escogerse entre varios
    }, (err, token) => {
      // Retornando error en caso de haberlo
      if (err) {
        return reject(err);
      }
      // Retornando JWT
      return resolve(token);
    });
  });
}

// Middleware para validar la autenticidad de un token (JWT)
async function verifyToken(req, res, next) {
  /**
   * Desestructurando el JWT, el cual de debería ubicarse
   * dentro de los headers del objeto request.
   */
  const token = req.header('my-jwt');
  // Validando que el token exista dentro de los headers
  if (!token || token == '') {
    return res.status(401).json({
      status: 401,
      error: 'Se requiere de autenticación en la petición, falta cabecera \'my-jwt\''
    });
  }
  // Valindando autenticidad del token
  try {
    // Verificando el token y recuperando el payload en caso de pasar validación
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Recuperando usuario de la BD
    const index = validUserByUid(payload.uid);
    const user = users[index];
    // Almacenando el token y el usuario solicitante en objeto request para usarlo posteriormente
    delete user.password;
    req.jwt = {
      payload: payload,
      user: user
    };
    // Pasando a siguiente middleware
    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      error: 'Token de autenticación no válido'
    });
  }
}

// Middleware para renovar un token
async function renewToken(req, res, next) {
  // Generando nuevo JWT
  const newToken = await generateToken({
    uid: req.jwt.payload.uid
  });
  // Retornando nuevo token
  res.status(200).json({
    status: 200,
    token: newToken,
    user: req.jwt.user
  });
}

module.exports = {
  generateToken,
  verifyToken,
  renewToken
};