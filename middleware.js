const { campgroundSchema } = require("./schemas");
module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be signed in first");
  req.session.url = req.originalUrl;
  res.redirect("/login");
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else next();
};
