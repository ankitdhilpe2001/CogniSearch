import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const aiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
})

