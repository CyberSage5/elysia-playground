import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { StringOutputParser } from "langchain/schema/output_parser";

export const embeddingModel = new OpenAIEmbeddings()



const collectionName = 'documents';

export const getQdrantClient = () => {

  return new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });
};


const template = `You are a helpful assistant who generates comma separated lists.
A user will pass in a category, and you should generate 5 objects in that category in a comma separated list.
ONLY return a comma separated list, and nothing more.`;

const humanTemplate = "{text}";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", humanTemplate],
]);

const model = new ChatOpenAI({
  streaming: true
});
const parser = new StringOutputParser();

const chain = chatPrompt.pipe(model).pipe(parser);

export async function getAIResponse(text: string) {
  let start = new Date()
  let result = ""

  const stream = await chain.invoke({
    text
  });

  let firstChunkReceived = false;

  for await (const chunk of stream) {
    if (!firstChunkReceived) {
      const stop = new Date();
      console.log('Time to receive first chunk:', stop.getTime() - start.getTime(), 'ms');
      firstChunkReceived = true;
    }
    result += chunk
  }

  return result
}
