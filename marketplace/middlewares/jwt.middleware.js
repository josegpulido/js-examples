// Importaciones de terceros
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
// Importaciones propias
const User = require('../models/user.model');

// Inicializaciones
const client = new OAuth2Client(process.env.GOOGLE_JWT_CLIENT_ID);

// Promesa para generar un JWT a partir de un correo y contraseña
function generateToken(uid, email) {
  /**
   * Este JWT simplemente guardará el identificador
   * de usuario, o uid.
   */
  return new Promise((resolve, reject) => {
    // Generando payload a hashear
    const payload = {
      uid: uid,
      email: email
    };
    /**
     * sign() pide un 'secreto' para generar tokens.
     * Quien conozca o tenga en su poder el secreto
     * del generador, podrá generar tokens firmados que serán
     * totalmente auténticos.
     */
    jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '4h', // Este JWT tendrá que renovarse cada 4 horas
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

// Método para validar la autenticidad de un token (JWT)
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
    /**
     * Obteniendo el documento del usuario solicitante. Solo se valdrá como 
     * válido aquellos tokens que pertenezcan a usuarios existentes y habilitados.
     */
    const user = await User.findOne({
      _id: payload.uid,
      disabled: false
    });
    // Almacenando el token y el usuario solicitante en objeto request para usarlo posteriormente
    req.jwt = {
      payload: payload,
      user: user.toJSON()
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

// Método para validar la autenticidad de un token (JWT) de Google Sign In
function verifyGoogleToken(retrieveFromMongo = true) {
  return async (req, res, next) => {
    /**
     * Desestructurando el JWT, el cual de debería ubicarse
     * dentro de los headers del objeto request.
     */
    const token = req.header('google-token');
    // Validando que el token exista dentro de los headers
    if (!token || token == '') {
      return res.status(401).json({
        status: 401,
        error: 'Se requiere de autenticación en la petición'
      });
    }
    // Valindando autenticidad del token de Google
    try {
      // Verificando el token y recuperando el payload en caso de pasar validación
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_JWT_CLIENT_ID
      });
      const payload = ticket.getPayload();
      // Almacenando el token en objeto request para usarlo posteriormente
      req.jwt = {};
      req.jwt.payload = {
        uid: payload.sub,
        email: payload.email,
        displayName: `${payload.given_name} ${payload.family_name}`,
        photoUrl: payload.picture,
        iat: payload.iat,
        exp: payload.exp
      };
      // Validando si se requiere también obtener el documento de usuario de la DB o solo verificar el token
      if (retrieveFromMongo) {
        /**
         * Obteniendo el documento del usuario solicitante. Solo se valdrá como 
         * válido aquellos tokens que pertenezcan a usuarios existentes y habilitados.
         */
        const user = await User.findOne({
          _id: payload.sub,
          disabled: false
        });
        // Almacenando el usuario solicitante en objeto request para usarlo posteriormente
        req.jwt.user = user.toJSON();
      }
      // Pasando a siguiente middleware
      next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        error: 'Token de autenticación de Google no válido'
      });
    }
  };
};

module.exports = {
  generateToken,
  verifyToken,
  verifyGoogleToken
};