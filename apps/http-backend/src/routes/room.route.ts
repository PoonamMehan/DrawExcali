import { Router, Response } from "express";
import { jwtVerifier } from "../middlewares/auth.middleware.js"
import {UserReq} from "@repo/types/allTypes";

const router = Router();

const getRoomIdHandler = (req:UserReq, res:Response)=>{
    //db call and other logic 

    res.json({
        roomId: 123
    })
}
router.route("/getRoomId").post(jwtVerifier, getRoomIdHandler)

export {router};