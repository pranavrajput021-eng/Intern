# 🏆 Aesthetic Athlete: Elite Performance platform

A high-performance, full-stack athletic optimization and bio-metric ledger system. Specially crafted for bodybuilders, athletes, and fitness enthusiasts, **Aesthetic Athlete** integrates direct hypertrophic workout tracking, real-time macro-nutrient accounting, physical circumferences tracking, performance diagnostics, and an exclusive AI-powered sports science coach.

---

## 🚀 Key Modules & Premium Features

### 1. 🤖 Aesthetic Coach AI
An integrated physical fitness chatbot built with the modern `@google/genai` TypeScript SDK. 
- **Sports Science Core**: Focuses strictly on physical performance, anabolic nutrition, supplement plans, sleep hygiene, and recovery techniques.
- **Rich Markdown Formatting**: All splits, diet templates, and instructions are parsed into sleek, high-contrast, scannable lists and headers.
- **Biometric Calibration**: Suggests custom Push/Pull/Legs splits, Clean Bulks, or Fat Shredding templates depending on your Athlete goal.
- **Fail-Safe Offline Mode**: Fully loaded with a comprehensive offline-safe fallback parser in case of server/connectivity drops.

### 2. 🏋️ Active Workout Manager
Plan, execute, and store hypertrophic strength routines.
- **Tactical Active Studio**: Tracks total duration, current working set, target loads, and notes live.
- **Audio-Synthesizer Core**: Utilizes the standard HTML5 `AudioContext` to generate pitch-perfect notification countdown beeps directly in your browser.
- **Rest Phase metronomes**: Active visual countdown timer dynamically alerts you when body-rest completes so you can stay in high intensity states.
- **Interactive Modals**: Fully custom-tailored, responsive game-like end-of-workout Victory Summaries and termination blocks.

### 3. 🥗 Nutrition and Hydration Hub
A scientific macro-nutrient Ledger designed to map nutrition directly against your targeted athletic split.
- **Activity Target Metronome**: Shows current total vs daily calories target (bulking surplus vs cutting deficits automatically tailored to your profile).
- **Macro Allocation Benchmark**: Recharts bar graph comparing actual logged carbs, proteins, and fats with ideal benchmarks.
- **Hydration Tracker Ring**: Log fluid intakes (by cup, shaker, bottle, or pitcher) to keep muscle cells active.
- **Meal Log Dairy**: Create, view, and delete meal logs with exact macro breakdowns.

### 4. 📈 Advanced Performance Analytics
Transform metrics into actionable physical hypertrophy patterns with high-fidelity Recharts dashboards.
- **Volume Accumulation Curve**: Visualizes cumulative workout counts of the latest 6 months.
- **BMI Trajectory Graph**: Plots weight-to-height trends.
- **Vitals Circumference Progression**: Logs muscle metrics (Chest, Arms, Waist, Hips, Thighs) and monitors cm changes.
- **Target Muscle Distribution Radar Chart**: Visualizes muscle category distributions.
- **Step Stride Trends & Personal Records**: Tracks pedometer stats and logs peak achievements.

---

## 🛠️ Technology Stack & Architecture

### **Frontend & Interface**
- **React 19 + TypeScript**: Extreme type-safety and state predictability.
- **Vite**: Super-fast module bundles and cold-starts.
- **Tailwind CSS**: Desktop-first precision and mobile-responsive tactile surfaces.
- **Lucide Icons**: Standardized, clean UI indicators.
- **Recharts + Motion**: Smooth, hardware-accelerated animations and high-performance charts.

### **Server & Integration**
- **Express Backend (Node.js)**: RESTful API proxy handling environment controls.
- **Gemini 3.5 Flash API**: Powering intelligent, context-aware sports advising with memory.
- **Supabase / PostgreSQL**: Scalable relational database storing workout structures, water targets, steps logs, weight, and user account parameters.

---

## 📂 Project Architecture

```dir
├── src/
│   ├── components/            # High-fidelity visual views & dashboards
│   │   ├── AestheticCoachChatbot.tsx  # AI Coach Panel (w/ Markdown rendering)
│   │   ├── WorkoutManager.tsx          # Strength builder & live execution studio
│   │   ├── NutritionAndHydration.tsx   # Caloric ledger & water tracker
│   │   ├── AnalyticsView.tsx           # Advanced Recharts analytics (BMI, Vitals)
│   │   ├── DashboardView.tsx           # Athlete status hub & goals charts
│   │   ├── AuthScreen.tsx              # High-contrast login & profile setup
│   │   └── ...
│   ├── supabaseService.ts     # Database synchronization wrapper
│   ├── types.ts               # Shared TypeScript structural definitions
│   ├── main.tsx               # Entry hook
│   └── App.tsx                # Context router & layout dispatcher
├── server.ts                  # Express production server & API gateway proxy
├── package.json               # Package coordinates & scripts
└── README.md                  # Elite documentation ledger
```

---

## 💻 Local Quickstart Installation

Ensure you have **Node.js v18+** installed.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/aesthetic-athlete.git
cd aesthetic-athlete
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root folder and configure your third-party API credentials:
```env
# Gemini API secret key. Never prefix with VITE_ to keep it invisible to the browser.
GEMINI_API_KEY=AIzaSy...

# Relational storage configuration (if manual setup)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```

### 4. Launch Development Environment
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live client.

### 5. Build for Production Deployment
```bash
# Compile and package client bundles and Node backend services
npm run build

# Boot the compiled Express services locally
npm run start
```

---

## 📱 Mobile Responsiveness Design Guidelines
This platform was built from the ground up for use in gym-floor environments.
- **Bottom Tab Bars**: Easy, thumb-reachable triggers for modern phones.
- **Large Touch Targets**: 44px+ bounding boxes for buttons and items.
- **Scroll Lock Overlays**: Prevents double-scrolling bugs.
- **Responsive Fluid Grids**: Automatically structures grids from desktop triple-columns to mobile bento-rows.

---

## 🔒 Security & Client Integrity
To ensure premium reliability and privacy:
- **Server API proxies**: All artificial intelligence prompts run fully inside `server.ts` to secure `GEMINI_API_KEY` from client browser inspections.
- **Local Fallback Protocols**: Automatic detection of offline dev states ensures full core operation even during connection outages.
