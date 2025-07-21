import { start } from "repl";

export function drawRectangle(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number){
    ctx.strokeRect(startX, startY, endX-startX, endY-startY);
}

export function drawCircle(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number){
    ctx.beginPath()
    ctx.arc(startX, startY, Math.abs(startX-endX), 0, 2*Math.PI);
    ctx.closePath();
    ctx.stroke();
}

export function drawDiamond(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number){
    const centerX = ((endX-startX)/2)+startX;
    const centerY = ((endY-startY)/2)+startY;

    ctx.save()

    ctx.translate(centerX, centerY);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    ctx.beginPath()
    ctx.roundRect(startX, startY, (endX-startX), (endY-startY), [4, 4, 4, 4])
    ctx.closePath()
    ctx.stroke()
    ctx.restore();
}

export function drawArrow(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number){
    const x = endX;
    const y = endY;

    const headLength = 20;
    const angle = Math.atan2(endY - startY, endX - startX);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineTo(
    x - headLength * Math.cos(angle - Math.PI / 6),
    y - headLength * Math.sin(angle - Math.PI / 6)
    );

    ctx.moveTo(x, y);
    ctx.lineTo(
    x - headLength * Math.cos(angle + Math.PI / 6),
    y - headLength * Math.sin(angle + Math.PI / 6)
    );

    ctx.stroke();
}

export function drawText(ctx: CanvasRenderingContext2D, startX: number, startY: number, text: string){
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white";
    ctx.font = "16px serif";
    ctx.fillText(text, startX, startY+10);
}