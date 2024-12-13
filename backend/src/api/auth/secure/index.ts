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

router.get("/profile", (req, res) => {
	console.log("req.user:", req.user)
	if (req.isAuthenticated()) {
		return res.status(200).json({ user: req.user })
	}
	res.status(401).json({ message: "Not authenticated" })
})

export default router
