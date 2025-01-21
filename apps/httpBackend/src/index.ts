require('dotenv').config()
import express from "express"
import v1Router from "./routes/v1"
import { PORT } from './config'
import cookieParser from 'cookie-parser'
const app = express()

// console.log(process.env)

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1" , v1Router)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})