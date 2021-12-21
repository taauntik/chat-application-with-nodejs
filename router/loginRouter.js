// external imports
const express = require("express");

// internal imports
const { getLogin, login, logout } = require("../controllers/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValdationHandler,
} = require("../middlewares/login/loginValidators");
const { redirectLoggedIn } = require("../middlewares/common/checkLogin");

const router = express.Router();

// set page title
const pageTitle = "Login";

// login page
router.get("/", decorateHtmlResponse(pageTitle), redirectLoggedIn, getLogin);

// process login
router.post(
  "/",
  decorateHtmlResponse(pageTitle),
  doLoginValidators,
  doLoginValdationHandler,
  login
);

router.delete("/", logout);

module.exports = router;
