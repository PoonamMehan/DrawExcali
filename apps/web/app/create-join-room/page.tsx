'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function CreateJoinRoom(){
    const [roomName, setRoomName] = useState<string>("");
    const [ inputErr, setInputErr ] = useState<string>("");
    const router = useRouter();
    const [clickedCR, setClickedCR] = useState(false)
    const [clickedJR, setClickedJR] = useState(false)

    
    useEffect(()=>{
        const token = localStorage.getItem('Token');
        if(!token){
            router.push('/login');
        }
    }, [])

    //room does not exist & room already exist (create) & server error

    async function createRoomHandler(){
        //if room already exists
        //slug's format
        setClickedCR(true)
        setInputErr("")
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
            setClickedCR(false)
            if(err.response.data.errorMessage == "Room id has to be unique."){
                setInputErr("Room with this name already exists.");
            }
            console.log("Error", err);
            console.log("Error", err.response.data.errorMessage);
        })
    }

    async function joinRoom(slug: string){
        //romdoes not exist
        setInputErr("")
        setClickedJR(true)
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
            setClickedJR(false)
            if(err.response.data.errorMessage == "There is no room with this slug"){
                setInputErr("Room with this name does not exist.");
            }
            //auth error
            //error when room does not exist
            //error when server request fails
            //slug format( hande at backend?)
            console.log("Error", err);
            console.log("Error", err.response.data.errorMessage);
        })
    }

    async function joinRoomHandler(){
        await joinRoom(roomName);
    }

    return(
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-lg backdrop-blur-md">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                Create / Join Room
                </h2>

                {inputErr && (
                <div className="text-red-400 text-sm text-center mb-4">{inputErr}</div>
                )}

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Room name"
                        value={roomName}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-Z0-9-]+/g, '-')
                            const processedVal = val.replace(/[-]+/g, '-')
                            setRoomName(processedVal)
                        }}
                        className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    />

                    <div className="flex gap-4 pt-2">
                        <div className="relative w-1/2">
                            <button
                            disabled={clickedJR}
                            onClick={createRoomHandler}
                            className="w-full py-3 text-lg font-medium rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 transition-all"
                            >
                            Create Room
                            </button>
                            {clickedCR && (
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-900/60 flex items-center justify-center rounded-md">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            )}
                        </div>
                        <div className="relative w-1/2">
                            <button
                            disabled={clickedCR}
                            onClick={joinRoomHandler}
                            className="w-full py-3 text-lg font-medium rounded-md border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all"
                            >
                            Join Room
                            </button>
                            {clickedJR && (
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-900/60 flex items-center justify-center rounded-md">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}