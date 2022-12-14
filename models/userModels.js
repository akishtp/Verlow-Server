const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// static signup method
userSchema.statics.signup = async function (name, password, email) {
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const nameExists = await this.findOne({ name });
  if (nameExists) {
    throw Error("Name already in use");
  }
  const emailExist = await this.findOne({ email });
  if (emailExist) {
    throw Error("Email already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, password: hash, email });

  return user;
};

userSchema.statics.login = async function (name, password) {
  if (!name || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ name });
  if (!user) {
    throw Error("User does not exist");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

userSchema.statics.updatehim = async function (req) {
  const user_id = req.user._id;
  const user = await this.findById(user_id);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  const updatedUser = await user.save();
  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  };
};

module.exports = mongoose.model("User", userSchema);
