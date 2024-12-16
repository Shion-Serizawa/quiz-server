import { Application } from "@oak/oak";
import { router } from "/router.js";
import { oakCors } from "cors/mod.ts";

const app = new Application({
  // see: https://github.com/oakserver/oak/blob/main/examples/cookieServer.ts
  ...(Deno.env.get("COOKIE_SECRET_KEY")
    ? { keys: [Deno.env.get("COOKIE_SECRET_KEY")] }
    : {}),
});

app.use(oakCors({
  origin: "https://seri-quiz-web-38.deno.dev",
  credentials: true,
}));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
