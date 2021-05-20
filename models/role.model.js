// Importaciones de terceros
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
  role: {
    type: String,
    required: [ true, 'El campo role es obligatorio' ]
  }
});

module.exports = model('role', RoleSchema);