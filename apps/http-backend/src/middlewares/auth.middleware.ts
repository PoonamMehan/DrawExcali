import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { UserReq, parsedEnvVars } from '@repo/types/allTypes';

export const jwtVerifier = (req:UserReq, res:Response, next: NextFunction)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!parsedEnvVars.success){
            throw new Error("")
        }
        const envVars = parsedEnvVars.data;

        const decodedToken = jwt.verify(token, envVars.ACCESS_TOKEN_SECRET) 

        if(typeof decodedToken === "string"){
            res.status(403).json({
                errorMessage: "Unauthorized"
            })
            return;
        }

        if(decodedToken){
            req.userId = decodedToken.userId;
            next();
        }else{
            res.status(403).json({
                errorMessage: "Unauthorized"
            })
            return;
        }
    }catch(err){
        res.status(403).json({
            errorMessage: "Unauthorized",
            detailedError: err
        })
    }
    

}