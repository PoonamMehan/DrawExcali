'use client';
import { useParams } from "next/navigation";
import { DrawingRoom } from "../../../components/DrawingRoom";
import { useEffect, useState } from "react";
import axios from 'axios';


export default function CollaborativeCanvas(){
    const params = useParams();
    // const [token, setToken] = useState();
    const [roomId, setRoomId] = useState();
    const [loading, setLoading] = useState(true);

    
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
                setLoading(false)
            }).catch((err)=>{
                console.log("Error while fetching room Id", err)
                setLoading(false);
            })
        }
        getRoomId();
    }, [])
    
    
    
    return loading? (
        <div className="flex justify-center items-center bg-black w-[100vw] h-[100vh]">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
    ): (
        <div>
            {roomId && <DrawingRoom id={roomId}/>}
            {!roomId && <div className="flex justify-center items-center bg-black w-[100vw] h-[100vh]"><h2 className="text-white">Some error happend while joining the room, try again!</h2></div>}
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