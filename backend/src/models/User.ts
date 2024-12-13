import mongoose, { Schema } from "mongoose"
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  googleId: { type: String },
  verified: {
    type: Boolean,
    default: false,
  },
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  passwordField: "password",
  limitAttempts: true,
  maxAttempts: 5,
  errorMessages: {
    UserExistsError: "A user with this email already exists",
    IncorrectPasswordError: "Incorrect email or password",
    IncorrectUsernameError: "Incorrect email or password",
    MissingPasswordError: "No password was given",
    AttemptTooSoonError: "Account is currently locked. Try again later",
    TooManyAttemptsError:
      "Account locked due to too many failed login attempts",
  },
})

export default mongoose.model("User", userSchema)
