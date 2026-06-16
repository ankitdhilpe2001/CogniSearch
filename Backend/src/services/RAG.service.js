import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { ChatMistralAI } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFParse } from "pdf-parse";
import fs from "fs";
import { randomUUID } from "crypto";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const Index = pc.index("cognisearch");


// Ingestion pipleine

export async function uploadFileToRAG(file, userId) {

  const fileBuffer = file.buffer;

  const fileId = randomUUID();

  const parser = new PDFParse({
    data: fileBuffer,
  });

  const data = await parser.getText();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitText(data.text);

  const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed",
  });

  const vectors = await embeddings.embedDocuments(chunks);

  const records = chunks.map((chunk, i) => ({
    id: `${fileId}-${i}`,
    values: vectors[i],
    metadata: {
      text: chunk,
      userId,
      fileId,
      fileName:file.originalname,
      chunkIndex:i
    },
  }));

  await Index.upsert({
    records,
  });

  return {
    fileId,
    chunksStored: records.length,
  };
}

//Retrieval Pipeline
export async function retrieveRelevantChunks(query, userId, topk=5){
  
  const embeddings = new MistralAIEmbeddings({
    apiKey:process.env.MISTRAL_API_KEY,
    model:'mistral-embed',
  })

  const queryEmbeddings = await embeddings.embedQuery(query);
  
  const results = await Index.query({
    vector:queryEmbeddings,
    topK: topk,
    includeMetadata:true,
    filter:{
      userId,
    }
  })

  return results.matches.map(match => ({
  text: match.metadata?.text,
  score: match.score,
  fileId: match.metadata?.fileId,
  fileName: match.metadata?.fileName,
}));
}


//Augmentation 
export async function answerQuestion(query, userId) {
  const docs = await retrieveRelevantChunks(
    query,
    userId
  );

  const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-large-latest",
})

  const context = docs
    .map(doc => doc.text)
    .join("\n\n");

  const response = await model.invoke(`
  You are a helpful assistant.
  Answer only from the provided context.
  If the answer is not present, say "I don't know".
  Context:
  ${context}

  Question:
  ${query}`);
  return response.content;
}