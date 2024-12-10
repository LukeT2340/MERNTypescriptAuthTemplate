import mongoose, { mongo, Schema } from "mongoose"

const userSchema = new Schema({
  email: {
    type: String,
  },
  googleId: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model("User", userSchema)
