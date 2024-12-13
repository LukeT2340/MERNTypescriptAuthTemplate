import { Router } from "express"
import google from "./google"
import email from "./email"
import secure from "./secure"

const router = Router()
router.use("/google", google)
router.use("/email", email)
router.use("/secure", secure)

export default router
