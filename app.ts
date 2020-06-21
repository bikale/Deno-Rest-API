import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./route.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

const port = Deno.env.get("PORT") || 5000;
console.log(`Server running on http://localhost:${port} 🦕`);
await app.listen({ port: +port });
