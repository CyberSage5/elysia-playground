import { Elysia } from "elysia";
import { getAIResponse } from "./langhain-demo";

const PORT = process.env.PORT || 3000

const app = new Elysia().get("/", () => getAIResponse()).listen(PORT);

console.log(
  `🦊 Elysia is now running at ${app.server?.hostname}:${app.server?.port}`
);