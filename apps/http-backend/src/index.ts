import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { Request, Response } from "express";
import { router as userRouter } from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import {router as roomRouter } from './routes/room.route.js';
import {router as chatRouter} from './routes/chat.route.js';


dotenv.config({
    path: "./.env"
})

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(cookieParser());

app.get("/", (req: Request, res: Response)=>{
    console.log("Woking")
    res.send("Wroking")
})

app.use("/api/user", userRouter);

app.use("/api/room", roomRouter);

app.use("/api/chat", chatRouter);

const server = app.listen(8000, ()=>{
    console.log("Server is listening on port 8000")
})

console.log(process.env.ACCESS_TOKEN_SECRET)
server.on("error", (err: any)=>{
    console.log("Server is not listening anymore because ", err)
})
