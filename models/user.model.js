// Importaciones de terceros
const { Schema, model } = require('mongoose');

/**
 * Un Schema le indica a Mongoose como es que
 * tiene que solicitar y estructurar la información
 * de una entidad en específico.
 */
const UserSchema = Schema({
  displayName: {
    type: String,
    /**
     * Si no se desea personalizar el mensaje de error
     * cuando este campo no haya sido provisto, entonces
     * solo dejar la propiedad así:
     * ...
     * required: true
     * ...
     */
    required: [ true, 'El campo name es obligatorio' ]
  },
  email: {
    type: String,
    required: [ true, 'El campo email es obligatorio' ],
    /**
     * Indicandole a Mongo que no pueden existir dos documentos
     * del tipo User con el mismo correo electrónico.
     */
    unique: true
  },
  password: {
    type: String,
    required: [ true, 'El campo password es obligatorio' ]
  },
  photoUrl: {
    type: String
  },
  role: {
    type: String,
    required: [ true, 'El campo role es obligatorio' ],
    /**
     * Estableciendo una enumeración para este campo con la
     * propiedad enum, que indica a Mongo que los únicos dos
     * valores admitidos son los especificados dentro de sus
     * llaves.
     */
    enum: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    default: 'USER_ROLE'
  },
  /**
   * La siguiente propiedad tiene por propósito indicar si un
   * usuario está deshabilitado o no. Al crear un nuevo usuario,
   * esta propiedad por defecto estará en false, ya que no tendría
   * sentido crear usuarios deshabilitados.
   */
  disabled: {
    type: Boolean,
    default: false
  },
  signedWithGoogle: {
    type: Boolean,
    default: false
  }
});

/**
 * Sobreescribiendo el método toJSON() proporcionado
 * por el Schema. Esta sobreescritura en realidad es
 * una mala característica de Javascript, pero aquí
 * se está haciendo uso de ella. El propósito de esta
 * sobreescritura es eliminar la propiedad password y
 * __v para retornar http-response más limpio.
 * 
 * Se utiliza una function y no una arrow-function porque
 * se usará la palabra this y esta tiene un clousure distinto
 * entre ambos escenarios; this apunta al contexto en una
 * arrow-function y this apunta a la instancia superior
 * en una function común.
 */
UserSchema.methods.toJSON = function() {
  /**
   * Utilizando el método toObject() provisto por el Schema
   * mismo que retorna un objeto literal con las propiedades
   * del Schema mismo. Con la desestructuración spread, se engloba
   * el resto de propiedades y así se logra retirar password y __v
   * del objeto literal.
   */
  const { __v, password, _id, ...otherProperties } = this.toObject();
  // Renombrando _id por uid
  otherProperties.uid = _id;
  return otherProperties;
};

/**
 * Exportando el 'tipado' que tendrá que tener
 * cada nueva creación de un documento dentro de
 * la colección 'users'. El nombre de dicho modelo
 * se debe colocar en singular, ya que Mongoose
 * coloca la letra 's' al final de cada nombre.
 */
module.exports = model('user', UserSchema);