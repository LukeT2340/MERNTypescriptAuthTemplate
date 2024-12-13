import { Router, Request, Response } from "express"
import passport from "passport"

const router = Router()

router.get(
  "/test",
  passport.authenticate("session", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    console.log("Session:", req.session)
    console.log("User:", req.user)
    res.send("This is a secure endpoint!")
  }
)

router.get("/profile", (req: any, res: any) => {
  console.log("Profile Route - Full Session Details:", {
    sessionID: req.sessionID,
    sessionUser: req.session?.passport?.user,
    reqUser: req.user,
    isAuthenticated: req.isAuthenticated(),
  })

  // Additional check
  if (req.session?.passport?.user) {
    console.log("User ID found in session:", req.session.passport.user)
  }

  if (req.isAuthenticated()) {
    return res.status(200).json({ user: req.user })
  }
  res.status(401).json({ message: "Not authenticated" })
})

export default router
