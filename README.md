🐦 BirdLink – Bird Migration & Sanctuary Intelligence Platform
EPICS Project • Realtime Bird Catalog • Interactive Maps • Migration Insights
<p align="center"> <img src="attached_assets/banner.png" alt="BirdLink Banner" /> </p>
🚀 Overview

BirdLink is a full-stack, production-ready platform built for the EPICS (Engineering Projects in Community Service) initiative.
It helps users:

Track bird species across regions

Access migration insights

Explore bird sanctuaries through an interactive map

Submit and view real-time bird sightings

Receive push notifications for rare & migratory species

Use eBird API + custom analysis

This project combines a React + Vite client, Node.js Express server, and a PostgreSQL/NeonDB database with Drizzle ORM.

🧠 Tech Stack
Layer	Technology
Frontend	React, TypeScript, Vite
Styling	TailwindCSS, ShadCN UI, Radix UI
Backend	Node.js (Express)
Database	NeonDB (PostgreSQL)
ORM	Drizzle ORM
Auth	Express-Session, Passport Local
APIs	eBird API
Realtime	WebSockets
Maps	Leaflet Map
🏗️ Architecture Diagram
          Client (React + Vite)
                    │
                    ▼
             Express Backend
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
 eBird API     NeonDB (Postgres)  WebSockets
                    │
                    ▼
        Species Catalog + User Data

✨ Features
🐦 Bird Catalog

View rare, endangered, and migratory species

Admin controls for adding/removing birds

Bird profiles with images, maps, and descriptions

🗺️ Interactive Bird Sanctuary Map

Leaflet-powered live map

Shows sanctuary boundaries, coordinates & descriptions

Clickable pins with detailed info

🔔 Push Notifications

Real-time alerts for:

New sightings

Rare species

Migration patterns

📍 Bird Sightings Module

Add sightings with location, species, and notes

View all sightings on the map

Admin moderation panel

📊 Migration Insights

eBird API integration

Region-wise analysis

Seasonal patterns

🧩 Project Structure
EPICS_V
│── client/        # React + Vite frontend
│── server/        # Node.js backend
│── shared/        # Shared types & utilities
│── drizzle.config.ts
│── package.json
│── tsconfig.json
│── attached_assets/
└── README.md

🔧 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/KAUSHIK1224/EPICS_V
cd EPICS_V

2️⃣ Install Client Dependencies
cd client
npm install
npm run dev

3️⃣ Install Server Dependencies
cd ../server
npm install
npm run dev

4️⃣ Environment Variables

Create a .env in /server:

DATABASE_URL=postgresql://...
EBIRD_API_KEY=your_key_here
SESSION_SECRET=some_random_secret

🌐 Deployment

This project supports Render Web Services + NeonDB:

Frontend → Render (Static site or Node)

Backend → Render (Node Web Service)

Database → NeonDB PostgreSQL

🏅 Status

This project is actively developed as part of the EPICS Program.
Current milestone: Phase-2 Migration Insights + Notifications ✔️

🔮 Future Enhancements

Machine-learning based bird classification

Mobile PWA version

Predictive migration modeling

User–generated bird trail heatmaps

Gamification (XP, badges, streaks)

📄 License

This repository is for educational + portfolio use.

⭐ Show Support

If this project helped you, please consider giving it a star ⭐
Your support motivates more open-source contributions
