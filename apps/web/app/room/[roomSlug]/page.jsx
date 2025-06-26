'use client';
import { useParams } from "next/navigation";
import { DrawingRoom } from "../../../components/DrawingRoom";
import { useEffect, useState } from "react";
import axios from 'axios';


export default function CollaborativeCanvas(){
    const params = useParams();
    // const [token, setToken] = useState();
    const [roomId, setRoomId] = useState();
    
    useEffect(()=>{
        const tkn = (localStorage.getItem("Token"));
        // console.log("yo", tkn)
        // setToken(tkn);
        const getRoomId = ()=>{
            axios({
                method: 'post',
                url: "/api/room/get-roomId",
                data: {
                    roomSlug: params.roomSlug
                },
                headers: {
                    'Authorization': tkn
                },
                withCredentials: true
            } ).then((response)=>{
                console.log("Room id got ", response.data.id);
                setRoomId(response.data.id)
            }).catch((err)=>{
                console.log("Error while fetching room Id", err)
            })
        }
        getRoomId();
    }, [])
    
    
    
    return(
        <div>
            {roomId && <DrawingRoom id={roomId}/>}
            {!roomId && <div>No room ID specified.</div>}
        </div>
    )
 }     
//  {
//                 roomSlug: params.roomId
//             }, {
//                 headers: {
//                     'Authorization': token 
//                 },
//                 withCredentials: true
//             }