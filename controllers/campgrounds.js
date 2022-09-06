const Campground = require("../models/campground");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoding = mbxGeocoding({
  accessToken: process.env.MAPBOX_TOKEN,
});

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.paginate(
    {},
    {
      page: req.query.page || 1,
      limit: 21,
      sort: "-_id",
    }
  );
  campgrounds.page = Number(campgrounds.page);
  let totalPages = campgrounds.totalPages;
  let currentPage = campgrounds.page;
  let startPage;
  let endPage;

  if (totalPages <= 10) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }
  res.render("campgrounds/index", {
    campgrounds,
    startPage,
    endPage,
    currentPage,
    totalPages,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  const geoData = await geocoding
    .forwardGeocode({
      query: campground.location,
      limit: 1,
    })
    .send();
  campground.geometry = geoData.body.features[0].geometry;
  await campground.save();
  req.flash("success", "Successfully created a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    res.render("campgrounds/show", { campground });
  } else {
    req.flash("error", "Cannot find campground");
    res.redirect("/campgrounds");
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  } else {
    req.flash("error", "Cannot find campground");
    res.redirect("/campgrounds");
  }
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground
  );
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (let img of req.body.deleteImages) {
      await cloudinary.uploader.destroy(img);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
