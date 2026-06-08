/**
 * Global error handling middleware.
 * Catches all errors passed via next(err) and returns a consistent JSON response.
 */
export const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación.',
      errors: messages,
    });
  }

  // Express-validator errors
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación.',
      errors: err.array(),
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor.',
  });
};
