process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Remove this line in production

import express from "express"
import session from "express-session"
import passport from "passport"
import "./strategies/google"
import "./strategies/local"
import cookieParser from "cookie-parser"
import "dotenv/config"
import cors from "cors"
import { connectToMongoServer } from "./utilities"
import api from "./api"

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
			secure: false, // Set to true in production when using HTTPS
			maxAge: 3600000, // 1 hour in milliseconds
		},
	})
)

app.use(passport.initialize())
app.use(passport.session())

// Enable CORS for all routes
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
)

app.use("/api", api)
app.listen(port, () => {
	return console.log(`Express is listening on ${port}`)
})
