import { Router } from "express"
import google from "./google"
import email from "./email"

const router = Router()
router.use("/google", google)
router.use("/email", email)

export default router
