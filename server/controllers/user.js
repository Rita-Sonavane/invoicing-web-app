const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const SECRET = process.env.SECRET;

const User = require("../models/userModel.js");
const ProfileModel = require("../models/ProfileModel.js");

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    const userProfile = await ProfileModel.findOne({
      userId: existingUser?._id,
    });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, userProfile, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signup = async (req, res) => {
  const { email, password, confirmpassword, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const userProfile = await ProfileModel.findOne({
      userId: existingUser?._id,
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    if (password !== confirmpassword)
      return res.status(400).json({ message: "Password don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
      confirmpassword: hashedPassword,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ result, userProfile, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmpassword } = req.body;
  console.log("check", confirmpassword);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signin, signup, resetPassword };
