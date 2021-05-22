const users = require('../db/data.json');

// Método para buscar el correo y contraseña en el arreglo de usuarios ficticios
function validUserByEmailAndPassword(_email, _password) {
  let index;
  for (let i = 0; i < users.length; i++) {
    const { email, password } = users[i];
    if (_email === email && _password === password) {
      index = i;
      break;
    }
  }
  return index;
}
function validUserByUid(_uid) {
  let index;
  for (let i = 0; i < users.length; i++) {
    const { uid } = users[i];
    if (_uid === uid) {
      index = i;
      break;
    }
  }
  return index;
}

module.exports = {
  validUserByEmailAndPassword,
  validUserByUid
};