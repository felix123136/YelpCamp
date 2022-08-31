const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");
const review = require("../models/review");
const { default: mongoose } = require("mongoose");
const { isLoggedIn, validateCampground } = require("../middleware");

const router = express.Router();

//Show All Campgrounds
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Create Campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Show Campground
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const campground = await Campground.findById(id).populate("reviews");
      res.render("campgrounds/show", { campground });
    } else {
      req.flash("error", "Cannot find campground");
      res.redirect("/campgrounds");
    }
  })
);

//Edit Campground
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const campground = await Campground.findById(id);
      res.render("campgrounds/edit", { campground });
    } else {
      req.flash("error", "Cannot find campground");
      res.redirect("/campgrounds");
    }
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);
  })
);

//Delete Campground
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
