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

export default router
