🐦 BirdLink – EPICS Community Wildlife Tracking Platform

A full-stack bird tracking and sanctuary exploration system built for the EPICS (Engineering Projects in Community Service) initiative.

✨ Overview

BirdLink helps users:

🌍 Track bird species across different regions

🧭 Access migration insights

🗺️ Explore bird sanctuaries via an interactive live map

📸 Submit & review real-time bird sightings

🔔 Receive notifications for rare & migratory species

📊 Use eBird API + custom analytics

🌱 Contribute to wildlife monitoring for community conservation

This platform combines a:

⚛️ React + Vite frontend

🟩 Node.js + Express backend

🐘 NeonDB (PostgreSQL) database

🌦️ eBird API + Custom Services

🗺️ Leaflet-based live map

🌟 Features
🐤 Bird Catalog

View rare, endangered, and migratory species

Add/remove birds (admin controls)

Bird profiles with images, habitat details, migration info & maps

🗺️ Interactive Sanctuary Map

Leaflet-powered live visualization

Sanctuary boundaries & coordinates

Clickable pins with detailed information

Auto-updated map data

🔔 Push Notifications

Real-time alerts for recorded sightings

Special alerts for rare & migratory birds

WebSocket-powered live updates

👁️ Real-Time Bird Sighting Feed

Submit new sightings with photos & coordinates

Moderated approval system

Auto-sync between client ↔ server using WebSockets

🌤️ API Integrations

🐦 eBird API — species, sightings & hotspots

🌦️ (Optional future) weather migration correlation

Custom backend tools for clean data delivery

🧠 Tech Stack
Layer	Technology
Frontend	React, TypeScript, Vite
UI	TailwindCSS, ShadCN UI, Radix UI
Backend	Node.js (Express), WebSockets
Database	NeonDB (PostgreSQL)
ORM	Drizzle ORM
APIs	eBird API
Maps	Leaflet.js
Auth	Express-Session, Passport
Deployment	Render
🏗️ Architecture Diagram
User → React (Vite) UI 
        ↓
    Express Backend → WebSockets (Live Updates)
        ↓
   Drizzle ORM → NeonDB (Postgres)
        ↓
     eBird API (Species + Sightings)


Client Output Includes:
✔ Bird Catalog
✔ Live Sanctuary Map
✔ Migration Insights
✔ Real-time Notifications

🚀 Deployment
🌐 Production Deployment (Render)

Frontend deployed as static site

Backend deployed as Node service

NeonDB used as fully managed Postgres

Environment variables store API Keys + DB URL

🛠️ Local Development (No sensitive code, only steps)
1️⃣ Clone the repo
git clone https://github.com/KAUSHIK1224/EPICS_V
cd EPICS_V

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables

You need:

DATABASE_URL

EBIRD_API_KEY

Create a .env file (not included in repo).

4️⃣ Start development servers

Frontend & backend run separately.

npm run dev

📌 Project Status

This project is fully completed as part of the EPICS community engineering initiative.

🔮 Future Enhancements

ML-based migration prediction

Sighting credibility scoring

Offline field-survey mode

AI-powered species identifier (vision model)

Admin analytics dashboard

📜 License

This project is for educational & community service purposes.

⭐ Support

If you liked this project, consider giving the repository a star ⭐ on GitHub — it helps your profile stand out!


