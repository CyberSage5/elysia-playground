import { Elysia } from "elysia";
import { getAIResponse } from "./langhain-demo";
import { ingest } from "./ingest";

const PORT = process.env.PORT || 3000

const app = new Elysia()


app.get("/", ({ query: { text }, set }) => {

  if (!text) {
    return new Response(JSON.stringify({ message: "Must provide text" }), { status: 400 })
  }

  return getAIResponse(text)

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


app.listen(PORT);

console.log(
  `🦊 Elysia is now running at ${app.server?.hostname}:${app.server?.port}`
);