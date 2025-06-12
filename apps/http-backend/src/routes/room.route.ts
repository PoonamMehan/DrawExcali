import { Router, Response } from "express";
import { jwtVerifier } from "../middlewares/auth.middleware.js"
import {UserReq} from "@repo/types/allTypes";
import { CreateRoomSchema } from "@repo/types/allTypes";
import { Prisma, prisma } from "@repo/db/index";

const router = Router();

const createRoomHandler = async(req:UserReq, res:Response)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            errorMessage: "Send a name for the room."
        })
    }

    try{
        const userId = req.userId;
        const roomData: Prisma.RoomCreateInput = {
                slug: parsedData.data.name,
                admin: {
                    connect: {
                        id: userId
                    }
                },
            }

        const createdRoom = await prisma.room.create({
            data: roomData
        })

        if(!createdRoom){
            return res.status(500).json({
            errorMessage: "Coud not add room in db, try again "
        })
        }

        return res.status(200).json({
            roomId: createdRoom.id,
            slug: createdRoom.slug
        })

    }catch(err: any){
        if(err.code === 'P2002'){
            return res.status(400).json({
                errorMessage: "Room id has to be unique."
            })
        }
        console.log("Could not create room: ", err)
        return res.status(500).json({
            errorMessage: "Could not create room "+ err.message
        })
    }
    
}

const getOldChatsHandler = (req: UserReq, res: Response)=>{

    res.json
}


router.route("/getRoomId").post(jwtVerifier, createRoomHandler as any)
router.route("/getChat/:roomId").post(jwtVerifier, getOldChatsHandler);


export {router};