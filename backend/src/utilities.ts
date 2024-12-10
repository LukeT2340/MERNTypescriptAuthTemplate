import mongoose, { Types } from "mongoose"
import User from "./models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const connectToMongoServer = () => {
  // MongoDB connection
  mongoose
    .connect(process.env.MONGO_URI || "", {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err))
}

export const nonSensitiveUser = (user: mongoose.Document) => {
  const { password, __v, ...userWithoutPassword } = user.toObject()
  return userWithoutPassword
}

export function encodeObjectToUrl(baseURL: string, params: Object) {
  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&")
  return `${baseURL}?${queryString}`
}

export const generateToken = (_id: Types.ObjectId): string => {
  if (!process.env.SECRET) {
    throw new Error("SECRET key is not defined in environment variables")
  }

  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" })
}

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10) // Hash password with salt rounds of 10
    return hashedPassword
  } catch (error) {
    throw new Error("Error hashing password")
  }
}
