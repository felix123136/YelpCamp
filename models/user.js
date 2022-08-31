const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = model("User", userSchema);
