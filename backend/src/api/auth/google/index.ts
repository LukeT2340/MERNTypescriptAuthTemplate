import { Router } from "express"
import axios from "axios"
import User from "../../../models/User"
import {
  encodeObjectToUrl,
  generateToken,
  nonSensitiveUser,
} from "../../../utilities"

const router = Router()

// Initiates the Google Login flow
router.get("/", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}/api/auth/google/callback&response_type=code&scope=profile email`
  res.redirect(url)
})

// Callback URL for handling the Google Login response
router.get("/callback", async (req, res): Promise<any> => {
  const { code } = req.query

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.REDIRECT_URI}/api/auth/google/callback`,
      grant_type: "authorization_code",
    })

    const { access_token } = data
    console.log(access_token)
    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    )

    const { email, id } = profile

    const user = await User.findOneAndUpdate(
      { googleId: id },
      { email, googleId: id, verified: true },
      { upsert: true, new: true }
    )

    if (!user) {
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again later" })
    }

    const nonSensitiveUserData = nonSensitiveUser(user)
    const token = generateToken(user._id)

    console.log({ ...nonSensitiveUserData, token })

    const redirectUrl = encodeObjectToUrl(
      `${process.env.FRONTEND_URL}/callback`,
      { ...nonSensitiveUserData, token }
    )

    // Code to handle user authentication and retrieval using the profile data
    res.redirect(redirectUrl)
  } catch (error) {
    console.error("Error whilst logging in:", error)
    res.redirect(`${process.env.FRONTEND_URL}`)
  }
})

export default router
