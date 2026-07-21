# NANCY AI — Dead by Daylight Intelligence Nexus

> **An advanced, real-time AI companion, strategist, and analytics system for Dead by Daylight (DBD).**
> Built with Next.js, Pinecone Vector RAG, an O(1) Local Game Database, and an automated Multi-API Fallback Engine.

---

##  Overview

**Nancy AI** is a high-performance assistant engineered specifically for Dead by Daylight players, streamers, and theory-crafters. She functions as a veteran coach, build engineer, and mechanic analyst. 

Unlike generic LLM wrappers, Nancy AI uses a **hybrid architecture** combining instant local keyword/mechanic lookup, a vector database (Pinecone RAG) for deep game knowledge, and a strict **0-temperature Anti-Hallucination prompt protocol** to guarantee 100% factual game accuracy.

---

##  Key Features

* **Multi-API Waterfall Failover Pipeline**: Never worry about rate limits or exhausted free-tier tokens. If Groq fails, the system seamlessly routes to Google Gemini, and then to OpenRouter with zero downtime.
* **O(1) Local Perk Engine & Mechanic Scanner**: Contains a built-in dictionary of DBD perks and game mechanics (*Haste, Exposed, Endurance, Broken, etc.*) for zero-latency retrieval.
* **Pinecone Vector DB Integration**: Uses `@xenova/transformers` (`Xenova/all-MiniLM-L6-v2`) embeddings to query deep DBD strategy and background game knowledge.
* **Reactive State Machine Avatar**: Switches animated avatar GIFs dynamically based on Nancy's real-time AI processing state (`greeting`, `thinking`, `answering`, and `cute`).
* **Strict Anti-Hallucination Protocol**: Configured with a `0` temperature setting and deterministic hard-stop instructions to eliminate fabricated perks, abilities, or mechanics.
* **Premium Entity-Themed HUD**: Custom Glassmorphism UI styled in Blood Red, Auric Gold, and Fog Black, featuring live streaming responses with a custom Markdown formatter.

---

## Tech Stack

### **Frontend (`/frontend`)**
* **Framework**: Next.js 14+ (App Router)
* **Styling**: Tailwind CSS & Custom CSS Animations
* **SDKs & Libraries**:
  * `groq-sdk` — Groq Cloud Client
  * `@pinecone-database/pinecone` — Cloud Vector DB SDK
  * `@xenova/transformers` — In-browser / Node feature extraction embeddings

### **Backend (`/backend`)**
* **Language**: Python 3.10+
* **Data Processing**: Vector Ingestion Pipeline & Web Scraper
* **Libraries**: `pinecone-client`, `beautifulsoup4`, `requests`, `python-dotenv`

---

## Repository Structure

```text
nancy-ai/
├── .gitignore                   # Master gitignore for sensitive files & node_modules
├
│
├── backend/                     # Python Data Ingestion & Scraper Pipeline
│   ├── data/                    # Raw JSON/Text knowledge bases
│   ├── .env                     # Backend private keys (Git-ignored)
│   ├── config.py                # Database configuration settings
│   ├── ingest.py                # Pinecone vector seeding script
│   ├── scraper.py               # Custom web scraper
│   └── requirements.txt         # Python dependencies
│
└── frontend/                    # Next.js Full-Stack Application
    ├── .env.local               # Frontend API Keys (Git-ignored)
    ├── package.json             # Node dependencies
    ├── vercel.json              # Vercel Cron Job Configuration
    ├── app/
    │   ├── api/
    │   │   ├── chat/
    │   │   │   └── route.js     # Master Multi-API Fallback & RAG Router
    │   │   ├── sync-core-data/  # Core mechanic sync route
    │   │   └── sync-knowledge/  # Scheduled automated updater route
    │   ├── globals.css          # Theme styles, scrollbars & animations
    │   ├── layout.js            # Root layout wrapper
    │   └── page.js              # Interactive Dashboard UI & State Machine
    └── public/
        └── assets/              # Avatar animations & visual assets
