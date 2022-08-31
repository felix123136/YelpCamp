const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

//Register Route
router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      req.login(newUser, function (err) {
        if (err) return next(err);
        req.flash("success", "Welcome to YelpCamp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

//Login Route
router.get("/login", (req, res) => {
  // console.log(req.session);
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome Back, ${req.body.username}`);
    const redirectUrl = req.session.url || "/campgrounds";
    delete req.session.url;
    res.redirect(redirectUrl);
  }
);

//Logout Router
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Successfully signed out");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
