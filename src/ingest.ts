import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { embeddingModel, getQdrantClient } from "./langhain-demo";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";



const client = getQdrantClient()

export async function ingest(url: string) {

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 10,
      });

    try {
        const loader = new CheerioWebBaseLoader(url);
        const page = await loader.load();

        const docs  = await splitter.splitDocuments(page)

        await Bun.write("docs.json", JSON.stringify(docs, null, 2))

        await QdrantVectorStore.fromDocuments(docs, embeddingModel, {
            client,
            url: process.env.QDRANT_URL,
            collectionName: 'documents',
        })
    } catch (error) {
        console.log("Error occured", error);
        // @ts-ignore
        throw new Error(error)
    }




}