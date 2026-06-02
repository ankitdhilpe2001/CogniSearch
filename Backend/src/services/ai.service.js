import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import { searchInternet } from "./internet.service.js";
import * as z from "zod";


//gemini model
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

//Mistral Model
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0,
});

// Tool for searching the internet when the answer needs current information.
const searchInternetTool = tool(
  async ({ query }) => searchInternet({ query }),
  {
    name: "search_internet",
    description: "Search the internet for up-to-date information.",
    schema: z.object({
      query: z.string().describe("Search query"),
    }),
  }
);

// The agent can decide when to call the tool, but the prompt makes the rule explicit.
const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

// Invokes the chat model with the conversation history.
//This function is used in backend in sendMessage controller.
export async function generateResponse(messages) {
  const res = await agent.invoke({
    messages: [
      new SystemMessage(
        [
          "You are a helpful, precise assistant.",
          "Use `search_internet` whenever the user asks for current, latest, recent, live, or time-sensitive information.",
          "Always prefer the search tool for news, prices, stock data, weather, schedules, releases, and anything that could have changed.",
        ].join(" ")
      ),
      ...messages.map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        }
        if (msg.role === "assistant") {
          return new AIMessage(msg.content);
        }
        return null;
      }).filter(Boolean),
    ],
  });

  return res.messages[res.messages.length - 1].text;
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
