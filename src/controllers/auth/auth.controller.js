const AuthService = require("../../services/auth/auth.service");

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login({ username, password });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
