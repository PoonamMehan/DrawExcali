'use client';
import axios from 'axios';
import { DrawingRoomClient } from './DrawingRoomClient';
import {useEffect, useState } from 'react';

//TODO: make this a server component by setting jwt in cookies, and creating an enpoint to get a jwt when need to interact wth the ws-server.

interface drawingChatsSchema {
    shapeName: string,
    startX: number
    startY: number,
    endX: number,
    endY: number,
    text?: string|null
}

export function DrawingRoom({id}:{id: number}){
    const token = localStorage.getItem('Token');
    const [drawings, setDrawings ] = useState<drawingChatsSchema[]>([]);

    useEffect(()=>{
        const getOldMsgs = async()=>{
            axios({
                method: 'get',
                url: `/api/room/getChat/${id}`,
                headers: {
                    'Authorization': token,
                },
                withCredentials: true
            }).then(( response )=>{
                const allDrawings = response.data.chats.map((val: any)=> {return {...val.message}})
                setDrawings(allDrawings);
                console.log("Got old messages ", allDrawings)
            }).catch((err)=>{
                console.log("Error in fetching the messages: ", err);
            })
        }
        getOldMsgs();
    }, [])
    

    return(
        <div>
            <DrawingRoomClient drawings={drawings} id={id}/>
        </div>
        
    )
}