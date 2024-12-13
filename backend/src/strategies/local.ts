import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import User from "../models/User"
import bcrypt from "bcryptjs"

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email })

				if (!user) {
					return done(null, false, { message: "Incorrect email or password." })
				}

				const isMatch = await bcrypt.compare(password, user.password || "")
				if (!isMatch) {
					return done(null, false, { message: "Incorrect email or password." })
				}

				// User authenticated successfully
				return done(null, user)
			} catch (error) {
				return done(error)
			}
		}
	)
)

passport.serializeUser((user, done) => {
	done(null, (user as any)._id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		if (!user) {
			return done(new Error("User not found"))
		}
		done(null, user)
	} catch (error) {
		done(error)
	}
})
