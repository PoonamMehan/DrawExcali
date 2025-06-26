'use client';
import { useSocket } from "../hooks/useSocket"
import { useState, useEffect, useRef } from "react";
import { drawArrow, drawCircle, drawDiamond, drawRectangle, drawText } from "../utils/allShapes";
import axios from 'axios';


export function DrawingRoomClient({
    drawings,
    id
}:{
    drawings: {
        shapeName: string, 
        startX: number
        startY: number,
        endX: number,
        endY: number,
        text?: string | null
    }[], //define the schema of msg here 
    id: number //roomId
}){
    const {socket, loading} = useSocket();
    const [drawingChats, setDrawingChats] = useState(drawings);
    const canvasRef = useRef<HTMLCanvasElement>(null); 
    // const startCanvasCtx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
    // const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(startCanvasCtx)

    const [startInputTaking, setStartInputTaking] = useState(false);
    const [ xInput, setXInput ] = useState<number | null>(null);
    const [ yInput, setYInput ] = useState<number | null>(null);
    const [ inputText, setInputText ] = useState("");
    const [ctxInput, setCtxInput] = useState<CanvasRenderingContext2D | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [startAiInput, setStartAiInput] = useState(false);
    const [ aiInput, setAiInput] = useState(""); 
    const [aiAnswerGenerating, setAiAnswerGenerating] = useState(false);
    const token = localStorage.getItem('Token');


    const [currSelectedShape, setCurrSelectedShape] = useState("Pointer");
    

    useEffect(()=>{
        if(startInputTaking && inputRef.current){
            inputRef.current.focus();
        }
    }, [startInputTaking])

    useEffect(()=>{
        //write useEffect
        //define the schema
        //make the code modular
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(!ctx){
                return;
            }
            drawingChats.map((val)=>{
                console.log("Rendering image", drawingChats);
                if(val.shapeName === 'Rectangle'){
                    drawRectangle(ctx, val.startX, val.startY, val.endX, val.endY);
                }else if(val.shapeName === 'Circle'){
                    drawCircle(ctx, val.startX, val.startY, val.endX);
                }else if(val.shapeName === 'Diamond'){
                    drawDiamond(ctx, val.startX, val.startY, val.endX, val.endY);   
                }else if (val.shapeName === 'Arrow'){
                    drawArrow(ctx, val.startX, val.startY, val.endX, val.endY);
                }else if(val.shapeName === 'Text'){
                    if(val.text){
                        drawText(ctx, val.startX, val.startY, val.text);
                    }
                }
            })
        }



    }, [drawingChats])


    useEffect(()=>{
        console.log("old chats", drawingChats);
        if(socket && !loading){
            console.log("here inside setting up event listeners on socket")
            setTimeout(()=>{
                socket.send(JSON.stringify({
                "type": "join_room",
                "roomId": `${id}`
            }))

            socket.onmessage = (event)=>{
                const parsedData = JSON.parse(event.data);
                console.log("new drawing message arrived ", parsedData)
                if(parsedData.type === 'chat'){
                    setDrawingChats( drawingMsg => [...drawingMsg, {...parsedData.message}])
                }
            }
            }, 3000)
            
        }
    }, [socket, loading])

    useEffect(()=>{
        alert(currSelectedShape)
    }, [currSelectedShape])

    useEffect(()=>{
        setDrawingChats(drawings)
    }, [drawings]);

    useEffect(()=>{
        console.log("Yo got the chats here", drawingChats);
    }, [drawingChats])

    useEffect(()=>{
        const canvas = canvasRef.current;
        if(!canvas){
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if(!ctx){
            console.log("no canvas ctx ", ctx)
            alert('Funckedup');
            return;
        }
        
        console.log("This useEffect ran, and inside the cif statement")
        let startX : number;
        let startY: number;
        let endX: number;
        let endY: number;

        let mouseDownHap = false;

        const mouseDownHandler = (e: MouseEvent)=>{
            startX = e.clientX;
            startY = e.clientY;
            
            mouseDownHap=true;
        }
        canvas.addEventListener('mousedown', mouseDownHandler);

        const mouseMoveHandler = (e: MouseEvent)=>{
            if(mouseDownHap){
                // alert(`in here ${currSelectedShape}`)
                if(currSelectedShape === "Rectangle"){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawRectangle(ctx, startX, startY, e.clientX, e.clientY);
                }else if(currSelectedShape === "Circle"){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawCircle(ctx, startX, startY, e.clientX);
                }else if(currSelectedShape === "Diamond"){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawDiamond(ctx, startX, startY, e.clientX, e.clientY);
                }else if(currSelectedShape === "Arrow"){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawArrow(ctx, startX, startY, e.clientX, e.clientY)
                } 
            }
        }
        canvas.addEventListener('mousemove', mouseMoveHandler)

        const mouseUpHandler = (e: MouseEvent)=>{
            endX = e.clientX;
            endY = e.clientY;
            let newEntryInChat: any = {};
            let someShapeWasMade = false;

            
            if(currSelectedShape === "Rectangle"){
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawRectangle(ctx, startX, startY, endX, endY);
                newEntryInChat = {
                    "shapeName": "Rectangle",
                    "startX": startX,
                    "startY": startY,
                    "endX": endX,
                    "endY": endY
                }
                someShapeWasMade = true;
            }else if(currSelectedShape === "Circle"){
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawCircle(ctx, startX, startY, endX);
                newEntryInChat = {
                    "shapeName": "Circle",
                    "startX": startX,
                    "startY": startY,
                    "endX": endX,
                    "endY": endY
                }
                someShapeWasMade = true;
            }else if(currSelectedShape === "Diamond"){
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawDiamond(ctx, startX, startY, endX, endY);
                newEntryInChat = {
                    "shapeName": "Diamond",
                    "startX": startX,
                    "startY": startY,
                    "endX": endX,
                    "endY": endY
                }
                someShapeWasMade = true;
            }else if(currSelectedShape === "Arrow"){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawArrow(ctx, startX, startY, endX, endY);
                newEntryInChat = {
                    "shapeName": "Arrow",
                    "startX": startX,
                    "startY": startY,
                    "endX": endX,
                    "endY": endY
                }
                someShapeWasMade = true;
            }else if(currSelectedShape === "Text"){
                setStartInputTaking(true);
                setXInput(startX);
                setYInput(startY);
                setCtxInput(ctx);
            }else if( currSelectedShape === "AI"){
                setStartAiInput(true);
                setXInput(startX);
                setYInput(startY);
                setCtxInput(ctx);
            }
            
            if(someShapeWasMade){
                setDrawingChats((val) => [...val, {...newEntryInChat}])

                console.log("Socket", socket)
                if(startX !== endX && startY !== endY){
                    socket?.send(JSON.stringify({
                        type: "chat",
                        roomId: id, 
                        message: newEntryInChat
                    }))
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            mouseDownHap = false;
        }
        canvas.addEventListener('mouseup', mouseUpHandler);
        

        return ()=>{
            canvas.removeEventListener('mousedown', mouseDownHandler);
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            canvas.removeEventListener('mouseup', mouseUpHandler);
        }

    }, [socket, loading, currSelectedShape, id])

    useEffect(()=>{
        window.addEventListener('resize', (e)=>{
            if(canvasRef.current){
                const canvas = canvasRef.current;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // const ctx = canvas.getContext('2d');
                // setCanvasCtx(ctx);
            }
        })
    }, [])

    const generateDiagramHandler = async(ctx: CanvasRenderingContext2D, startX: number, startY: number, text: string)=>{
        try{
            const response = await axios({
            url: '/api/chat/generateAnswer',
            method: 'post',
            data: {
                text: `XCoordinate=${startX}, YCoordinate=${startY}. Text=${text}`
            },
            headers: {
                'Authorization': token, 
            },
            withCredentials: true
        })
        console.log("Got the response: ", response);
        const ans = JSON.parse(response.data.answer)
        ans.map((val:any)=>{setDrawingChats((oldVal)=> [...oldVal, {...val}])})
        return;
        //one by one add all of them to drawingChats[ ]

        //socket.send()
        }catch(e){
            console.log("Error in getting the diagram generated: ", e)
        } 
    }

    return (
        <div>
            {/* {drawingChats.map((val, idx)=>{
                return (<div style={{color: 'red'}} key={idx}>
                    {val.message}
                </div>)
            })} */}

            <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}
            style={{"backgroundColor": "white", "margin": 0, "padding": 0, "display": "block", position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            </canvas>
            {startInputTaking && xInput && yInput && <input value={ inputText } onChange={(e)=>{ setInputText(e.target.value)}} onKeyDown={(e)=>{
                if(e.key === 'Enter'){
                    if(ctxInput && xInput && yInput){
                        ctxInput.font = "20px serif";
                        ctxInput.fillText(inputText, xInput, yInput);
                        //Send to the ws server
                        const newEntryInChat = {
                            "shapeName": "Text",
                            "startX": xInput,
                            "startY": yInput,
                            "endX": xInput,
                            "endY": yInput,
                            "text": inputText
                        }
                        socket?.send(JSON.stringify({
                            type: "chat",
                            roomId: id, 
                            message: newEntryInChat
                        }))
                    //add to the drawingChats [ ]
                        setDrawingChats((val) => [...val, {...newEntryInChat}])
                    }
                    setXInput(null);
                    setYInput(null);
                    setStartInputTaking(false);
                    setInputText("");
                    setCtxInput(null);
                }
            }} style={{position: 'absolute', top: yInput, left: xInput,backgroundColor: "transparent", border: "none", outline: "none", color: "black", caretColor: "black", fontSize: "20px" }} ref={inputRef}>
            </input>}

            <span style={{display: 'flex', flexDirection: 'column', position: 'absolute', top: 100, left: 0, zIndex: 10}}>
                <button id='Pointer' onClick={()=>{setCurrSelectedShape("Pointer")}}>Pointer</button>
                <button id='Rectangle' onClick={()=>{setCurrSelectedShape("Rectangle")}}>Rectangle</button>
                <button id='Circle' onClick={()=>{setCurrSelectedShape("Circle")}}>Circle</button>
                <button id='Diamond' onClick={()=>{setCurrSelectedShape("Diamond")}}>Diamond</button>
                <button id='Arrow' onClick={()=>{setCurrSelectedShape("Arrow")}}>Arrow</button>
                <button id='Text' onClick={()=>{setCurrSelectedShape("Text")}}>Text</button>
                <button id='AI' onClick={()=>{setCurrSelectedShape("AI")}}>AI</button>
            </span>
            {startAiInput && <div style={{display: 'flex', flexDirection: 'row', position: 'absolute', left: '50vw', top: '50vh'}}>
                <input value={aiInput} onChange={(e)=>{setAiInput(e.target.value)}} placeholder="Add you text here"></input>
                <button onClick={async ()=>{
                    if(aiInput && ctxInput && xInput && yInput){
                        setCurrSelectedShape("Pointer");
                        setAiAnswerGenerating(true);
                        try{
                            await generateDiagramHandler(ctxInput, xInput, yInput, aiInput);
                        }catch(e: any){
                            console.log("Error here in button click handler ", e.message);
                        }
                    }
                    setAiInput("");
                    setXInput(null);
                    setYInput(null);
                    setCtxInput(null);
                    setStartAiInput(false);
                    setAiAnswerGenerating(false);
                    //also add it in drawingChats[] and socket.send()
                    //maybe create new DB table for this
                }}>Generate</button>
            </div>
            }
            {aiAnswerGenerating && <div style={{display: 'flex', position: 'absolute', top: '50vh', left: '50vw', color: 'black'}}>Loading ....</div>}

            {/* add two conditional checks before rendering the input element */}
        </div>
    )
}

//what if till the time DrawingRoom fetches old drawings from the db, and passes onto to this component, new drawings via ws.onmessage() arrives? and we are not yet connected to the WebSocket server via the hook in this component?


//all the shapes(diamond, arrow) pencil later
//create a global state, to define which shape to be drawn rn. (absolute flexbox)
//send the shape to ws server. create a state [] to save all the shapes created here and coming from the ws server




//resize pe rerun the drawingChats.map(??)
//ws try catch
//less than 3 seconds to attach the message listener and room joining? Add Loading on screen till the room is joined (eliminate that room id is not given)

//AI
//send to the backend socket.send()
//loading and input and generate button's visibility
//UI better
//can concider creating a new DB table.