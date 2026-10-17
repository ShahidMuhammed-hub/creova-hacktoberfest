import { XMLParser } from "fast-xml-parser";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Import modular backend routers
import { projectsRouter } from "./server/routes/projects.routes.ts";
import { ideasRouter } from "./server/routes/ideas.routes.ts";
import { scriptsRouter } from "./server/routes/scripts.routes.ts";
import { researchRouter } from "./server/routes/research.routes.ts";
import { localizationRouter } from "./server/routes/localization.routes.ts";
import { publishingRouter } from "./server/routes/publishing.routes.ts";
import { analyticsRouter } from "./server/routes/analytics.routes.ts";
import { tasksRouter } from "./server/routes/tasks.routes.ts";
import { integrationsRouter } from "./server/routes/integrations.routes.ts";
import { aiService } from "./server/services/ai.service.ts";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

app.get("/api/news", async (req, res) => {
  const queries: Record<string, string> = {
    "AI & Technology": "artificial intelligence technology",
    Food: "food restaurants India",
    Travel: "travel tourism India",
    Education: "education India",
    Gaming: "gaming esports",
    Fashion: "fashion India",
    Business: "business startups India",
  };

  const niche =
    typeof req.query.niche === "string" ? req.query.niche : "AI & Technology";

  const query = queries[niche];

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Choose a supported niche.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const url =
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(query + " when:7d") +
      "&hl=en-IN&gl=IN&ceid=IN:en";

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/rss+xml, application/xml" },
    });

    if (!response.ok) {
      throw new Error(`News provider returned ${response.status}`);
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: false,
    });

    const feed = parser.parse(xml);

    if (!feed?.rss?.channel) {
      throw new Error("The provider did not return a valid news feed.");
    }

    const raw = feed.rss.channel.item || [];
    const items = Array.isArray(raw) ? raw : [raw];

    const articles = items
      .map((item: any) => {
        const title = String(item.title || "").trim();
        const link = String(item.link || "").trim();

        let safeLink = "";
        try {
          const parsed = new URL(link);
          if (parsed.protocol === "https:") safeLink = parsed.href;
        } catch {
          // Skip invalid article URLs.
        }

        return {
          title,
          link: safeLink,
          source:
            typeof item.source === "string"
              ? item.source
              : String(item.source?.["#text"] || "News source"),
          publishedAt: String(item.pubDate || ""),
        };
      })
      .filter((item: any) => item.title && item.link)
      .slice(0, 6);

    res.json({
      success: true,
      articles,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "News feed error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    res.status(502).json({
      success: false,
      error:
        "News is temporarily unavailable. Retry or use the news search links.",
    });
  } finally {
    clearTimeout(timeout);
  }
});

// Legacy AI endpoint for backward compatibility with frontend
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction, model } = req.body;
    const result = await aiService.generateContent(
      prompt,
      systemInstruction,
      model,
    );
    res.json({
      success: true,
      text: result.text,
      simulated: result.simulated,
      model: result.model,
    });
  } catch (error: any) {
    console.error("AI generation error:", error);
    res
      .status(500)
      .json({ success: false, error: error.message || "AI generation failed" });
  }
});

// Mount Versioned REST API v1 Endpoints
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/ideas", ideasRouter);
app.use("/api/v1/scripts", scriptsRouter);
app.use("/api/v1/research", researchRouter);
app.use("/api/v1/localizations", localizationRouter);
app.use("/api/v1/publishing", publishingRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/integrations", integrationsRouter);

async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== "true" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(
      `CREOVA complete modular backend running at http://0.0.0.0:${PORT}`,
    );
  });
}

startServer();
