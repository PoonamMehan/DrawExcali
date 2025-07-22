import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { UserReq, parsedEnvVars } from '@repo/types/allTypes';
import { prisma } from '@repo/db/index';

export const jwtVerifier = async (req: UserReq, res:Response, next: NextFunction)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token ", token)
        console.log("Here1 ", req.header("Authorization"))
        console.log("Here2 ", req.header('Authorization'))
        if(!token){
            return res.status(400).json({
                errorMessage: "No token was present, neither in cookies nor in headers."
            })
        }

        if(!parsedEnvVars.success){
            throw new Error("Env variables not loaded properly.")
        }
        const envVars = parsedEnvVars.data;

        console.log("env", envVars.ACCESS_TOKEN_SECRET)
        const decodedToken = jwt.verify(token, envVars.ACCESS_TOKEN_SECRET) 
        console.log("decoded token: ", decodedToken)

        if(typeof decodedToken === "string"){
            res.status(403).json({
                errorMessage: "Unauthorized"
            })
            return;
        }
        if(!decodedToken){
            res.status(403).json({
                errorMessage: "Unauthorized, Invalid token."
            })
            return;
        }
        const userId = decodedToken.userId
        const user = await prisma.user.findFirst({
            where: { id: userId}
        })
        if(!user){
            return res.status(400).json({
                errorMessage: "Invalid Token. No such user exists."
            })
        }
        req.userId = decodedToken.userId;
        return next();
    }catch(err){
        res.status(403).json({
            errorMessage: "Unauthorized",
            detailedError: err
        })
    }
    

}