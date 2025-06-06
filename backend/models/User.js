const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetCode: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
