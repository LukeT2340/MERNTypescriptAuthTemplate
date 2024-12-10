import { Response, Request, Router } from "express"
import axios from "axios"
import User from "../../../models/User"
import {
  encodeObjectToUrl,
  generateToken,
  nonSensitiveUser,
} from "../../../utilities"

const router = Router()

router.post("/login", async (req: Request, res: Response) => {})

export default router
