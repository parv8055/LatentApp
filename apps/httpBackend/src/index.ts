require('dotenv').config()
import express, { NextFunction, Request, Response } from "express"
import v1Router from "./routes/v1"
import { PORT } from './config'
import cookieParser from 'cookie-parser'
const app = express()

// console.log(process.env)

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1" , v1Router)
app.use((req:Request, res:Response, next:NextFunction) => {
    // console.error(err)
    res.status(500).json({
         message: 'Internal server error'
    })
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})