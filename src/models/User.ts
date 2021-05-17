import mongoose, {Schema, Document} from 'mongoose'
const bcrypt = require('bcrypt');

export interface IUser extends Document {
  _id: string,
  email: string,
  password: string,
  username: string,
  username_riot: string,
  birthdate: Date,
  tokens: [string]
}

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type : String, required: true },
  username_riot: { type: String, required: true },
  birthdate: Date,
  tokens: [String]
});

userSchema.pre<IUser>('save', async function(next: any) {

  if (this.isModified('email')) {
    const emailExists: boolean = await User.exists({ email: this.email })
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

const User = mongoose.model<IUser>('User', userSchema)

export default User