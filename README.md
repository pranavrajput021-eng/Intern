# Aesthetic Athlete: Workout and Nutrition Platform

A full-stack application for logging physical workouts, tracking daily macronutrients, saving body circumferences, and interacting with a responsive LLM-powered physical health chatbot. Built on a React + Node.js (Express) stack, with support for PostgreSQL relational storage backend syncing.

---

## Technical Specifications & System Modules

### 1. Chatbot Assistant (Aesthetic Coach)
An interactive conversational interface utilizing the `@google/genai` TypeScript SDK.
- **Scope Parameters**: Configured strictly to supply feedback on physical splits, nutrition frameworks, supplement queries, and muscle recovery.
- **Message Rendering Pipeline**: Uses a custom React-based token parsing engine to format LLM outputs into clean custom nested list nodes and headers.
- **User Message History Persistence**: Implements separate `localStorage` partitions indexed on unique logged-in `user.id` strings, successfully reloading historic state across login sessions.
- **Response Delay Constraints & Fallback Handler**: Implements a strict `6000ms` total response time window using `AbortController` signals. Instantly handles timeout or disconnection events by reverting to a local regex response rulebook.

### 2. Workout Manager
An active workout tracker featuring dynamic metronome aids and browser timer notifications.
- **Active Workout Session State**: Manages active training blocks, tracking elapsed durations, working set loads, and target reps.
- **Audio Synthesis**: Leverages standard HTML5 `AudioContext` to generate standard pitch-perfect synthesized rest-period complete sounds natively.
- **Rest State Metronome**: Synchronizes visual countdown metrics to encourage structural rest parameters between high-intensity lifts.
- **Session Control Overlays**: Includes customized, non-disruptive dialogs handling session termination and final workout summaries.

### 3. Nutrition Ledger & Hydration Monitor
Structured calorie metrics mapping dietary inputs against calculated baseline targets.
- **Caloric Balance Targets**: Calculates target caloric deficits or surpluses depending on target goals, rendering dynamic target ratios.
- **Macronutrient Comparisons**: Uses custom visualizations to project logged carbs, proteins, and fats against target athlete benchmarks.
- **Hydration Logging Metric**: Registers simple fluid intake updates to maintain an accurate daily fluid log.
- **Log Mutations**: Provides methods to instantly create, list, and destroy meal log entries.

### 4. Performance Analytics Dashboard
Aggregated biometric trends organized into structured data graphs.
- **Volume Accumulation Graphs**: Plots workout frequencies across trailing 6-month cycles.
- **Biometric Trends**: Visualizes historical bodyweight metrics and resulting BMI ratios.
- **Body Circumferences Monitor**: Tracks dimensional data trends for chest, biceps, waist, hips, and thighs.
- **Muscle Target Allocations**: Displays distribution vectors for active muscle targets.
- **Stride Metrics & Personal Benchmarks**: Tracks step counts and registers top performance achievements.

---

## System Stack & Dependencies

### **Client Architecture (Single Page Application)**
- **React 19 & TypeScript**: Provides static type validation and state synchronization.
- **Vite**: Asset packaging and local dev server.
- **Tailwind CSS**: Simple responsive grid structuring and layout layouts with standard utility classes.
- **Lucide Icons**: Standard UI vector icons.
- **Recharts & Motion**: Responsive charting configurations and transition animations.

### **Server-Side API Proxy**
- **Express Backend (Node.js)**: Proxies outgoing API calls and holds backend environments.
- **Gemini API Integrations**: Calls the Gemini Flash model to return text blocks regarding sports splits.
- **PostgreSQL / Supabase Integration**: Schema structures for muscle groups, workout records, fluid limits, steps, weights, and user credentials.

---

## Folder Architecture

```dir
├── src/
│   ├── components/            # UI components and view controllers
│   │   ├── AestheticCoachChatbot.tsx  # Chatbot component with dynamic history loading
│   │   ├── WorkoutManager.tsx          # Workout active tracking with notification metronome
│   │   ├── NutritionAndHydration.tsx   # Meal registry and macronutrient tracking
│   │   ├── AnalyticsView.tsx           # Recharts panels for body circumferences and weights
│   │   ├── DashboardView.tsx           # Home summary dashboard view
│   │   ├── AuthScreen.tsx              # Onboarding and credential forms
│   │   └── ...
│   ├── supabaseService.ts     # Supabase DB schema mapping and communication scripts
│   ├── types.ts               # Shared TypeScript type and enum declarations
│   ├── main.tsx               # Client entry point
│   └── App.tsx                # Context router and core visual layout launcher
├── server.ts                  # Express server serving static assets and API routes
├── package.json               # Package dependencies and standard scripts
└── README.md                  # System Documentation README
```

---

## Local Development & Setup Instructions

Ensure Node.js v18+ is installed on the local system.

### 1. Install System Dependencies
```bash
npm install
```

### 2. Configure Environment Properties
Create a `.env` file in the project root containing target credentials:
```env
# Server secret keys (do not expose to the client browser)
GEMINI_API_KEY=your_gemini_api_key

# Supabase connectivity URLs
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the live local app.

### 4. High-Performance Server Compilation
```bash
# Builds production static build files and bundles server.ts to dist/server.cjs
npm run build

# Boots the compiled backend server environment securely
npm run start
```

---

## Responsive Layout details
Designed to handle multi-sized window layouts:
- **Navigation Controls**: Relies on bottom-aligned navigators to ensure convenient access on mobile viewport ratios.
- **Touch Event Scaling**: Leverages minimum hover and responsive padded elements sizing for touch targets.
- **Fluid Layout Grids**: Dynamically structures triple-columns desktop configurations into compact single-row lists.

---

## Security Configurations & API Proxying
- **Secret Key Protection**: Keeps `GEMINI_API_KEY` hidden inside backend processes (`server.ts`). Upstream endpoints proxy chatbot queries through Express routes.
- **Offline Reliability Code**: If external network requests fail or time out, the client falls back immediately to localized response rules to ensure functional consistency.
