# ✠ Catholic Prayer PWA

A Progressive Web App (PWA) designed to help Catholics manage their prayers, follow Novenas with automatic reminders, receive contextual daily prayer suggestions, and personalize their own weekly prayer book with a 3D flipbook interface. The interface is crafted with a minimalist, clean, and elegant aesthetic inspired by traditional printed Bibles.

> [!NOTE]
> This version of the application currently only supports the Vietnamese language.

---

## 🌟 Key Features

1. **Structured Prayer Library (6 Categories):**
   * Morning prayer before work.
   * Morning prayer before school.
   * Weekday evening prayer.
   * Weekend evening prayer.
   * Catholic Feast Days & National Holidays.
   * Devotional Novenas (Divine Mercy, Our Lady of Perpetual Help, Saint Joseph).
2. **Contextual Suggestions:** Automatically suggests appropriate prayers on the dashboard based on the user's current time of day.
3. **Our Lady of Fatima Commemoration:** Automatically displays a special banner on the 13th of each month to commemorate the Fatima apparitions and suggest Marian devotions.
4. **Active Novena Progress Tracker:** Manages active Novenas over a 9-day span, tracks completion day by day, and links directly to the current day's prayer.
5. **My Prayer Book (3D Flipbook):** Allows users to customize their prayer schedule for each day of the week (Monday through Sunday, up to 7 pages) and read them with a realistic, CSS-based 3D page-flipping animation.
6. **Prismic CMS Integration & Offline On-Demand:** Fetches public prayers from Prismic CMS. Users can toggle "Offline Mode" in Settings to download the complete prayer database locally to IndexedDB, enabling 100% offline usage at church or places with poor connectivity.
7. **Backup & Restore:** Allows exporting local configurations, reminders, and Novena progress as a `.json` backup file to restore or sync across different devices.

---

## 🛠️ Technology Stack

* **Frontend:** React (TypeScript) + Vite
* **Styling:** Vanilla CSS (CSS Variables, HSL color tokens, 3D Transforms)
* **PWA:** `vite-plugin-pwa` (Service Worker, Webmanifest)
* **Client-side Storage:** `idb-keyval` (IndexedDB Cache) & LocalStorage
* **CMS:** `@prismicio/client` & `@prismicio/migrate` (Migration API)
* **Script Executor:** `tsx` (TypeScript Execution for Node.js)

---

## 📂 Project Directory Structure

```text
catholic-prayer-pwa/
├── public/
│   ├── favicon.svg          # Gold cross logo (High-definition SVG)
│   └── prayers.json         # Static mock prayer database
├── scripts/
│   └── import-prayers.ts    # Node.js script for Prismic bulk uploads
├── src/
│   ├── hooks/
│   │   └── useAppState.ts   # Core React app state manager hook
│   ├── utils/
│   │   ├── prismic.ts       # Connection handler & 3-stage fallback loader
│   │   └── storage.ts       # LocalStorage & IndexedDB helpers
│   ├── App.tsx              # Main UI views and navigation
│   ├── index.css            # Bible-themed Design System stylesheet
│   └── main.tsx             # React entrypoint & PWA worker registration
├── import-prayers.json      # Sample JSON file for bulk data upload
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite bundler & PWA worker config
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 2. Install Dependencies & Start Local Development
```bash
# Navigate to the project directory
cd catholic-prayer-pwa

# Install all packages
npm install

# Start local dev server
npm run dev
```
Open `http://localhost:5173` in your browser. For the best mobile simulator experience, toggle device simulation (F12 -> Toggle Device Toolbar).

### 3. Build for Production
To build static files for deployment (output located in the `dist/` directory):
```bash
npm run build
```

---

## 📤 Bulk Uploading Prayers to Prismic CMS

The project includes an automatic migration script to let you upload multiple prayers at once from a local JSON file directly to Prismic using the **Migration API**:

1. Write your prayers into the `import-prayers.json` file in the root directory following the provided format.
2. Retrieve your **Write Token** (Migration API Token) and **Repository Name** from your Prismic dashboard settings.
3. Run the following command in your terminal:
   ```bash
   PRISMIC_REPO=your_repo_name PRISMIC_WRITE_TOKEN=your_migration_token npm run prayers:import
   ```
4. Log into your Prismic Web Dashboard, click the **Releases** tab, inspect the uploaded draft documents, and click **Publish** to make them live for all users.
5. In the app's **Settings** tab, enter your Repository Name and click **Save & Sync** to update the local database.
