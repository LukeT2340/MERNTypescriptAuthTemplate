process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Remove this line in production

import express from "express"
import "dotenv/config"
import cors from "cors"
import { connectToMongoServer } from "./utilities"
import api from "./api"

const port = process.env.PORT || 3001

connectToMongoServer()

const app = express()

app.use(express.json())

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use("/api", api)
app.listen(port, () => {
  return console.log(`Express is listening on ${port}`)
})
