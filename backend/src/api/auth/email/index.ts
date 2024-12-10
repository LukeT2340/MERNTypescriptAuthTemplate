import { Router } from "express"
import User from "../../../models/User"
import bcrypt from "bcryptjs"
import {
  encodeObjectToUrl,
  generateToken,
  nonSensitiveUser,
} from "../../../utilities"

const router = Router()

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
      return res.status(404).json({ message: "Incorrect email or password." })
    }

    const isMatch = user.password
      ? await bcrypt.compare(password, user.password)
      : false

    if (!isMatch) {
      return res.status(404).json({ message: "Incorrect email or password." })
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
