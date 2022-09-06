const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const dbUrl =
  "mongodb+srv://7427466391:WVYjtTMv2kW74cX@cluster0.5nq95vi.mongodb.net/?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database Connected");
}

main().catch((e) => {
  console.log(e);
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 500; ++i) {
    const randCity = sample(cities);
    const price = Math.floor(Math.random() * 30) + 1;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${randCity.city}, ${randCity.state}`,
      images: [
        {
          url: "https://res.cloudinary.com/dgtch1ffs/image/upload/v1662203246/YelpCamp/yqgy8pphgmqskjvwrmhv.webp",
          filename: "YelpCamp/vumbvrwgipmrurpjqhd8",
        },
        {
          url: "https://res.cloudinary.com/dgtch1ffs/image/upload/v1662203245/YelpCamp/f148hsfzxmap9gjd6ijw.jpg",
          filename: "YelpCamp/tgl25zhvgipiq1mutczd",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [randCity.longitude, randCity.latitude],
      },
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque blanditiis iste quaerat dolores omnis, eos quo, nostrum reprehenderit quis quas beatae adipisci assumenda eius eveniet maiores asperiores, suscipit labore fuga.",
      price,
      author: "6316f4a741f5f89a73918f8a",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
