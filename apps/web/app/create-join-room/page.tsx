'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function CreateJoinRoom(){
    const [roomName, setRoomName] = useState<string>("");
    const router = useRouter();

    async function createRoomHandler(){
        const token = localStorage.getItem('Token');
        axios({
            method: 'post',
            url: '/api/room/create-room',
            data: {
                'name': roomName
            },
            headers: {
                'Authorization': token
            },
            withCredentials: true,
        }).then(async(response)=>{
            console.log("response", response)
            await joinRoom(roomName);
        }).catch((err)=>{
            console.log("Error", err);
        })
    }

    async function joinRoom(slug: string){
        const token = localStorage.getItem("Token");
        axios({
            method: 'post',
            url: '/api/room/get-roomId',
            data: {
                'roomSlug': slug,
            },
            headers: {
                'Authorization': token
            },
            withCredentials: true
        }).then((response)=>{
            router.push(`/room/${slug}`);
        }).catch((err)=>{
            alert('No room exists with this name.')
            console.log("Error", err);
        })
    }

    async function joinRoomHandler(){
        await joinRoom(roomName);
    }

    return(
        <div>
            <input placeholder="Room name" value={roomName} onChange={(e)=>{setRoomName(e.target.value)}}></input>
            <button onClick={createRoomHandler}>Create Room</button>
            <button onClick={joinRoomHandler}>Join Room</button>
        </div>
    )
}