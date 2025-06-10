import WebSocket, { WebSocketServer } from "ws";
import dotenv from 'dotenv';
import jwt, { JwtPayload } from "jsonwebtoken";
import { parsedEnvVars } from '@repo/types/allTypes';

dotenv.config({
    path: "./.env"
})

const wss = new WebSocketServer({ port: 8080});


wss.on('connection', function connection(ws, request){
    const url = request.url;
    if(!url){
        ws.close();
        return;
    }

    try{
        const queryParams = new URLSearchParams(url.split('?')[1])
        const token = queryParams.get("token") as string;

        if(!parsedEnvVars.success){
            ws.send(JSON.stringify({
                type: "error",
                message: "Authentication failed, bad env variables"
            }))
            ws.close();
            throw new Error("Invalid environment variables");
        }

        const envVars = parsedEnvVars.data;

        const decodedToken = jwt.verify(token, envVars.ACCESS_TOKEN_SECRET)
        

        //db erification
        if(!decodedToken || typeof decodedToken === "string" || !decodedToken.userId ){
            ws.send(JSON.stringify({
                type: "error",
                message: "Authentication failed, invalid token"
            }))
            ws.close();
            return;
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
    

    ws.on('message', function message(data: WebSocket.RawData){
        ws.send(`got your h message ${data.toString()}`);
    });

});