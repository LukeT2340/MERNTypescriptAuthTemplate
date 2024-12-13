import mongoose, { Types } from "mongoose"
import User from "./models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

export const connectToMongoServer = () => {
  // MongoDB connection
  mongoose
    .connect(process.env.MONGO_URI || "", {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err))
}

export const nonSensitiveUser = (user: any) => {
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

export const validPassword = (password: string): boolean => {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
  return pattern.test(password)
}

export const validEmail = (email: string): boolean => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

export const startupEmailService = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VERIFICATION_EMAIL,
      pass: process.env.VERIFICATION_EMAIL_PASSWORD,
    },
  })

  transporter.verify(function (error, success) {
    if (error) {
      console.log("Email configuration error:", error)
    } else {
      console.log("Email configuration is correct:", success)
    }
  })
}
