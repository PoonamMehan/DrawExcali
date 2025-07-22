import { Router, Request, Response } from "express";
import { SignupSchema, LoginSchema, parsedEnvVars } from "@repo/types/allTypes";
import { prisma, Prisma } from "@repo/db/index";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const router = Router();


const signupHandler = async(req: Request, res: Response) => {
    const parsedInput = SignupSchema.safeParse(req.body);
    if(!parsedInput.success){
        return res.status(400).json({
            errorMessage: "Send valid data"+parsedInput.error.format()
        })
    }

    const validatedData = parsedInput.data;

    if(!validatedData){
         return res.status(400).json({
            errorMessage: "Send valid data"
        })
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds); 

    let d: Prisma.UserCreateInput;
    if(validatedData.username){
        d = {
            email: validatedData.email,
            username: validatedData.username,
            password: hashedPassword,
            rooms: {
                connect: []
            },
            chats: {
                connect: []
            }
        }
    }else{
        d = {
            email: validatedData.email,
            password: hashedPassword,
            rooms: {
                connect: []
            },
            chats: {
                connect: []
            }
        }
    }
    
    try{
        const userD = await prisma.user.create({
            data: d
        })

        return res.status(200).json({
            message: "User created successfully",
            userId: userD.id
        })

    }catch(err: any){
        if(err.code ==='P2002'){
            return res.status(400).json({
                errorMessage: `User with this ${err.meta.target[0]} already exists.`
            })
        }
        return res.status(500).json({
            errorMessage: 'User creation failed, try again. '+err.message
        })
    }
}

const loginHandler = async(req:Request, res: Response) => {
    console.log("user came here /login")
    const inputData = LoginSchema.safeParse(req.body)
    if(!inputData.success){
        return res.status(400).json({
            errorMessage: "Send valid data"
        })
    }
    const validatedData =  inputData.data;
    if(!validatedData.username && !validatedData.email){
        return res.status(400).json({
            errorMessage: "Send atleast one out of the email and username."
        })
    }

    let userData = null;
    if(validatedData.email){
        userData = await prisma.user.findUnique({
            where: {
                email: validatedData.email
            }
        })
    }else if(validatedData.username){
        userData = await prisma.user.findUnique({
            where: {
                username: validatedData.username
            }
        })
    }


    if(!userData){
        return res.status(400).json({
            errorMessage: "User with these credentials does not exist."
        })
    }

    const passwordVerification = await bcrypt.compare(validatedData.password, userData.password)

    if(!passwordVerification){
         return res.status(400).json({
            errorMessage: "Incorrect password."
        })
    }

    if(!parsedEnvVars.success){
        return res.status(500).json({
            errorMessage: "Access_Token_Secret for JWT as env variable is missing."
        })
    }

    const envVars = parsedEnvVars.data 

    const payload={
        userId: userData.id,
        email: userData.email
    }
    
    const token = jwt.sign(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: '200d' })

    return res.status(200).set('Authorization', `Bearer ${token}`).json({
        userData: {
            id: userData.id
        }
    })
}

router.route('/signup').post(signupHandler as any);
router.route('login').post(loginHandler as any);

export { router };



//ek schema jismein every row has two columns: col1: room ID and col2: an array with all the messages in it. Because it will save look up time while getting messages from the db.
//User table (username, email, password)
//there is a global, server-living variable which has the information about the users currently connected and in which room are they.