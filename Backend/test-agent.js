import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "langchain";
import { ToolMessage } from "@langchain/core/messages";
import { tool } from "langchain";
import * as z from "zod";
import "dotenv/config";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const searchInternetTool = tool(
  async ({ query }) => {
    console.log("TOOL CALLED:", query);
    return "The weather in sf is 65 degrees and sunny.";
  },
  {
    name: "search_internet",
    description: "Search the internet for up-to-date information.",
    schema: z.object({
      query: z.string().describe("Search query"),
    }),
  }
);

const modelWithTools = geminiModel.bindTools([searchInternetTool]);

async function run() {
  const messages = [new HumanMessage("What is the weather in sf?")];
  const stream = await modelWithTools.stream(messages);

  let toolCalls = [];

  for await (const chunk of stream) {
    if (chunk.tool_calls && chunk.tool_calls.length > 0) {
      toolCalls = toolCalls.concat(chunk.tool_calls);
    }
  }

  console.log("TOOL CALLS:", JSON.stringify(toolCalls, null, 2));

  if (toolCalls.length > 0) {
    messages.push(new AIMessage({ content: "", tool_calls: toolCalls }));
    for (const t of toolCalls) {
      const res = await searchInternetTool.invoke(t.args);
      messages.push(new ToolMessage({ content: res, tool_call_id: t.id, name: t.name }));
    }

    const stream2 = await modelWithTools.stream(messages);
    for await (const chunk of stream2) {
      process.stdout.write(chunk.content);
    }
  }
}
run();
