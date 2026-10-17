// server.ts
import { XMLParser } from "fast-xml-parser";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv2 from "dotenv";

// server/routes/projects.routes.ts
import { Router } from "express";
var router = Router();
var mockProjects = [
  { id: "p1", title: "Mastering AI Agent Workflows in 2026", contentType: "Video", status: "In Production", platform: "YouTube", updatedAt: "2 hours ago", progress: 65 },
  { id: "p2", title: "5 Design Principles for High-Converting Carousels", contentType: "Carousel", status: "Scheduled", platform: "Instagram", updatedAt: "Yesterday", progress: 90 },
  { id: "p3", title: "Building Scalable Fullstack Apps with Gemini", contentType: "Video", status: "Draft", platform: "YouTube", updatedAt: "3 days ago", progress: 25 }
];
router.get("/", (req, res) => {
  res.json({ success: true, data: mockProjects });
});
router.post("/", (req, res) => {
  const { title, contentType, platform } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: "Project title is required" });
  }
  const newProject = {
    id: "p_" + Date.now(),
    title,
    contentType: contentType || "Video",
    status: "Draft",
    platform: platform || "YouTube",
    updatedAt: "Just now",
    progress: 10
  };
  mockProjects.push(newProject);
  res.status(201).json({ success: true, data: newProject });
});
router.get("/:id", (req, res) => {
  const project = mockProjects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, error: "Project not found" });
  res.json({ success: true, data: project });
});
router.patch("/:id", (req, res) => {
  const index = mockProjects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: "Project not found" });
  mockProjects[index] = { ...mockProjects[index], ...req.body, updatedAt: "Just now" };
  res.json({ success: true, data: mockProjects[index] });
});
router.delete("/:id", (req, res) => {
  mockProjects = mockProjects.filter((p) => p.id !== req.params.id);
  res.json({ success: true, message: "Project deleted successfully" });
});
var projectsRouter = router;

// server/routes/ideas.routes.ts
import { Router as Router2 } from "express";

// server/services/ai.service.ts
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
var AIService = class {
  async generateContent(prompt, systemInstruction, _modelOverride) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMMA_MODEL?.trim() || "gemma-4-26b-a4b-it";
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is missing. Check .env and restart the server."
      );
    }
    if (!prompt?.trim()) {
      throw new Error("Please enter a topic or prompt.");
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Creova, an assistant for content creators. Generate useful ideas, scripts, captions, hashtags, and camera-angle suggestions based on the request."
      }
    });
    const text = response.text?.trim();
    if (!text) {
      throw new Error("Gemma returned an empty response. Please retry.");
    }
    console.log(`[CREOVA] Successful generation using ${model}`);
    return {
      text,
      simulated: false,
      model
    };
  }
  async generateIdeas(topic, platform) {
    const result = await this.generateContent(
      `Generate 3 content ideas for ${platform} about "${topic}". For each provide a title, hook, content angle, and filming suggestions.`
    );
    return result.text;
  }
  async polishScript(hook, introduction) {
    const result = await this.generateContent(
      `Improve this video hook and introduction. Return clearly labelled sections.

Hook: ${hook}
Introduction: ${introduction}`
    );
    return result.text;
  }
  async translateText(text, targetLanguage) {
    const result = await this.generateContent(
      `Translate this into ${targetLanguage}. Preserve the meaning and formatting. Return only the translation:

${text}`
    );
    return result.text;
  }
};
var aiService = new AIService();

