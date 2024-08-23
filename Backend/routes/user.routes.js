const express = require("express");
const router = express.Router();
userController = require("../controllers/user.controller");
auth = require("../middlewares/auth");

router.get("/getAllUsers", userController.getUsers);
router.get("/auth-status", auth, userController.verifyUser);
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
