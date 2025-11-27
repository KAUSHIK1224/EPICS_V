<p align="center">
  <img src="https://i.ibb.co/7K7n6hN/birdlink-banner.png" width="100%" alt="BirdLink Banner"/>
</p>

<h1 align="center">🐦 BirdLink – EPICS Community Wildlife Tracking Platform</h1>

<p align="center">
  <b>A Full-Stack Bird Tracking & Sanctuary Exploration System</b><br/>
  Built for the <b>EPICS – Engineering Projects in Community Service</b> Initiative
</p>

<p align="center">

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Frontend-React%20+%20Vite-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20Express-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Database-NeonDB%20(Postgres)-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/ORM-Drizzle%20ORM-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Maps-Leaflet.js-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/API-eBird%20API-red?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Production-success?style=for-the-badge"/>

</p>

---

## 📘 Overview

**BirdLink** is a full-stack wildlife tracking and bird sanctuary exploration platform designed to:

- 🐦 Track bird species across regions  
- 🌐 Access migration insights  
- 🗺️ Explore sanctuaries on a live interactive map  
- 📸 Submit and review real-time sightings  
- 🔔 Receive rare/migratory bird notifications  
- 📊 Use **eBird API** + custom analysis  
- 🌱 Support community wildlife monitoring  

This platform combines a modern stack:

- **React + Vite** frontend  
- **Node.js + Express** backend  
- **WebSockets** for real-time updates  
- **NeonDB (PostgreSQL)** with **Drizzle ORM**  
- **Leaflet Maps**  
- **eBird API** integrations  

---

## 🌟 Features

### 🐤 Bird Catalog
- View rare, endangered, and migratory species  
- Admin panel for adding/editing species  
- Detailed species profiles with images, maps & info  

---

### 🗺️ Live Sanctuary Map
- Leaflet-powered interactive map  
- Displays sanctuary boundaries  
- Coordinates, zones, and clickable hotspots  
- Real-time map updates via WebSockets  

---

### 📸 Real-Time Sightings
- Submit bird sightings with images & coordinates  
- Moderated approval workflow  
- Auto-sync between client ↔ server  

---

### 🔔 Push Notifications
- Real-time alerts for sightings  
- Special alerts for rare / migratory birds  
- WebSocket-based delivery  

---

### 🌤️ API Integrations
- 🐦 **eBird API** → species, sightings, hotspots  
- 🔗 Custom backend processors  
- 🔮 Future: migration-weather correlation  

---

## 🧠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, TypeScript, Vite |
| UI | TailwindCSS, ShadCN UI, Radix UI |
| Backend | Node.js (Express), WebSockets |
| Database | NeonDB (PostgreSQL) |
| ORM | Drizzle ORM |
| Maps | Leaflet.js |
| Auth | Express-Session, Passport |
| APIs | eBird API |
| Deployment | Render |

---
User
│
▼
React (Vite) Frontend
│
▼
Express Backend — WebSockets
│
▼
Drizzle ORM
│
▼
NeonDB (PostgreSQL)
│
▼
eBird API (Species + Sightings)


Output Includes:
- ✔ Bird Catalog  
- ✔ Live Sanctuary Map  
- ✔ Migration Insights  
- ✔ Real-time Notifications  

---

## 🚀 Deployment (Production – Render)

- Frontend deployed as static build  
- Backend deployed as Node service  
- NeonDB used as fully managed Postgres  
- API Keys + DB URL stored as environment variables  

---

## 🛠️ Local Development (No Sensitive Code)

1️⃣ Clone repository  
```bash
git clone https://github.com/KAUSHIK1224/EPICS_V
cd EPICS_V

Install dependencies

npm install


3️⃣ Create .env and add:

DATABASE_URL

EBIRD_API_KEY

4️⃣ Start development environment

npm run dev

🏆 Project Status

This project is fully completed for the
🎓 EPICS – Engineering Projects in Community Service Initiative.

🔮 Future Enhancements

AI-based bird identification

Migration prediction model

Admin analytics dashboard

Offline field-survey mode

Community leaderboard

📄 License

This project is for educational and portfolio use.

⭐ Show Support

If you like this project, consider giving it a ⭐ star —
your support motivates more open-source work!

<p align="center">✨ Built with love for wildlife & community ✨</p> ```

## 🏗️ Architecture Diagram

