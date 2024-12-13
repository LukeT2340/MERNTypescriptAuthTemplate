import { Router } from "express"
import passport from "passport"
import User from "../../../models/User"

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

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      // Authentication failed
      return res.status(401).json({
        message: info.message || "Login failed",
      })
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr)
      }

      // Remove sensitive information
      const userResponse = {
        _id: user._id,
        email: user.email,
        verified: user.verified,
      }

      return res.status(200).json({
        message: "Login successful",
        user: userResponse,
      })
    })
  })(req, res, next)
})

// Registration route
router.post("/sign-up", async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body

    // Create user with passport-local-mongoose method
    const user = new User({ email })

    const registeredUser = await User.register(user, password)

    // Authenticate and log in the newly registered user
    req.login(registeredUser, (loginErr: any) => {
      if (loginErr) {
        return next(loginErr) // Handle login errors
      }

      // Remove sensitive information
      const userResponse = {
        _id: registeredUser._id,
        email: registeredUser.email,
      }

      return res.status(201).json({
        message: "Registration and login successful",
        user: userResponse,
      })
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "UserExistsError") {
      return res.status(400).json({
        message: "A user with this email already exists",
      })
    }

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    })
  }
})

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" })
    }
    res.status(200).json({ message: "Logout successful" })
  })
})

export default router
