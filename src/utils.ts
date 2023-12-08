import { readFile } from "fs/promises";
import path from "path";
import { embeddingModel, getQdrantClient } from "./langhain-demo";

export async function getHtmlContent(): Promise<string> {
    try {
        const htmlFilePath: string = path.join(import.meta.dir + '/index.html');
        const htmlContent: string = await readFile(htmlFilePath, 'utf-8');
        return htmlContent;
    } catch (error) {
        console.error('Error reading HTML file:', error);
        throw error;
    }
}

interface VectorRes {
    embedding: number[];
}

interface Metadata {
    source?: string;
}

interface DocPayload {
    content?: string;
    metadata?: Metadata;
}



export async function getRelevantDocs(query: string): Promise<string> {
    const client = getQdrantClient();

    try {
        const vector = await embeddingModel.embedQuery(query)

        const docs = await client.search('documents', {
            params: {
                hnsw_ef: 128,
                exact: false,
            },
            vector,
            limit: 4,
        });

        const concatenatedString: string = docs.reduce((acc, doc) => {
            const { content, metadata }: DocPayload = doc.payload ?? {};
            const source: string | undefined = metadata?.source;

            const documentString: string = (content ?? "") + (source ? `source - ${source}` : "");

            return acc + documentString;
        }, "");

        return concatenatedString;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

