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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 3600000, // 1 hour
      sameSite: "lax", // Add this line
    },
    // Add these lines for additional session tracking
    name: "sessionId", // Explicitly name the session cookie
    rolling: true, // Reset cookie expiration on every request
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Modify your serializeUser and deserializeUser
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user._id.toString())
  done(null, user._id.toString())
})

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log("Attempting to deserialize user with ID:", id)
    const user = await User.findById(id)

    if (!user) {
      console.log("No user found during deserialization for ID:", id)
      return done(null, false)
    }

    console.log("Successfully deserialized user:", user._id)
    return done(null, user)
  } catch (error) {
    console.error("Deserialization error:", error)
    return done(error)
  }
})

// Add this middleware to help debug session issues
app.use((req: any, res: any, next) => {
  console.log("Session middleware debug:", {
    sessionID: req.sessionID,
    sessionUser: req.session?.passport?.user,
    reqUser: req.user,
    isAuthenticated: req.isAuthenticated(),
  })
  next()
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
