import { Elysia, t } from "elysia";
import { getAIResponse } from "./langhain-demo";
import { ingest } from "./ingest";
import { getHtmlContent } from "./utils";
import { queryAI } from "./query";

const PORT = process.env.PORT || 3000

const app = new Elysia()


app.get("/", async () => {
  const htmlContent: string = await getHtmlContent();

  return new Response(htmlContent, { headers: { 'Content-Type': 'text/html' } })
})


app.post("/ingest", async ({ query: { url } }) => {

  if (!url) {
    return new Response(JSON.stringify({ message: "Must provide url" }), { status: 400 })
  }

  try {
    await ingest(url)
    return { status: "OK" }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
})


app.get("/test", ({ query: { text } }) => {

  if (!text) {
    return new Response(JSON.stringify({ message: "Must provide text" }), { status: 400 })
  }

  return getAIResponse(text)
})

app.get("/query", ({ query: { q } }) => {
  if (!q) {
    return new Response(JSON.stringify({ message: "Must provide question" }), { status: 400 })
  }

  return queryAI(q)

})

app.post('/upload', ({ body: { file } }) => file, {
  body: t.Object({
    file: t.File()
  })
})


app.listen(PORT);

console.log(
  `🦊 Elysia is now running at ${app.server?.hostname}:${app.server?.port}`
);