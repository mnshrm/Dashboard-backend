const express = require("express");
const {
  registerUser,
  userLogin,
  logOutUser,
  isAuthenticated,
} = require("../Controllers/userControllers");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/logout").post(logOutUser);
router.route("/isAuthenticated").post(isAuthenticated);

module.exports = router;
