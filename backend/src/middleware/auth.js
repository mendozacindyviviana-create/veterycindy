import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

/**
 * Verifies JWT token from Authorization header.
 * Attaches the user object to req.user on success.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o desactivado.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado.' });
    }
    return res.status(401).json({ success: false, message: 'Token inválido.' });
  }
};

/**
 * Restricts access to specific roles.
 * Must be used after authenticate middleware.
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autenticado.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}.`,
      });
    }

    next();
  };
};
