
// Middleware para validar si un usuario es ADMIN_ROLE
function isAdminRole(req, res, next) {
  const { user } = req.jwt;
  /**
   * Verificación interna para arrojar error en caso de que no
   * se haya adjuntado el usuario solicitante al objeto request.
   */
  if (!user) {
    return res.status(500).json({
      status: 500,
      error: 'El usuario solicitante no se encuentra disponible, error interno'
    });
  }
  if (user.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      status: 401,
      error: 'Se requiere ser ADMIN_ROLE para continuar con la petición'
    });
  }
  next();
}

/**
 * Middleware para validar si un usuario tiene al menos un rol
 * permitido de un conjunto pasado como parámetros.
 * 
 * Un middleware forzosamente requiere de una función que
 * reciba 3 parámetros (request, response, next), por lo que
 * la premisa es pasar una función con parámetros distintos
 * que retorne un middleware. De esta forma se pueden combinar
 * parámetros en caso de requerirlos.
 */
function isRole(...roles) {
  return (req, res, next) => {
    const { user } = req.jwt;
    /**
     * Verificación interna para arrojar error en caso de que no
     * se haya adjuntado el usuario solicitante al objeto request.
     */
    if (!user) {
      return res.status(500).json({
        status: 500,
        error: 'El usuario solicitante no se encuentra disponible, error interno'
      });
    }
    if (!roles.includes(user.role)) {
      return res.status(401).json({
        status: 401,
        error: `Se requiere ser ${roles.join(', ')} para continuar con la petición`
      });
    }
    next();
  };
}

module.exports = {
  isAdminRole,
  isRole
};