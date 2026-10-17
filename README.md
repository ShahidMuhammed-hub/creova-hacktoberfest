# CREOVA — Complete AI Creator Operating System

**CREOVA** is a modular AI-assisted creator workflow prototype AI-powered creator operating system and social media management platform designed for individual creators, faceless content creators, agencies, and modern media teams.

---

## 1. Executive Summary & Features Implemented

CREOVA unifies the entire content lifecycle into a single precision-engineered workspace:
- **Overview Dashboard**: Time-appropriate greeting, content overview metrics, activity charts, upcoming schedule, recent projects, today's tasks, and quick AI actions.
- **Discover & Trend Research**: Viral topic discovery and trend research with AI-driven content angle suggestions.
- **Idea Studio**: AI-backed idea generator producing hooks, angles, and formats with one-click conversion to scripts or calendar entries.
- **Script Studio**: Retention-optimized script writer with AI hook polishing, structured sections (hook, intro, body, CTA), word count, and export capabilities.
- **Video Production Planner**: Scene-by-scene storyboard planner with timings, camera angles, shot lists, and status tracking.
- **Multilingual & Localization Studio**: Transcript translation and subtitle workflow (supporting English, Malayalam, Hindi, Arabic, and Urdu for social-post translation).
- **Design & Thumbnail Studio**: Interactive canvas and design customizer for YouTube thumbnails, Instagram carousels, and social stories with PNG export.
- **Content Calendar & Publishing**: Multi-platform publishing center providing editable publishing packs and links to YouTube Studio, Instagram, and Facebook for manual publishing.
- **Analytics & Tasks**: Engagement metrics, follower growth charts, and interactive task management with priority filtering.
- **Brand Kit & Integrations**: Reusable brand profiles and live health checks for Supabase, Gemini AI, and social APIs.

---

## 2. Technical Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, and HTML Canvas API
- Backend: Node.js, Express, and TypeScript
- AI: Official `@google/genai` SDK using `gemma-4-26b-a4b-it` through the Gemini API
- News: Google News RSS with `fast-xml-parser`
- Optional database scaffold: Supabase PostgreSQL migrations and server-side connection helper

---

## 3. Installation & Running Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (`.env`):
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   SUPABASE_URL="your_supabase_url_here"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key_here"
   PORT=3000
   ```
3. Run development server (boots Express backend with Vite middleware):
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 4. Database Migration Guide

To apply the Supabase PostgreSQL schema:
1. Open your Supabase Dashboard SQL Editor.
2. Execute the migration script located at `/server/db/migrations.sql`.
3. Verify table creation (`profiles`, `workspaces`, `projects`, `content_ideas`, `scripts`, `media_assets`, `publishing_jobs`, etc.) and Row-Level Security policies.

---

## 5. Files Created & Modified

- `server.ts`: Express backend entry point mounting all modular API routers and Vite middleware.
- `server/db/supabase.ts`: Server-side Supabase client & live health checker.
- `server/db/migrations.sql`: Complete PostgreSQL schema & RLS policies.
- `server/services/ai.service.ts`: Official `@google/genai` service adapter using `ggemma-4-26b-a4b-it`.
- `server/routes/`: Modular REST routers for projects, ideas, scripts, research, localization, publishing, analytics, tasks, and integrations.
- `src/App.tsx`: Main React application with view routing and API synchronization.
- `src/components/`: Sidebar, Header, and Create Content Modal components.
- `src/views/`: 15+ fully interactive creator module views (Dashboard, Discover, Ideas, Scripts, Production, Localization, Design, Calendar, Publishing, Analytics, Tasks, Projects, Brand Kit, Integrations, Settings).


## Current Scope

Gemma 4 powers idea generation, camera shot planning, captions, hashtags, translation, and thumbnail headline suggestions.

Uploaded videos are previewed locally. AI generation uses the creator's supplied description or transcript. Social buttons open official platform pages for secure manual upload; automatic social-media publishing is not connected.

The niche module displays current headlines through Google News RSS and provides source links. Users should verify news with the original source before publishing.