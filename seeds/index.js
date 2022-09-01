const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
  console.log("Database Connected");
}

main().catch((e) => {
  console.log(e);
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 5; ++i) {
    const randCity = sample(cities);
    const price = Math.floor(Math.random() * 30) + 1;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${randCity.city}, ${randCity.state}`,
      image: "http://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque blanditiis iste quaerat dolores omnis, eos quo, nostrum reprehenderit quis quas beatae adipisci assumenda eius eveniet maiores asperiores, suscipit labore fuga.",
      price,
      author: "630f5f9d7bc5621beb583731",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
