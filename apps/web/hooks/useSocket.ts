import { useState, useEffect } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("Token")?.replace("Bearer ", "");
    const FULL_WS_URL = `${WS_URL}?token=${token}`;

    useEffect(()=>{
        const ws = new WebSocket(FULL_WS_URL);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return({socket, loading});
}


