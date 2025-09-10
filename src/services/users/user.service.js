const bcrypt = require("bcryptjs");
const UserRepository = require("../../repositories/users/user.repository");
const ApiError = require("../../utils/apiError");

class UserService {
  async createUser({ username, email, password, role }) {
    const existingEmail = await UserRepository.findByEmail(email);
    const existingUsername = await UserRepository.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(400, "Username already exists");
    }
    if (existingEmail) {
      throw new ApiError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    };

    return await UserRepository.createUser(newUser);
  }

  async getUsers() {
    return await UserRepository.findAll();
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async updateUser(id, { username, email, password, role }) {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const success = await UserRepository.updateUser(id, updateData);
    if (!success) throw new ApiError(400, "Failed to update user");

    return { id, ...updateData };
  }

  async deleteUser(id) {
    if (id == 1){
      throw new ApiError(403, "Cannot delete the admin user");
    }
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const success = await UserRepository.deleteUser(id);
    if (!success) throw new ApiError(400, "Failed to delete user");

    return true;
  }
}

module.exports = new UserService();
