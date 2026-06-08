import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

class AuthService {
  /**
   * Register a new user.
   * @param {object} userData - { first_name, last_name, email, password, phone, role, document_id, address }
   * @returns {object} - { user, token }
   */
  async register(userData) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      const error = new Error('Ya existe una cuenta con este correo electrónico.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  /**
   * Authenticate a user.
   * @param {string} email
   * @param {string} password
   * @returns {object} - { user, token }
   */
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Credenciales incorrectas.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error('Cuenta desactivada. Contacte al administrador.');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Credenciales incorrectas.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  /**
   * Generate JWT token.
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * Get user profile by ID.
   */
  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user profile.
   */
  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    // Don't allow changing role or password through this method
    delete updateData.password;
    delete updateData.role;

    await user.update(updateData);

    const userResponse = user.toJSON();
    delete userResponse.password;
    return userResponse;
  }
}

export default new AuthService();
