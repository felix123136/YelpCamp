const express = require("express");
const reviews = require("../controllers/reviews");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });

//Add Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

//Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
