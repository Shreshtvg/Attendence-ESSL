import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

export const userService = {
  async login(email, password) {
    const user = userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Password incorrect');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  },

  async register(name, email, password, role = 'Supervisor') {
    const existing = userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    return userRepository.create({
      name,
      email,
      password: hashedPassword,
      role
    });
  },

  getUserById(id) {
    return userRepository.findById(id);
  },

  checkEmailExists(email) {
    const user = userRepository.findByEmail(email);
    return !!user;
  }
};
