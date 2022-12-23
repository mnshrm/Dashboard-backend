const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email id"],
    unique: true,
    validate: [validator.isEmail, "Enter valid email id"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be atleast 8 characters long"],
    select: false,
  },
});

/**
 * Checks if user entered password and password in database is correct or not
 * @param {String} givenPassword
 * @returns True if passoword matches and false otherwise
 */
userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

// JWT TOKEN
userSchema.methods.getJwtToken = function () {
  // This method generates json web token
  // Token is returned to user after user log's in using his/her credentials.

  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: +process.env.JWT_EXPIRE * 24 * 60 * 60,
  });
};

/**
 * To hash user's password
 * Program uses pre method to add a pre hook that executes for a particular event
 * here, event is when a documnent is saved i.e., when save hook is called.
 */
userSchema.pre("save", async function (next) {
  // Check if password is actually modified or not
  if (!this.isModified("password")) {
    // If not, no need to hash already hashed password
    // Call next middleware to exit the hook
    next();
  }

  // If password is modified then hash it, and save it.
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
