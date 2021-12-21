// external imports
const express = require("express");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators");

// internal imports
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controllers/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");

const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// Users page
router.get("/", decorateHtmlResponse("Users"), checkLogin, getUsers);

// add user
router.post(
  "/",
  checkLogin,
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// delete user
router.delete("/:id", removeUser);

module.exports = router;
