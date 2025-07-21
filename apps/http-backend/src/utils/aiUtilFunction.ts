import {Mistral} from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});
// const sysPrompt = "You will be provided with a paragraph of text, you need to understand that text and create a diagram for it. This diagram could look like a flow chart to explain the whole text. You can use Rectangles, Circles, Diamonds, Arrows and Text to create this diagram. You will return me an array of objects, each of these objects represents each shape in the diagram. Along with text you will be given a 'XCoordinate' and 'YCoordinate', which will be the starting point(i.e. startX and startY) for our first shape in the array. An object for a rectangle will look like: {'shapeName': 'Rectangle', 'startX: startX, 'startY': startY, 'endX': endX, 'endY': endY}. Here startX, startY, sendX and endY all are Integers, which represent a point on canvas. For Circle this object is like: {'shapeName': 'Circle', 'startX': startX, 'startY': startY, 'endX': endX, 'endY': endY}. For diamond this object looks like this: {'shapeName': 'Diamond', 'startX': startX, 'startY': startY, 'endX': endX, 'endY': endY}. For Arrow this object looks like this: {'shapeName': 'Arrow', 'startX': startX, 'startY': startY, 'endX': endX, 'endY': endY}. For Text this object looks like this {'shapeName': 'Text', 'startX': xInput, 'startY': yInput, 'endX': xInput, 'endY': yInput, 'text': inputText}. Just keep the endX and endY same as startX and startY for shapeName='Text'. Remember the text size is 16 pixels. And just send me the array, do not send any other text along with it. Use double quotes to wrap the Keys and strings. Make sure the shapes encloses the text fully, make sure the shapes are big enough to enclose the text fully. You can break the text as two different objects if it is too long. Make sure to include different shapes to create the diagram."

const sysPrompt = `You will be provided with a paragraph of text. Your task is to understand the logical flow of that paragraph and convert it into a diagram represented as an array of shape objects. Each object describes a shape that visually represents part of the logic. Supported shapes are: - Rectangle: Used for processes or actions - Circle: Used for start/end points - Diamond: Used for decisions (this is rendered as a rotated rectangle, see special note below) - Arrow: Used to indicate the flow from one shape to another - Text: Used to insert readable labels in the diagram. Each shape object must include: - 'shapeName': one of 'Rectangle', 'Circle', 'Diamond', 'Arrow', or 'Text' - 'startX', 'startY', 'endX', 'endY': integers defining the shape's position - For 'Text', include an additional field: 'text': inputText. Start your layout from the given (startX, startY) coordinate, and arrange shapes vertically or horizontally with appropriate spacing. Maintain consistent shape sizes that fully enclose the text (assuming text size = 16px, break long text into multiple Text objects if needed). Special Diamond Note: To draw a diamond, we rotate a rectangle by 45° around its center. You must provide coordinates (startX, startY, endX, endY) such that the rotated shape remains readable and proportionate. This is the diamond rendering logic we are using: "
// Your canvas frontend logic:
const centerX = ((endX - startX) / 2) + startX;
const centerY = ((endY - startY) / 2) + startY;
ctx.translate(centerX, centerY);
ctx.rotate(Math.PI / 4); // 45 degrees
ctx.translate(-centerX, -centerY);
ctx.roundRect(startX, startY, endX - startX, endY - startY, [4, 4, 4, 4]);". 
Special Arrow Note: Arrow must start at the center-bottom of the previous shape and end at the center-top of the next shape.
Example Object Structures: - Rectangle: { \"shapeName\": \"Rectangle\", \"startX\": 100, \"startY\": 100, \"endX\": 250, \"endY\": 150 } - Circle: { \"shapeName\": \"Circle\", \"startX\": 100, \"startY\": 100, \"endX\": 180, \"endY\": 180 } - Diamond: { \"shapeName\": \"Diamond\", \"startX\": 100, \"startY\": 100, \"endX\": 200, \"endY\": 200 } - Arrow: { \"shapeName\": \"Arrow\", \"startX\": 150, \"startY\": 150, \"endX\": 150, \"endY\": 250 } - Text: { \"shapeName\": \"Text\", \"startX\": 120, \"startY\": 120, \"endX\": 120, \"endY\": 120, \"text\": \"Start Process\" } Output only the array of objects — no extra explanation. All text must fit cleanly inside the shapes, and you can split long text into multiple lines or multiple text objects if necessary. Use a variety of shapes logically to best express the flow and decisions in the input paragraph. Just send an array, do not send any text before or after it. Also, make the shapes big enough to fully encapsulate the text, it is okay if sahpe is bigger than needed but the text should not flow out of the shapes.
Example Output: [{ "shapeName": "Circle", "startX": 150, "startY": 50, "endX": 230, "endY": 130 }, { "shapeName": "Text", "startX": 165, "startY": 90, "endX": 165, "endY": 90, "text": "Start" }, {"shapeName": "Arrow","startX": 190,"startY": 130,"endX": 190,"endY": 160}, {"shapeName": "Rectangle","startX": 110,"startY": 160,"endX": 270,"endY": 200
  },
  {"shapeName": "Text","startX": 130,"startY": 180,"endX": 130,"endY": 180,"text": "Enter your age"
  },
  {"shapeName": "Arrow","startX": 190,"startY": 200,"endX": 190,"endY": 240
  },
  {"shapeName": "Diamond","startX": 130,"startY": 240,"endX": 250,"endY": 360
  },
  {"shapeName": "Text","startX": 145,"startY": 290,"endX": 145,"endY": 290,"text": "Age > 18?"
  },
  { "shapeName": "Arrow", "startX": 190, "startY": 360, "endX": 190, "endY": 400
  },
  { "shapeName": "Rectangle", "startX": 110, "startY": 400, "endX": 270, "endY": 440
  },
  { "shapeName": "Text", "startX": 130, "startY": 420, "endX": 130, "endY": 420, "text": "You can vote"
  },
  {"shapeName": "Arrow","startX": 190,"startY": 440,"endX": 190,"endY": 480
  },
  {"shapeName": "Circle","startX": 150,"startY": 480,"endX": 230,"endY": 560
  },
  {"shapeName": "Text","startX": 165,"startY": 520,"endX": 165,"endY": 520,"text": "End"
  }
] 
  Once again, just send an array, do not add anything before or after it, do not make it a string or wrap in quotes or backticks
  `



export const chatResponse = async(message: string)=>{
    try{
        const response = await client.chat.complete({
            model: 'codestral-latest',
            messages: [{role: 'system', content: sysPrompt}, {role: 'user', content: message}]
        })
        console.log("Response structure", response.choices[0]?.message.content)
        return response.choices[0]?.message.content;
    }catch(e: any){
        return new Error("Unable to generate answer ", e.message);
    }
    
}

// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// export const chatResponse = async (message: string)=>{
//     try{
//         const completion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "system",
//                     content: sysPrompt
//                 },
//                 {
//                     role: "user",
//                     content: message,
//                 },
//             ],
//             model: "llama-3.3-70b-versatile",
//         });
//         console.log(completion.choices[0]?.message.content);
//         return completion.choices[0]?.message?.content;
//     }catch(err: any){
//         console.log("Groq err", err);
//         throw new Error(`Something went wrong while generating answer from Groq , ${err.message}`);
//     }
// }
