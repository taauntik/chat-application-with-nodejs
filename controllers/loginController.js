// external imports
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/People");

// get login page
function getLogin(req, res, next) {
  res.render("index");
}

// do login
async function login(req, res, next) {
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    // destructure the user
    const { name, mobile, email } = user;

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          username: name,
          mobile,
          email,
          role: "user",
        };

        // generate the token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        // set loggedin user local identifier
        res.locals.loggedInUser = userObject;

        res.render("inbox");
      } else {
        throw createError("Login failed! please try again.");
      }
    } else {
      throw createError("Login failed! please try again.");
    }
  } catch (error) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

// do logout
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logged out!");
}

module.exports = {
  getLogin,
  login,
  logout,
};
