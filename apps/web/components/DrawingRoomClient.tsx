'use client';
import { useSocket } from "../hooks/useSocket"
import { useState, useEffect, useRef } from "react";
import { drawArrow, drawCircle, drawDiamond, drawRectangle, drawText } from "../utils/allShapes";
import axios from 'axios';
import { MousePointer, RectangleHorizontal, Circle, Diamond, ArrowUp, ALargeSmall, Plus, Minus, Hand } from 'lucide-react';


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

    const [scale, setScale] = useState(1.0);
    const scaleMultiplier = 0.8;
    // const [ translatePos, setTranslatePos ] = useState({ x:(window.innerWidth/2)-2500, y:(window.innerHeight/2)-2500});
    const [ translatePos, setTranslatePos ] = useState({ x:0, y:0 });
    const [panning, setPanning] = useState(false)

    

    useEffect(()=>{
        if(startInputTaking && inputRef.current){
            inputRef.current.focus();
        }
    }, [startInputTaking])

    //this will center the canvas at the very start
    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d'); 
        // ctx?.translate((window.innerWidth/2)-2500, (window.innerHeight/2)-2500);
        ctx?.save();
        if(canvas?.width && canvas?.height){
            ctx?.translate(canvas?.width/2, canvas?.height/2)
        }
        ctx?.scale(2, 2)
        if(ctx){
            ctx.strokeStyle = "white";
            ctx.strokeRect(-100, -100, 200, 200);
        }
        ctx?.restore();

    }, [])

    // useEffect(()=>{
    //     const canvas = canvasRef.current;
    //     const ctx = canvas?.getContext('2d');
    //     if(ctx){
    //         ctx.strokeStyle = "white";
            
            // ctx.strokeRect(2500, 2500, 50, 50);
    //         ctx.strokeRect(2501, 2501, 50, 50);
    //         // ctx.restore();
    //         // alert(scale)
        // }
        
    // }, [scale])


    //scale
        //write xoom out logic
        //center the origin
        //clear the canvas rightly
        //right coordinates to draw things
    //panning

    

    

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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(translatePos.x, translatePos.y);
            ctx.scale(scale, scale);
            ctx.strokeStyle = "white";
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
            ctx.restore();
        }
        //rightX rightY
        //state (!oldVal) boolean, add in its dependency array.
        //useState or functions to handlescale change
    }, [drawingChats, scale, translatePos])


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
        // alert(currSelectedShape)
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
        setTranslatePos({x: canvas.width/2, y: canvas.height/2});
    }, [canvasRef])

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
        
        ctx.strokeStyle = "white";
        
        console.log("This useEffect ran, and inside the cif statement")
        let startX : number;
        let startY: number;
        let endX: number;
        let endY: number;
        const startDrag = {x: 0, y: 0};

        let mouseDownHap = false;
        const rect = canvas.getBoundingClientRect();

        const mouseDownHandler = (e: MouseEvent)=>{
            setPanning(true)
            startX = (e.clientX - rect.left - translatePos.x) / scale;
            startY = (e.clientY - rect.top - translatePos.y) / scale;
            // startX = e.clientX
            // startY = e.clientY

            //here
            startDrag.x = e.clientX 
            startDrag.y = e.clientY
            
            mouseDownHap=true;
        }
        canvas.addEventListener('mousedown', mouseDownHandler);

        const mouseMoveHandler = (e: MouseEvent)=>{
            if(mouseDownHap){
                // alert(`in here ${currSelectedShape}`)
                const realX = (e.clientX - rect.left - translatePos.x) / scale;
                const realY = (e.clientY - rect.top - translatePos.y) / scale;
                // const realX = e.clientX 
                // const realY = e.clientY 

                ctx.save();
                ctx.translate(translatePos.x, translatePos.y);
                ctx.scale(scale, scale);
                if(currSelectedShape === "Rectangle"){
                    ctx.save()
                    ctx.setTransform(1, 0, 0, 1, 0, 0);  
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.restore()
                    drawRectangle(ctx, startX, startY, realX, realY);
                }else if(currSelectedShape === "Circle"){
                    ctx.save()
                    ctx.setTransform(1, 0, 0, 1, 0, 0);  
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.restore()
                    drawCircle(ctx, startX, startY, realX);
                }else if(currSelectedShape === "Diamond"){
                    ctx.save()
                    ctx.setTransform(1, 0, 0, 1, 0, 0);  
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.restore()
                    drawDiamond(ctx, startX, startY, realX, realY);
                }else if(currSelectedShape === "Arrow"){
                    ctx.save()
                    ctx.setTransform(1, 0, 0, 1, 0, 0);  
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.restore()
                    drawArrow(ctx, startX, startY, realX, realY)
                }else if(currSelectedShape === "Pan"){
                    setTranslatePos((oldPos)=> ({x: oldPos.x + (e.clientX - startDrag.x)*0.1, y: oldPos.y + (e.clientY - startDrag.y)*0.1}))
                    //trigger a state
                    // setRedraw((prev)=>!prev);
                }
                ctx.restore();
            }
        }
        canvas.addEventListener('mousemove', mouseMoveHandler)

        const mouseUpHandler = (e: MouseEvent)=>{
            setPanning(false)
            endX = (e.clientX - rect.left - translatePos.x) / scale;
            endY = (e.clientY - rect.top - translatePos.y) / scale;
            // endX = e.clientX
            // endY = e.clientY 
            let newEntryInChat: any = {};
            let someShapeWasMade = false;

            ctx.save();
            ctx.translate(translatePos.x, translatePos.y);
            ctx.scale(scale, scale);
            if(currSelectedShape === "Rectangle"){
                ctx.save()
                ctx.setTransform(1, 0, 0, 1, 0, 0);  
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore()
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
                ctx.save()
                ctx.setTransform(1, 0, 0, 1, 0, 0);  
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore()
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
                ctx.save()
                ctx.setTransform(1, 0, 0, 1, 0, 0);  
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore()
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
                ctx.save()
                ctx.setTransform(1, 0, 0, 1, 0, 0);  
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore()
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
            ctx.restore();
            
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

    }, [socket, loading, currSelectedShape, id, scale])

    

    // useEffect(()=>{
    //     const handleResize = ()=>{
    //         const canvas = canvasRef.current;
    //         if(canvasRef.current){
    //             const ctx = canvas.getContext('2d');
    //             ctx?.save();
    //             const canvas = canvasRef.current;
    //             canvas.width = window.innerWidth;
    //             canvas.height = window.innerHeight;
    //             ctx?.restore();
    //         }
    //     }
    //     window.addEventListener('resize', handleResize);
    //     return ()=>{
    //         window.removeEventListener('resize', handleResize);
    //     }
    // }, [])

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
        const resp = response.data.answer.match(/\[\s*{[\s\S]*?}\s*\]/)

        // const ans = JSON.parse(response.data.answer)
        const ans = JSON.parse(resp)
        //send to socket:
        ans.map((val:any)=>{

            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: val
            }))
            //transaction in db: so that all of these shapes should be saved otherwise none of it should be?
        })

        //one by one add all of them to drawingChats[ ]
        ans.map((val:any)=>{setDrawingChats((oldVal)=> [...oldVal, {...val}])})
        return;
        }catch(e){
            console.log("Error in getting the diagram generated: ", e)
        } 
    }

    const generateOnClickHandler = async ()=>{
        setStartAiInput(false);
        if(aiInput && ctxInput && xInput && yInput){
            setCurrSelectedShape("Pointer");
            setAiAnswerGenerating(true);
            try{
                await generateDiagramHandler(ctxInput, xInput, yInput, aiInput);
            }catch(e: any){
                alert("Some error occured.")
                console.log("Error here in button click handler ", e.message);
            }
        }
        setAiInput("");
        setXInput(null);
        setYInput(null);
        setCtxInput(null);
        setAiAnswerGenerating(false);
        //also add it in drawingChats[] and socket.send()
        //maybe create new DB table for this
    }

    return (
        <div className={`overflow-hidden h-full w-full ${currSelectedShape=="Pan"? ("cursor-grab"):("")} ${(currSelectedShape=="Pan" && panning)? ("cursor-grabbing"):("")} ${(currSelectedShape=="Rectangle" || currSelectedShape=="Circle" || currSelectedShape=="Diamond" || currSelectedShape=="Arrow" )? ("cursor-crosshair"):("")}`}>
            {/* {drawingChats.map((val, idx)=>{
                return (<div style={{color: 'red'}} key={idx}>
                    {val.message}
                </div>)
            })} */}

            <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}
            style={{"backgroundColor": "black", "margin": 0, "padding": 0, "display": "block" , position: 'absolute', top: 0, left: 0, zIndex: 0, height: '100vh', width: '100vw' }} >
            </canvas>
            {startInputTaking && xInput && yInput && <input value={ inputText } onChange={(e)=>{ setInputText(e.target.value)}} onKeyDown={(e)=>{
                if(e.key === 'Enter'){
                    if(ctxInput && xInput && yInput){
                        ctxInput.fillStyle = "white"
                        ctxInput.font = "16px serif";
                        ctxInput.fillText(inputText, xInput, yInput+10);
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
            }} style={{position: 'absolute', top: yInput, left: xInput,backgroundColor: "transparent", border: "none", outline: "none", color: "white", caretColor: "white", fontSize: "16px" }} ref={inputRef} className="caret-white"> 
            </input>}

            <span style={{display: 'flex', flexDirection: 'column', position: 'absolute', top: 100, left: 0, zIndex: 10}}>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center py-[2px] rounded-md w-full h-full items-center flex justify-center  px-1 ${currSelectedShape=="Pointer"? ("bg-gray-900/90"):("")}`}>
                    <button className={` text-white`} id='Pointer' onClick={()=>{setCurrSelectedShape("Pointer")}}><MousePointer/></button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[3px]  px-1 ${currSelectedShape=="Pan"? ("bg-gray-900/90"):("")} `}>
                <button id='Pan' className="text-white" onClick={()=>{setCurrSelectedShape("Pan")}}><Hand/></button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[3px]  px-1 ${currSelectedShape=="Rectangle"? ("bg-gray-900/90"):("")}`}>
                <button id='Rectangle' className="text-white" onClick={()=>{setCurrSelectedShape("Rectangle")}}><RectangleHorizontal/></button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px]  px-1 ${currSelectedShape=="Circle"? ("bg-gray-900/90"):("")}`}>
                <button id='Circle' className="text-white" onClick={()=>{setCurrSelectedShape("Circle")}}><Circle/></button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px]  px-1 ${currSelectedShape=="Diamond"? ("bg-gray-900/90"):("")}`}>
                <button id='Diamond' className="text-white" onClick={()=>{setCurrSelectedShape("Diamond")}}><Diamond/></button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px]  px-1 ${currSelectedShape=="Arrow"? ("bg-gray-900/90"):("")}`}>
                <button id='Arrow' className="text-white" onClick={()=>{setCurrSelectedShape("Arrow")}}><ArrowUp/></button>
                </span>
                </span>

                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px]  px-1 ${currSelectedShape=="Text"? ("bg-gray-900/90"):("")}`}>
                <button id='Text' className="text-white" onClick={()=>{
                    setCurrSelectedShape("Text")}}>
                    <ALargeSmall/>
                </button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className={`bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px]  px-1 ${currSelectedShape=="AI"? ("bg-gray-900/90"):("")}`}>
                <button id='AI' className="text-white font-bold" onClick={()=>{setCurrSelectedShape("AI")}}>AI</button>
                </span>
                </span>
                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className="bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px] px-1">
                <button id="ZoomIn" className="text-white" onClick={()=>{
                    const scl = scale/scaleMultiplier;
                    setScale(scl);
                    //draw again: the appropriate useEffect is getting triggered to run again
                }}><Plus/></button>
                </span>
                </span>

                <span className="p-[2px] rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 text-center inline-block mb-3 ml-3">
                <span className="bg-gray-900/60 text-center rounded-md w-full h-full items-center flex justify-center py-[2px]  px-1">
                <button id="ZoomOut" className="text-white" onClick={()=>{
                    const scl = scale*scaleMultiplier;
                    setScale(scl);
                }}><Minus/></button>
                </span>
                </span>
            </span>
            {startAiInput && <div style={{display: 'flex', flexDirection: 'row', position: 'absolute', left: '50vw', top: '50vh'}}>
                <input autoFocus={true} className="caret-white text-white p-2 focus:outline-none focus:ring-0 border border-blue-700 translate(-50%, -50%)" value={aiInput} onChange={(e)=>{setAiInput(e.target.value)}} placeholder="Add you text here" onKeyDown={(e)=>{ 
                    if(e.key == "Enter"){
                        generateOnClickHandler();
                    }
                    }}></input>
                <button className="text-white font-bold  border bg-blue-700 p-2 rounded-r-md border-blue-700" onClick={generateOnClickHandler}>Generate</button>
            </div>
            }
            {aiAnswerGenerating && <div className="text-3xl translate(-50%, -50%) items-center justify-centera" style={{display: 'flex', position: 'absolute', top: '50vh', left: '50vw', color: 'white'}}>Generating <span className="inline-block w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"/></div>}

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