const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");

const { Schema, model } = mongoose;
const Review = require("./review");

const imageSchema = new Schema({ url: String, filename: String });

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_200");
});

const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async (campground) => {
  if (campground.reviews.length)
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  if (campground.images && campground.images.length) {
    for (let img of campground.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = model("Campground", campgroundSchema);
