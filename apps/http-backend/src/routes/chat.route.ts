import {Router, Response} from 'express';
import { jwtVerifier } from '../middlewares/auth.middleware.js';
import { UserReq } from '@repo/types/allTypes';
import { chatResponse } from '../utils/aiUtilFunction.js';

const router = Router();

const generateAnswerFromAI = async (req:UserReq, res: Response)=>{
    try{
        console.log("Got the request ", req.body.text)
        const answer = await chatResponse(req.body.text);
        if(!answer){
            console.log("Error in generateAnswerFromAI1: ", answer)
            res.status(500).json({
                errorMessage: "Error while generating response: "+answer
            })
        }
        res.status(200).json({
            answer: answer
        })
    }catch(e: any){
        console.log("Error in generateAnswerFromAI: ", e)
        res.status(500).json({
            error: "Unable to generate you response.",
            errorMessage: e.message
        })
    }
}


router.route('/generateAnswer').post(jwtVerifier as any, generateAnswerFromAI);

export {router}