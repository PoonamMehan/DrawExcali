import {Mistral} from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});



export const chatResponse = async(message: string)=>{
    try{
        const response = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [{role: 'system', content: "You will be provided with a paragraph of text, you need to understand that text and create a diagram for it. This diagram could look like a flow chart to explain the whole text. You can use Rectangles, Circles, Diamonds, Arrows and Text to create this diagram. You will return me an array of objects, each of these objects represents each shape in the diagram. Along with text you will be given a 'XCoordinate' and 'YCoordinate', which will be the starting point(i.e. startX and startY) for our first shape in the array. An object for a rectangle will look like: {'shapeName': 'Rectangle', 'startX: startX, 'startY': startY, 'endX': endX, 'endY': endY}. Here startX, startY, sendX and endY all are Integers, which represent a point on canvas. For Circle this object is like: {'shapeName': 'Circle', 'startX': startX, 'startY': startY, 'endX': endX, 'endY': endY}. For diamond this object looks like this: {'shapeName': 'Diamond', 'startX': startX, 'startY': startY, 'endX': endX, 'endY': endY}. For Arrow this object looks like this: {'shapeName': 'Arrow', 'startX': startX, 'startY': startY, 'endX': endX, 'endY': endY}. For Text this object looks like this {'shapeName': 'Text', 'startX': xInput, 'startY': yInput, 'endX': xInput, 'endY': yInput, 'text': inputText}. Just keep the endX and endY same as startX and startY for shapeName='Text'. Remember the text size is 20 pixels. And just send me the array, do not send any other text along with it. Use double quotes to wrap the Keys and strings. Make sure the shapes encloses the text fully, make sure the shapes are big enough to enclose the text fully. You can break the text as two different objects if it is too long. Make sure to include different shapes to create the diagram."}, {role: 'user', content: message}]
        })
        console.log("Response structure", response.choices[0]?.message.content)
        return response.choices[0]?.message.content;
    }catch(e: any){
        return new Error("Unable to generate answer ", e.message);
    }
    
}
