process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Remove this line in production

import express from "express"
import session from "express-session"
import passport from "passport"
import "./strategies"
import cookieParser from "cookie-parser"
import "dotenv/config"
import cors from "cors"
import { connectToMongoServer } from "./utilities"
import api from "./api"
import User from "./models/User"

const port = process.env.PORT || 3001

connectToMongoServer()
// startupEmailService()

const app = express()

app.use(express.json())
app.use(cookieParser())

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 3600000, // 1 hour
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user._id.toString())
  done(null, user._id.toString())
})

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id)
  try {
    const user = await User.findById(id)
    if (!user) {
      console.log("User not found during deserialization")
      return done(null, false)
    }
    console.log("User found during deserialization:", user)
    done(null, user)
  } catch (error) {
    console.error("Error during deserialization:", error)
    done(error)
  }
})

// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use("/api", api)
app.listen(port, () => {
  return console.log(`Express is listening on ${port}`)
})
