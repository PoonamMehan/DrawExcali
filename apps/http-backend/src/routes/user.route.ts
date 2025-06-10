import { Router, Request, Response } from "express";
import { z } from "zod/v4";
import { SignupSchema, LoginSchema } from "@repo/types/allTypes";

const router = Router();


const signupHandler = async(req: Request, res: Response) => {
    const data = SignupSchema.safeParse(req.body);
    if(!data){
        res.status(400).json({
            errorMessage: "Send valid data"
            //send better error msg. Analyse 'data' maybe zod specifically tells where validation failed.
        })
        return;
    }
} 

const loginHandler = async(req:Request, res: Response) => {
    const data = LoginSchema.safeParse(req.body)
    if(!data){
        res.status(400).json({
            errorMessage: "Send valid data"
        })
        return;
    }
    //check in db 
    //if user exists, send result, set header as jwt refresh token and session token
    //in db store refresh token
}

router.route('/signup').post(signupHandler);
router.route('/login').post(loginHandler);

export { router };