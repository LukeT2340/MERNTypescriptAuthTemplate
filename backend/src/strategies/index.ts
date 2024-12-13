import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/User"
import "dotenv/config"

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
            verified: true,
          })
        }

        done(null, user)
      } catch (err) {
        done(err, undefined)
      }
    }
  )
)

// In your strategies file
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
