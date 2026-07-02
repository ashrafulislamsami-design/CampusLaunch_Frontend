# CampusLaunch - Frontend client

This repository contains the user interface client for **CampusLaunch**, the developer-centric command center for university startup founders. The client is a React Single Page Application (SPA) powered by **Vite** and **Tailwind CSS**.

---

## 🎨 Design Theme: "Swiss Blueprint"
The interface is designed with a premium, high-contrast, Swiss design system:
* **Background**: OLED/Pure Black (`#09090B` and `#18181B`) base layouts.
* **Typography**: Proportional titles using Outfit and monospace labels using Geist Mono for structured metadata.
* **Accents**: High-vibrancy Electric Blue (`#2563EB`) and custom borders.

---

## 🚀 Key Features

### 🔑 Authentication Client & Sync
* Unified `AuthContext.jsx` managing user status, socket connections, and token verification.
* Automatic fallback: attempts standard email/password login using Firebase Authentication. If the user only exists in the backend MongoDB database, it falls back to Custom JWT authentication.
* Seamless token synchronization: handles short custom JWT tokens and long Firebase ID tokens transparently.

### 🎨 Multiplayer Business Model Canvas
* Real-time collaborative canvas sections with drag-and-drop elements.
* Live sticky notes with multiple color picker panels.
* Collaboration hub with section focus indicators, version snapshots, and comments.

### 📅 Mentor Booking Directory
* Search and view active expert mentors.
* Step-by-step booking slot selector.
* Interactive calendar/schedule of upcoming bookings.

### 🎤 Pitch Arena
* Live viewer counts, presentation timers, and emoji reaction arrays.
* Interactive audience polling panels and judge scoring cards.
* Results board with podium displays and winner badges.

### 📚 Startup Curriculum
* 12-week locked progress tracker.
* In-app readings, video player frames, and module checkpoints.
* PDF certificate downloader upon successful curriculum completion.

### ⚙️ Preference Matrix & Audit logs
* Granular notification controls (Immediate, Daily, Off).
* Master unsubscribe panel.
* Live Audit Table tracking the delivery status of the last 20 emails.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the `frontend` directory:

```ini
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Web Client Credentials
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```
