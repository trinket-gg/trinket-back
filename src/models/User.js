const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type : String, required: true },
  username_riot: { type: String, required: true },
  birthdate: Date
});

module.exports = mongoose.model('users', userSchema)