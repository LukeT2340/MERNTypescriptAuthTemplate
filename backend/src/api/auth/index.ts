import { Router } from "express"
// import rateLimit from "express-rate-limit"
import google from "./google"
import email from "./email"
import secure from "./secure"

// // Rate limiter for login attempts
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 login attempts per windowMs
//   message: "Too many login attempts, please try again later.",
// })

const router = Router()

// router.use(loginLimiter)
router.use("/google", google)
router.use("/email", email)
router.use("/secure", secure)

export default router
