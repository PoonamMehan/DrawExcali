import { Router, Response } from "express";
import { jwtVerifier } from "../middlewares/auth.middleware.js"
import {UserReq} from "@repo/types/allTypes";
import { CreateRoomSchema } from "@repo/types/allTypes";
import { Prisma, prisma } from "@repo/db/index";
import { number } from "zod";

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
                chats: {
                    connect: []
                }
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

const getOldChatsHandler = async (req: UserReq, res: Response)=>{
    const roomIdInput = req.params["roomId"];
    if(!roomIdInput){
        res.status(400).json({
            errorMessage: "Send a room Id in endpoint request url."
        })
        return;
    }

    const roomId: number  = parseInt(roomIdInput)
    if(isNaN(roomId)){
        res.status(400).json({
            errorMessage: "Send a valid number as room Id in endpoint request url."
        })
        return;
    }
    let allChats;
    try{
        allChats = await prisma.room.findUnique({
            where:{
                id: roomId
            },
            select: {
                chats: {
                    take: 100,
                    orderBy: {
                        id: 'desc'
                    },
                    select: {
                        message: {
                            select: {
                                shapeName: true,
                                startX: true,
                                startY: true,
                                endX: true,
                                endY: true,
                                text: true
                            }
                        }
                    }
                }, 
            }
        })
    }catch(err){
        res.status(500).json({
            errorMessage: "Something went wrong at the server while fetching chats from db."
        })
        return;
    }
    if(!allChats){
        res.status(400).json({
            errorMessage: "Something went wrong, there are no chats for this room in db."
        })
        return;
    }
    res.status(200).json(allChats)
}

const getRoomId = async(req: UserReq, res: Response)=>{
    const roomSlug = req.body.roomSlug;

    let roomId;
    try{
        roomId = await prisma.room.findUnique({
            where: {
                slug: roomSlug
            }, 
            select: {
                id: true
            }
        })
        if(!roomId){
            return res.status(400).json({
                errorMessage: "There is no room with this slug"
            })
        }
    }catch(err: any){
        return  res.status(500).json({
                errorMessage: "Something went wrong at the server while fetching details from db "+ err.message
            })
    }
   
    res.status(200).json(roomId);
}


router.route("/create-room").post(jwtVerifier, createRoomHandler as any);
router.route("/getChat/:roomId").get(jwtVerifier, getOldChatsHandler);
router.route("/get-roomId").post(jwtVerifier, getRoomId as any);


export {router};