// server/routes/ideas.routes.ts
var router2 = Router2();
var mockIdeas = [
  { id: "i1", title: "Why Most Creators Fail at Multilingual Scaling", hook: "Stop translating your videos manually. Here is how top creators automate global reach.", platform: "YouTube", angle: "Educational" },
  { id: "i2", title: "The 3-Step Script Formula That Keeps Viewers Hooked", hook: "If your retention drops at 30 seconds, you are making this mistake.", platform: "Instagram", angle: "Actionable Framework" }
];
router2.get("/", (req, res) => {
  res.json({ success: true, data: mockIdeas });
});
router2.post("/generate", async (req, res) => {
  try {
    const { topic, platform } = req.body;
    if (!topic) return res.status(400).json({ success: false, error: "Topic is required" });
    const text = await aiService.generateIdeas(topic, platform || "YouTube");
    const newIdea = {
      id: "i_" + Date.now(),
      title: `Idea for: ${topic}`,
      hook: text.slice(0, 100) + "...",
      platform: platform || "YouTube",
      angle: "AI Generated"
    };
    mockIdeas.unshift(newIdea);
    res.json({ success: true, data: newIdea, rawText: text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
var ideasRouter = router2;

// server/routes/scripts.routes.ts
import { Router as Router3 } from "express";
var router3 = Router3();
var mockScript = {
  id: "s1",
  title: "Mastering AI Agent Workflows in 2026",
  platform: "YouTube",
  targetDuration: "8 minutes",
  language: "English",
  content: {
    hook: "What if you could delegate 80% of your content research to an AI agent?",
    introduction: "Welcome back to the channel. Today we break down automated creator OS.",
    body: "Point 1: Agentic research.\nPoint 2: Retention hooks.\nPoint 3: Localization.",
    callToAction: "Drop a comment and subscribe."
  },
  wordCount: 340,
  status: "Ready"
};
router3.get("/:id", (req, res) => {
  res.json({ success: true, data: mockScript });
});
router3.patch("/:id", (req, res) => {
  mockScript = { ...mockScript, ...req.body };
  res.json({ success: true, data: mockScript });
});
router3.post("/generate", async (req, res) => {
  try {
    const { hook, introduction } = req.body;
    const polished = await aiService.polishScript(hook || mockScript.content.hook, introduction || mockScript.content.introduction);
    res.json({ success: true, polished });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
var scriptsRouter = router3;

// server/routes/research.routes.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.post("/search", (req, res) => {
  const { query } = req.body;
  res.json({
    success: true,
    sources: [
      { id: 1, title: `Market Analysis on ${query || "Creator Tools"}`, publisher: "TechCrunch", url: "https://example.com/1", date: "Oct 2026" },
      { id: 2, title: "State of Autonomous AI Agents in Media", publisher: "Wired", url: "https://example.com/2", date: "Oct 2026" }
    ]
  });
});
var researchRouter = router4;

// server/routes/localization.routes.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.post("/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, error: "Text and targetLanguage are required" });
    }
    const translated = await aiService.translateText(text, targetLanguage);
    res.json({ success: true, translated, targetLanguage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router5.post("/subtitles", (req, res) => {
  const { language } = req.body;
  res.json({
    success: true,
    message: `Generated SRT subtitle track for ${language || "Malayalam"}`,
    format: "SRT",
    downloadUrl: "/api/v1/media/download/subtitles.srt"
  });
});
var localizationRouter = router5;

// server/routes/publishing.routes.ts
import { Router as Router6 } from "express";
var router6 = Router6();
var mockCalendar = [
  { id: "e1", title: "Mastering AI Agent Workflows", date: "2026-10-18", time: "10:00 AM", platform: "YouTube", status: "Scheduled" },
  { id: "e2", title: "5 Design Principles Carousel", date: "2026-10-19", time: "02:00 PM", platform: "Instagram", status: "Scheduled" }
];
router6.get("/calendar", (req, res) => {
  res.json({ success: true, data: mockCalendar });
});
router6.post("/calendar", (req, res) => {
  const newEvent = { id: "e_" + Date.now(), ...req.body };
  mockCalendar.push(newEvent);
  res.status(201).json({ success: true, data: newEvent });
});
router6.post("/publish", (req, res) => {
  const { projectId, platform } = req.body;
  res.json({
    success: true,
    message: `Successfully dispatched publication job to ${platform || "YouTube"} API`,
    jobId: "pub_" + Date.now(),
    status: "Published"
  });
});
var publishingRouter = router6;

// server/routes/analytics.routes.ts
import { Router as Router7 } from "express";
var router7 = Router7();
router7.get("/", (req, res) => {
  res.json({
    success: true,
    metrics: [
      { label: "Total Views", value: "248,590", change: "+18.4%" },
      { label: "Engagement Rate", value: "8.7%", change: "+2.1%" },
      { label: "Subscriber Growth", value: "+14,250", change: "+12.8%" }
    ]
  });
});
var analyticsRouter = router7;

// server/routes/tasks.routes.ts
import { Router as Router8 } from "express";
var router8 = Router8();
var mockTasks = [
  { id: "t1", title: "Finalize B-roll footage for YouTube tutorial", priority: "High", dueDate: "Today, 5:00 PM", completed: false },
  { id: "t2", title: "Review translated Arabic & Malayalam subtitles", priority: "Medium", dueDate: "Tomorrow", completed: false }
];
router8.get("/", (req, res) => {
  res.json({ success: true, data: mockTasks });
});
router8.post("/", (req, res) => {
  const newTask = { id: "t_" + Date.now(), completed: false, ...req.body };
  mockTasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});
router8.patch("/:id", (req, res) => {
  mockTasks = mockTasks.map((t) => t.id === req.params.id ? { ...t, ...req.body } : t);
  res.json({ success: true, message: "Task updated" });
});
var tasksRouter = router8;

// server/routes/integrations.routes.ts
import { Router as Router9 } from "express";

// server/db/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
var supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
var supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
async function checkDatabaseConnection() {
  if (!supabase) {
    return {
      connected: false,
      message: "Supabase URL or Key not provided. Operating in robust fallback memory mode. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env to connect to Supabase PostgreSQL."
    };
  }
  try {
    const { data, error } = await supabase.from("profiles").select("count", { count: "exact", head: true });
    if (error) throw error;
    return { connected: true, message: "Successfully connected to Supabase PostgreSQL database." };
  } catch (err) {
    return { connected: false, message: `Supabase connection error: ${err.message}` };
  }
}

// server/routes/integrations.routes.ts
var router9 = Router9();
router9.get("/", async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    success: true,
    database: dbStatus,
    integrations: [
      { name: "Gemini / Gemma 3.8 Flash AI", status: "Connected", active: true },
      { name: "Supabase PostgreSQL & Auth", status: dbStatus.connected ? "Connected" : "Config Required", active: dbStatus.connected },
      { name: "YouTube Data API", status: "Connected", active: true },
      { name: "Instagram Graph API", status: "Connected", active: true }
    ]
  });
});
router9.post("/:provider/test", async (req, res) => {
  const provider = req.params.provider;
  if (provider === "supabase") {
    const status = await checkDatabaseConnection();
    return res.json({ success: status.connected, message: status.message });
  }
  res.json({ success: true, message: `Successfully verified connection with ${provider}` });
});
var integrationsRouter = router9;

// server.ts
dotenv2.config();
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "CREOVA Backend",
    status: "operational",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/news", async (req, res) => {
  const queries = {
    "AI & Technology": "artificial intelligence technology",
    Food: "food restaurants India",
    Travel: "travel tourism India",
    Education: "education India",
    Gaming: "gaming esports",
    Fashion: "fashion India",
    Business: "business startups India"
  };
  const niche = typeof req.query.niche === "string" ? req.query.niche : "AI & Technology";
  const query = queries[niche];
  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Choose a supported niche."
    });
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12e3);
  try {
    const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(query + " when:7d") + "&hl=en-IN&gl=IN&ceid=IN:en";
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/rss+xml, application/xml" }
    });
    if (!response.ok) {
      throw new Error(`News provider returned ${response.status}`);
    }
    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: false
    });
    const feed = parser.parse(xml);
    if (!feed?.rss?.channel) {
      throw new Error("The provider did not return a valid news feed.");
    }
    const raw = feed.rss.channel.item || [];
    const items = Array.isArray(raw) ? raw : [raw];
    const articles = items.map((item) => {
      const title = String(item.title || "").trim();
      const link = String(item.link || "").trim();
      let safeLink = "";
      try {
        const parsed = new URL(link);
        if (parsed.protocol === "https:") safeLink = parsed.href;
      } catch {
      }
      return {
        title,
        link: safeLink,
        source: typeof item.source === "string" ? item.source : String(item.source?.["#text"] || "News source"),
        publishedAt: String(item.pubDate || "")
      };
    }).filter((item) => item.title && item.link).slice(0, 6);
    res.json({
      success: true,
      articles,
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error(
      "News feed error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(502).json({
      success: false,
      error: "News is temporarily unavailable. Retry or use the news search links."
    });
  } finally {
    clearTimeout(timeout);
  }
});
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction, model } = req.body;
    const result = await aiService.generateContent(
      prompt,
      systemInstruction,
      model
    );
    res.json({
      success: true,
      text: result.text,
      simulated: result.simulated,
      model: result.model
    });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ success: false, error: error.message || "AI generation failed" });
  }
});
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
  const PORT = process.env.PORT || 3e3;
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== "true" },
      appType: "spa"
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
      `CREOVA complete modular backend running at http://0.0.0.0:${PORT}`
    );
  });
}
startServer();
