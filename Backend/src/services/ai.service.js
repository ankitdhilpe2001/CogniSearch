import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage, SystemMessage, AIMessage} from "langchain"
import {ChatMistralAI} from "@langchain/mistralai"

//gemini model
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey:process.env.GEMINI_API_KEY,
});

//Mistral Model
const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey:process.env.MISTRAL_API_KEY,
    temperature: 0,
});

//invoks chat model with client message 
export async function generateResponse(messages){
    const res = await geminiModel.invoke(messages.map(msg =>{
        if(msg.role == "user"){
            return new HumanMessage(msg.content);
        }else if(msg.role == "assistant" ){
            return new AIMessage(msg.content);
        }
        return null;
    }).filter(Boolean));

    return res.text;
}

// You can use a system message to set the tone, define the model’s role, and establish guidelines for responses
//  System message - Tells the model how to behave and provide context for interactions

export async function generateChatTitle(message){
    const res = await mistralModel.invoke([
        new SystemMessage(`You are helpful assistant that generates concise descriptive titles for chat conversation
            User will provide you with the first message of a chat conversation and you will generate a title that 
            captures the essence of the converstation 4-5 words. the title should be clear, relevant, engaging giving users 
            the quick understanding of the chat's topic `),
            new HumanMessage(`Generate the title for the chat based on the following first message:"${message}"`)
    ])

    return res.text;
}