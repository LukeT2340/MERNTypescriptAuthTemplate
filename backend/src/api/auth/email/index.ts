import { Router } from "express"
import User from "../../../models/User"
import bcrypt from "bcryptjs"
import {
  encodeObjectToUrl,
  generateToken,
  nonSensitiveUser,
  validPassword,
} from "../../../utilities"

const router = Router()

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

router.post("sign-up", async (req, res): Promise<any> => {
  const { email, password } = req.body

  if (!validPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be a minimum of eight characters, containing at least one uppercase letter, one lowercase letter and one number",
    })
  }

  try {
    const user = await User.findOne({ email })
    if (user) {
    }
  } catch (error) {}
})

router.post("/login", async (req, res): Promise<any> => {
  const { email, password } = req.body

  if (!email || email.length === 0) {
    return res.status(400).json({ message: "Email not provided." })
  }

  if (!password || password.length === 0) {
    return res.status(400).json({ message: "Password not provided." })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." })
    }

    const isMatch = user.password
      ? await bcrypt.compare(password, user.password)
      : false

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password." })
    }

    const nonSensitiveUserData = nonSensitiveUser(user)

    const token = generateToken(user._id)

    const redirectUrl = encodeObjectToUrl(`/callback`, {
      ...nonSensitiveUserData,
      token,
    })

    return res.status(200).json({ message: "Login successful!", redirectUrl })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "An error occurred while logging in. Please try again.",
    })
  }
})

export default router
