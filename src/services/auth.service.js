const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/apiError");

class AuthService {
  async login({ username, password }) {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new ApiError(401, "Invalid username or password");

    if (user.is_delete === 1) throw new ApiError(403, "Invalid username or password");
    if (user.is_lock === 1) throw new ApiError(403, "Account is locked due to multiple failed logins, please contact support");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await UserRepository.incrementFailedAttempts(user.id);

      // If failed_attempts >= 3 → lock account
      if ((user.failed_attempts + 1) >= 3) {
        await UserRepository.lockUser(user.id);
        throw new ApiError(403, "Account locked after 3 failed login attempts");
      }

      throw new ApiError(401, "Invalid email or password");
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
