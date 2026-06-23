import { userService } from '../services/userService.js';

export const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }
      const data = await userService.login(email, password);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(401).json({ success: false, message: err.message });
    }
  },

  async register(req, res) {
    const { name, email, password, role } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email and password are required' });
      }
      const data = await userService.register(name, email, password, role);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  getMe(req, res) {
    try {
      const user = userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  checkEmail(req, res) {
    const { email } = req.query;
    try {
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      const exists = userService.checkEmailExists(email);
      return res.status(200).json({ success: true, exists });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
