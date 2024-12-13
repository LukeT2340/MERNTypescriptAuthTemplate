import { Router } from "express"
import passport from "passport"
import User from "../../../models/User"
import {
	validEmail,
	validPassword,
	hashPassword,
	nonSensitiveUser,
} from "../../../utilities"

const router = Router()

// Email availability check
router.post("/check-email", async (req, res): Promise<any> => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })
		if (user) {
			return res
				.status(400)
				.json({ message: "Someone has already registered with this email" })
		}

		return res.status(200).json({ message: "This email is available" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			message:
				"An error occurred whilst checking this email's availability. Please try again.",
		})
	}
})

// Sign up a new user
router.post("/sign-up", async (req, res): Promise<any> => {
	const { email, password } = req.body

	if (!validEmail(email)) {
		return res.status(400).json({ message: "Email not valid." })
	}

	if (!validPassword(password)) {
		return res.status(400).json({
			message:
				"Password must be a minimum of eight characters, containing at least one uppercase letter, one lowercase letter, and one number.",
		})
	}

	try {
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use." })
		}

		const hashedPassword = await hashPassword(password)
		const newUser = await User.create({ email, password: hashedPassword })

		req.login(newUser, (err) => {
			if (err) {
				console.error("Login error:", err)
				return res.status(500).json({ message: "Login failed after signup." })
			}

			const nonSensitiveUserData = nonSensitiveUser(newUser)
			return res.status(201).json({
				message: "Sign-up successful!",
				user: nonSensitiveUserData,
			})
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			message: "An error occurred while signing up. Please try again.",
		})
	}
})

// Log in an existing user
router.post("/login", (req, res, next) => {
	passport.authenticate(
		"local",
		(
			err: Error | null, // Error object for unexpected errors
			user: InstanceType<typeof User> | false, // User object or false if authentication fails
			info: { message: string } | undefined // Info object containing messages like "Incorrect password"
		) => {
			if (err) {
				return res
					.status(500)
					.json({ message: "An error occurred.", error: err })
			}

			if (!user) {
				return res
					.status(401)
					.json({ message: info?.message || "Unauthorized" })
			}

			req.login(user, (loginErr) => {
				if (loginErr) {
					return res
						.status(500)
						.json({ message: "Login failed.", error: loginErr })
				}

				const nonSensitiveUserData = nonSensitiveUser(user)
				return res.status(200).json({
					message: "Login successful!",
					user: nonSensitiveUserData,
				})
			})
		}
	)(req, res, next)
})

// Log out
router.post("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ error: "Logout failed" })
		}
		res.status(200).json({ message: "Logged out successfully" })
	})
})

export default router
