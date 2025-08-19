const AuthService = require("../services/auth.service");

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
