import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/User"
import "dotenv/config"
import { Strategy as LocalStrategy } from "passport-local"
import bcrypt from "bcryptjs"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.REDIRECT_URI}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { emails, displayName } = profile
        const email = emails && emails[0]?.value

        if (!email) {
          return done(new Error("No email found in Google profile"), false)
        }

        let user = await User.findOne({ email })
        if (!user) {
          user = await User.create({
            email,
            name: displayName,
            googleId: profile.id,
          })
        }

        done(null, user)
      } catch (err) {
        done(err, undefined)
      }
    }
  )
)

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      console.log("firing")
      try {
        const user = await User.findOne({ email })

        if (!user) {
          console.log("User not found for email:", email)
          return done(null, false, { message: "Incorrect email or password." })
        }

        const isMatch =
          user.password && (await bcrypt.compare(password, user.password))
        if (!isMatch) {
          console.log("Password mismatch for user:", email)
          return done(null, false, { message: "Incorrect email or password." })
        }

        console.log("Login successful for:", email)
        return done(null, user)
      } catch (error) {
        console.error("Authentication error:", error)
        return done(null, false, {
          message: "An error occurred. Please try again.",
        })
      }
    }
  )
)
