const express = require("express");
const UserController = require("../controllers/user.controller");
const AuthController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Auth
router.post("/login", AuthController.login);

// User routes
router.post("/users",auth, UserController.createUser);
router.get("/users",auth, UserController.getUsers);
router.get("/users/:id",auth, UserController.getUserById);
router.put("/users/:id", auth,UserController.updateUser);
router.delete("/users/:id",auth, UserController.deleteUser);
// End User routes


module.exports = router;
