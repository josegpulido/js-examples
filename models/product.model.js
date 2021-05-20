// Importaciones de terceros
const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  photoUrl: {
    type: String
  },
  name: {
    type: String,
    required: [ true, 'El campo name es obligatorio' ]
  },
  description: {
    type: String,
    required: [ true, 'El campo description es obligatorio' ]
  },
  price: {
    type: Number,
    required: [ true, 'El campo price es obligatorio' ]
  },
  available: {
    type: Boolean,
    required: [ true, 'El campo available es obligatorio' ],
    dafult: true
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
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: [ true, 'El campo category es obligatorio' ]
  }
});

ProductSchema.methods.toJSON = function() {
  const { __v, _id, ...otherProperties } = this.toObject();
  otherProperties.id = _id;
  return otherProperties;
};

/**
 * Un índice de tipo $text permite ejecutar queries que
 * busquen coincidencias en cualquier campo del Schema
 * que haya sido indexado.
 * 
 * El wildcard $** permite indicarle a MongoDB que el
 * index se aplicará a cualquier campo de tipo String.
 */
ProductSchema.index({
  '$**': 'text'
});

module.exports = model('product', ProductSchema);