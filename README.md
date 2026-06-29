# Aesthetic Athlete: Core Fitness Tracker & AI Coaching Dashboard

Aesthetic Athlete is a responsive full-stack fitness, biometric, and nutrition tracking application. It features a modern, interactive design, a high-contrast dark theme, and detailed analytical charts to help athletes monitor and achieve their fitness goals.

---

## What Users Can Do

### 1. Performance Overview & Dashboard
- **Daily Progress at a Glance**: View real-time progress on daily activity metrics, including step counts, active calories burned, training duration, and water intake.
- **Goal Checking**: Instantly check current status against personalized targets with visual progress bars.
- **Simulated Bio-Indicators**: Interact with real-time biometric visual aids, including an animated heartbeat indicator and simulated activity trackers.
- **Flexible Styling Options**: Toggle easily between a custom-designed dark theme and a high-contrast light theme for optimal readability in any environment.

### 2. Workout Logging & Pacing Manager
- **Active Exercise Logging**: Log workouts in real-time, tracking exercise types, working weight, repetitions, and total sets.
- **Built-in Rest Metronome**: Stay on track during workouts with configurable rest timers and an interactive metronome countdown ring.
- **Audio Prompts**: Hear synthesized audio alerts directly in the browser when a rest timer completes.
- **Workout History**: Look back at previously logged workouts to monitor strength development and training volume over time.

### 3. Nutrition & Hydration Tracker
- **Nutritional Calibrations**: Log meals and snacks to track daily calorie, protein, carbohydrate, and fat intake against calculated goals.
- **Macronutrient Balances**: View current daily macronutrient distributions using responsive visual gauges.
- **Hydration Ledger**: Quick-log water intake using pre-set increment buttons to maintain proper hydration levels.

### 4. Progress Analytics Dashboard
- **Long-term Progress Charts**: Review interactive charts displaying body weight fluctuations, daily step trends, and workout frequencies over several weeks or months.
- **Body Measurements Tracker**: Log and monitor physical measurements for key areas (chest, biceps, waist, hips, and thighs) to see physical transformations.
- **Muscle Target Analysis**: View visual breakdowns showing which muscle groups receive the most focus and intensity.

### 5. Personal AI Fitness Coach
- **Tailored Guidance**: Ask fitness, supplement, and nutrition questions to receive tailored advice.
- **Quick Prompt Cards**: Click pre-defined shortcut buttons for advice on workouts, recovery, supplements, or dietary habits.
- **History Retention**: Access past coaching conversations, which are saved locally under individual accounts.
- **Local Fallback Mode**: Receive reliable, rules-based feedback instantly if the network is disconnected or the AI backend experiences a timeout.

### 6. Account Onboarding & Personalization
- **Secure Access**: Register and log in to protect and sync workout logs and personal history.
- **Profile Calibration**: Customize personal height, weight, activity levels, and fitness goals (such as muscle growth, fat loss, or body recomposition).

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, and Framer Motion for smooth transitions.
- **Backend API Server**: Express server hosting secure endpoints and managing safe routing.
- **AI Integration**: Server-side `@google/genai` integration keeping API keys protected.
- **Data Synchronization**: Database connections for user-specific logs, nutrition records, goals, and active sessions.

---

## Directory Structure

```text
├── src/
│   ├── components/                # Modular UI views and panels
│   │   ├── DashboardView.tsx      # Performance overview and real-time dashboard
│   │   ├── WorkoutManager.tsx     # Active workout tracker and rest metronome
│   │   ├── NutritionAndHydration.tsx # Meal tracker and hydration controls
│   │   ├── AnalyticsView.tsx      # Interactive charts and body measurements
│   │   ├── AestheticCoachChatbot.tsx # AI fitness coach and prompt library
│   │   ├── AuthScreen.tsx         # User onboarding and login interface
│   │   ├── ProfilePage.tsx        # Profile configuration and goal settings
│   │   └── ...
│   ├── supabaseService.ts         # Supabase client and sync operations
│   ├── types.ts                   # Standard TypeScript interfaces
│   ├── main.tsx                   # Main entry point
│   └── App.tsx                    # Core app layout and page router
├── server.ts                      # Express API proxy and static asset server
├── package.json                   # Dependencies and npm scripts
└── README.md                      # Project Documentation
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root:
```env
# Server secret key (never exposed to browser)
GEMINI_API_KEY=your_gemini_api_key

# Supabase coordinates
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build and Launch in Production
```bash
# Compiles the client code and bundles server.ts into dist/server.cjs
npm run build

# Runs the compiled production build
npm run start
```
