import { Router } from "express"
import passport from "passport"
import User from "../../../models/User"
import { nonSensitiveUser } from "../../../utilities"

const router = Router()

// Route to initiate Google login
router.get(
	"/login",
	passport.authenticate("google", { scope: ["profile", "email"] })
)

// Route to handle Google callback
router.get(
	"/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
	}),
	async (req, res) => {
		try {
			if (!req.user) {
				return res.status(401).json({ error: "Authentication failed" })
			}

			// Retrieve user from Passport
			const googleUser = req.user as any

			// Check if the user exists in the database
			let user = await User.findOne({ email: googleUser.email })
			if (!user) {
				// Create a new user if they don't exist
				user = await User.create({
					email: googleUser.email,
					name: googleUser.displayName,
					googleId: googleUser.id,
				})
			} else {
				await user.save()
			}

			// Attach user to session (already done by Passport)
			req.login(user, (err) => {
				if (err) {
					return res.status(500).json({ error: "Login failed" })
				}

				const filteredUser = nonSensitiveUser(user)

				res.redirect(
					`${process.env.FRONTEND_URL}/callback?user=${encodeURIComponent(
						JSON.stringify(filteredUser)
					)}`
				)
			})
		} catch (err) {
			console.error("Error handling callback:", err)
			res.status(500).json({ error: "Internal server error", details: err })
		}
	}
)

// Route to handle logout
router.post("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ error: "Logout failed" })
		}
		res.json({ message: "Logged out successfully" })
	})
})

export default router
