// Importaciones propias
const Role = require('../models/role.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

/**
 * Con el propósito de centralizar la lista de roles existentes
 * en la aplicación y no tener que suspender el servicio mientras ocurre
 * un deployment, entonces en lugar de hardcodear los roles disponibles:
 * 
 * check('role', 'Campo role inválido').isIn([ 'ADMIN_ROLE', 'USER_ROLE' ])
 * 
 * Estos se comparan contra lo existente en la colección roles de MongoDB,
 * para lo que se utiliza el middleware custom() de express-validator.
 */
async function checkIfRoleExists(role = '') {
  const roleExists = await Role.findOne({
    role: role
  });
  if (!roleExists) {
    // La siguiente sintaxis es la forma en que express-validator cacha el error
    throw new Error(`El rol ${role} no es un rol permitido`);
  }
}

// Verificar si una categoría existe en MongoDB
async function checkIfCategoryExists(category = '') {
  const categoryExists = await Category.findOne({
    name: category
  });
  if (!categoryExists) {
    // La siguiente sintaxis es la forma en que express-validator cacha el error
    throw new Error(`La categoría ${category} no es una categoría permitida`);
  }
}

// Verificar si la dirección de correo electrónico no existe en MongoDB
async function checkIfEmailNotExists(email = '') {
  const emailAlreadyExists = await User.findOne({
    email: email
  });
  if (emailAlreadyExists) {
    throw new Error(`La dirección ${email} ya existe`);
  }
}

// Verificar que el id de usuario pertenece a un usuario existente en la BD
async function checkIfUserIdExists(id = '') {
  const userExists = await User.findOne({
    _id: id
  });
  if (!userExists) {
    throw new Error(`El id de usuario \'${id}\' no existe en la base de datos`);
  }
}

// Verificar que el id de un producto existe en la base de datos
async function checkIfProductIdExists(id = '') {
  const productExists = await Product.findOne({
    _id: id
  });
  if (!productExists) {
    throw new Error(`El id de producto \'${id}\' no existe en la base de datos`);
  }
}

module.exports = {
  checkIfRoleExists,
  checkIfCategoryExists,
  checkIfEmailNotExists,
  checkIfUserIdExists,
  checkIfProductIdExists
};