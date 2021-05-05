const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type : String, required: true },
  username_riot: { type: String, required: true },
  birthdate: Date
})

userSchema.pre('save', async function(next) {

  if (this.isModified('email')) {
    const emailExists = await User.exists({ email: this.email })
    if (emailExists) return next(new Error('Email already exists !'))
  }

  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (error) {
    return next(error)
  }

})

const User = mongoose.model('users', userSchema)

module.exports = User