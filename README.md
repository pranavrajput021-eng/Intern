# Aesthetic Athlete

A full-stack fitness tracking and performance management platform that helps users monitor workouts, nutrition, hydration, goals, and overall fitness progress in one place.

## Features
- **Secure User Authentication**: Seamless and robust user email sign-up/sign-in flows with custom RLS guardrails.
- **Workout Tracking & History**: High-performance dashboard to plan, execute, search, and store historical training sets.
- **Nutrition & Hydration Monitoring**: Beautiful macro-nutrient track sliders and live hydration levels.
- **Goal Setting & Progress Tracking**: Set target goals and watch progress rings fill up as achievements are unlocked.
- **Interactive Analytics Dashboard**: Beautiful charts showing muscle group distribution, weight logs, and daily step tracking using Recharts.
- **Athlete Profile Management**: Full custom metrics calculation (BMI, BMR, daily targets) tailored specifically to body types.
- **Notification System**: Built-in alert hub prompting users of milestones and daily target achievements.

## Tech Stack
### Frontend
- **React** (v18+) with functional components and modern hooks.
- **TypeScript** for absolute type safety.
- **Vite** as an ultra-fast, modern module builder.
- **Tailwind CSS** for responsive design and custom grid system layouts.

### Backend & Database
- **Supabase** for user authentication and backend storage.
- **PostgreSQL** relational database.

### Data Visualization
- **Recharts** for elegant analytics visualization.

## Installation

To run this project locally, clone the repository and run the following commands:

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

## Environment Variables

Create a `.env.local` or `.env` file in the root directory and add your credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Future Improvements & Roadmap
- AI-powered custom workout planning and dietary recommendations.
- Multi-user community feeds and shared workout achievements.
- Real-time active step tracking & wearable integrations (Fitbit, Garmin, Apple Health).
