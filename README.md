# CampusLaunch Frontend Application

This repository contains the frontend application codebase for **CampusLaunch**, the platform designed to accelerate student-led startups.

## ✨ Features

*   **Dark Mode Visual Theme**: A modern, sleek dark-themed user interface (`#09090B`) styled with Tailwind CSS.
*   **AppShell Router Layout**: Intelligently hides/displays standard layouts (like the main navigation header and footer) for the landing page (`/`) versus dashboard views.
*   **Business Canvas Builder**: A real-time, multi-user drag-and-drop business model canvas with socket integration.
*   **Interactive Pitch Arena**: Live event lobby, presentation timers, judge scoring panels, and audience emoji reactions.
*   **Founder Matchmaking**: Complete user profiles, matchmaking algorithm, and a unified connection requests system.
*   **Curriculum Dashboard**: Self-guided weekly progress tracking, unlocks, and certificate generator.
*   **Firebase SDK Integration**: Dynamic configuration loading for user login/registration, token fetching, and messaging alerts.

---

## 🛠️ Environment Configuration

For development and builds, configure a `.env` file inside the `frontend/` folder or define variables in your hosting settings (e.g., Vercel):

```env
VITE_API_URL=http://localhost:5000/api

# Firebase Web Config
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=campuslaunch-995ae.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campuslaunch-995ae
VITE_FIREBASE_STORAGE_BUCKET=campuslaunch-995ae.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1023015602623
VITE_FIREBASE_APP_ID=1:1023015602623:web:19bf0e2c43e666de63b90a
VITE_FIREBASE_MEASUREMENT_ID=G-849E5CY55C
```

---

## 💻 Local Development

### Prerequisites
*   Node.js (v18+)
*   Running backend server on port `5000` (or matching your `VITE_API_URL`)

### Setup Instructions
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application runs locally on `http://localhost:5173`.
