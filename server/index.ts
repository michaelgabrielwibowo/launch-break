import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { createApp } from "./app";
import { env } from "./env";

const PORT = env.PORT;

async function startServer() {
  const app = createApp();

  if (env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Academic Workspace Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
