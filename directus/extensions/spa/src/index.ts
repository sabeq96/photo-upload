import { defineEndpoint } from "@directus/extensions-sdk";
import path from "node:path";
import serveStatic from "serve-static";

const spaDir = path.join(import.meta.dirname, "../../spa-dist");

export default defineEndpoint((router) => {
  // router.get('/', (_req, res) => res.send('Hello, World!'));
  router.use(serveStatic(spaDir));

  router.get("*", (req, res) => {
    console.log("im here", spaDir);

    res.sendFile(path.join(spaDir, "index.html"));
  });
});
