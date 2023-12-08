import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { embeddingModel, getQdrantClient } from "./langhain-demo";

const client = getQdrantClient()

export async function ingest(url: string) {
    try {
        const loader = new CheerioWebBaseLoader(url);
        const docs = await loader.load();

        await Bun.write("/docs.json", JSON.stringify(docs, null, 2))

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