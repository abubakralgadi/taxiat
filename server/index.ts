import fs from "node:fs";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { visualizeErrorHandler, visualizeRoute } from "./visualize";

// Load .env automatically if available
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
} catch {
  // Ignore error if env loading fails
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.post("/api/visualize", visualizeRoute);
  app.use(visualizeErrorHandler);

  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_request, response) => response.sendFile(path.join(staticPath, "index.html")));

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

startServer().catch(console.error);
