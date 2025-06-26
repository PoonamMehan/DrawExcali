import {Router, Response} from 'express';
import { jwtVerifier } from '../middlewares/auth.middleware.js';
import { UserReq } from '@repo/types/allTypes';
import { chatResponse } from '../utils/aiUtilFunction.js';

const router = Router();

const generateAnswerFromAI = async (req:UserReq, res: Response)=>{
    try{
        const answer = await chatResponse(req.body.text);
        res.status(200).json({
            answer: answer
        })
    }catch(e: any){
        res.status(500).json({
            error: "Unable to generate you response.",
            errorMessage: e.message
        })
    }
}


router.route('/generateAnswer').post(jwtVerifier, generateAnswerFromAI) 

export {router}