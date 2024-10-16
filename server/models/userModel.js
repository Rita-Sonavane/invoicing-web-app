const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmpassword: { type: String, required: true },
  resetToken: String,
  expireToken: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
