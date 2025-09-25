const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../../repositories/users/user.repository");
const AuthException = require("../exceptions/auth.exception");

class AuthService {
  async login({ username, password }) {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new AuthException("error.msg.Invalid username or password");

    if (user.is_delete === 1) throw new AuthException("error.msg.Invalid username or password");
    if (user.is_lock === 1) throw new AuthException("error.msg.Account is locked due to multiple failed logins, please contact to support center");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await UserRepository.incrementFailedAttempts(user.id);

      // If failed_attempts >= 3 → lock account
      if ((user.failed_attempts + 1) >= 3) {
        await UserRepository.lockUser(user.id);
        throw new AuthException("error.msg.Account locked after 3 failed login attempts");
      }

      throw new AuthException("error.msg.Invalid email or password");
    }

    // Reset failed attempts after successful login
    await UserRepository.resetFailedAttempts(user.id);

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}

module.exports = new AuthService();
