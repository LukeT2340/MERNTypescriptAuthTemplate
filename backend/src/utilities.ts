import mongoose, { Types } from "mongoose"
import jwt from "jsonwebtoken"

export const connectToMongoServer = () => {
  // MongoDB connection
  mongoose
    .connect(process.env.MONGO_URI || "", {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err))
}

export const nonSensitiveUser = (user: any) => {
  return user
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
