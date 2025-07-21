import { WebSocket, WebSocketServer } from "ws";
import dotenv from 'dotenv';
import jwt, { JwtPayload } from "jsonwebtoken";
import { CreateRoomSchema, parsedEnvVars } from '@repo/types/allTypes';
import {prisma} from "@repo/db/index";

dotenv.config({
    path: "./.env"
})

interface UserData {
    ws: WebSocket
}

const users: Record<string, Record<string, UserData>> = {};
const wss = new WebSocketServer({ port: 8080});

const checkAuthorization = (token: string): string | null=>{
    const envVars = parsedEnvVars.data;

    if(!envVars){
        return null;
    }

    let decodedToken;
    try{
        decodedToken = jwt.verify(token, envVars.ACCESS_TOKEN_SECRET)
    }catch(err){
        throw new Error(`Token is not valid ${err}`);
    }
    
    console.log("Decoded Token", decodedToken);
    //db verification
    if(!decodedToken || typeof decodedToken === "string" || !decodedToken.userId ){
        return null;
    }

    return decodedToken.userId;
}

wss.on('connection', async function connection(ws, request){
    const url = request.url;
    if(!url){
        ws.close();
        return;
    }

    let userId;
    try{
        const queryParams = new URLSearchParams(url.split('?')[1])
        const token = queryParams.get("token") as string;
        if(!parsedEnvVars.success){
            ws.send(JSON.stringify({
                type: "error",
                message: "Authentication failed, bad env variables at the backend."
            }))
            ws.close();
            return;
        }

        userId = checkAuthorization(token)

        if(!userId){
            ws.send(JSON.stringify({
                type: "error",
                message: "Authentication failed, invalid token"
            }))
            ws.close();
            return;
        }
        const userInDb = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!userInDb){
            ws.send(JSON.stringify({
            type: "error",
            message: "Authentication failed, wrong token."
        }))
        }
    }catch(err: any){
        console.log(err);
        ws.send(JSON.stringify({
            type: "error",
            message: "Authentication failed"+ err.message
        }))
        ws.close();
        return;
    }
    
    //on connecting, add the user to this first array which has all the users.
    users["allConnectedUsers"] = {...users["allConnectedUsers"], [userId]: { ws: ws }}

    ws.on('message', async function message(data){
        const dataStringified = data.toString();
        console.log(dataStringified);
        if(typeof dataStringified !== 'string'){
            ws.send(JSON.stringify({
                type: "error",
                message: "Send data in correct format."
            }))
            return;
        }
        const parsedData = JSON.parse(dataStringified);
        
        if(parsedData.type === "join_room"){
            console.log("users", users)

            if(!users["allConnectedUsers"]){
                return;
            }
            if(users["allConnectedUsers"][`${userId}`]){
                const userWs = users["allConnectedUsers"][`${userId}`];
                if(!userWs){
                    return;
                }
                
                const userInRoom = { [userId]: userWs};

                if(users[`${parsedData.roomId}`]){
                    //only if this room exists in Room db table.
                    users[`${parsedData.roomId}`] = {...users[`${parsedData.roomId}`], ...userInRoom}
                }else{
                    users[`${parsedData.roomId}`] = userInRoom
                }
            }
            console.log("now users", users)
        }

        if(parsedData.type === "leave_room"){
            const usersRoom = users[`${parsedData.roomId}`]
            if(!usersRoom){
                ws.send("Send correct room Id. This room does not exist.");
                return;
            }
            if(usersRoom[`${userId}`]){
                delete usersRoom[`${userId}`];
                console.log("After user deletion: ", users)
                return;
            }   
        }
        
        if(parsedData.type === "chat"){
            //the optimized way to do this is to use Queues. Which is in video (chess video YT)
            //add the msg in Chat db table.
            //send to all the users who have joined that particular room.

            try{

                console.log("heyo, chat came", parsedData)
                let shapeData;
                if(parsedData.message.text){
                    shapeData = {
                        shapeName: parsedData.message.shapeName,
                        startX: parsedData.message.startX,
                        startY: parsedData.message.startY,
                        endX: parsedData.message.endX,
                        endY: parsedData.message.endY,
                        text: parsedData.message.text
                    }
                }else{
                    shapeData={
                        shapeName: parsedData.message.shapeName,
                        startX: parsedData.message.startX,
                        startY: parsedData.message.startY,
                        endX: parsedData.message.endX,
                        endY: parsedData.message.endY}
                }
                const drawingTableEntry = await prisma.drawing.create({
                    data: shapeData
                })

                let chatDbEntry;
                if(drawingTableEntry){
                    chatDbEntry = await prisma.chat.create({
                    data: {
                        roomId: parsedData.roomId,
                        userId: userId,
                        messageId: drawingTableEntry.id
                    }
                })
                }
                

                const usersRoom = users[`${parsedData.roomId}`]
                if(!usersRoom){
                    ws.send("This room does not exists.")
                    return;
                }

                for( const key in usersRoom){
                    if(key !== userId){
                        const currUser = usersRoom[key] //{ws: ws}
                        if(!currUser){
                            throw new Error("User's key does not have a valid ws obj.")
                        }
                        console.log("Sent data to: ", key, " the message sent is: ", parsedData.message)
                        const websocObj = currUser["ws"]
                        websocObj.send(JSON.stringify({
                            type: "chat",
                            message: parsedData.message,
                            roomId: parsedData.roomId
                        }))
                    }
                }
            }catch(err){
                console.log(err);
                ws.send("Chat not sent correctly.")
            }
        }
        
            

    });

});