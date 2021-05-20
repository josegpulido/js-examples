// Importaciones de terceros
const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
  name: {
    type: String,
    required: [ true, 'El campo name es obligatorio' ]
  },
  /**
   * 'author' es un campo que refiere a n documento de la
   * colección users. Esto para hacer .populate() y poder
   * obtener la información del usuario de forma dinámica
   * y actualizada.
   */
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [ true, 'El campo author es obligatorio' ]
  }
});

CategorySchema.methods.toJSON = function() {
  const { __v, _id, ...otherProperties } = this.toObject();
  return otherProperties;
};

module.exports = model('category', CategorySchema);