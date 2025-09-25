const UserService = require("../../services/users/user.service");

class UserController {
  async createUser(req, res, next) {
    try {
      const { username, email, password, role } = req.body;
      const user = await UserService.createUser({ username, email, password, role });
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, password, role } = req.body;
      const updatedUser = await UserService.updateUser(id, { username, email, password, role });
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
