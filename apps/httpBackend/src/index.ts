require('dotenv').config()
import express, { NextFunction, Request, Response } from "express"
import v1Router from "./routes/v1"
import { PORT } from './config'

const app = express()

app.use(express.json())
// app.use(cookieParser())
app.use("/api/v1" , v1Router)

app.use((req:Request, res:Response, next:NextFunction) => {
    res.status(500).json({
         message: 'Internal server error'
    })
    next()
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})