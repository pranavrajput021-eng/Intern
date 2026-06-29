/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number; // in cm
  weight?: number; // in kg
  fitness_goal?: string; // e.g. "Weight Loss", "Muscle Gain"
  fitness_level?: string; // e.g. "Beginner", "Intermediate", "Advanced"
  workout_frequency?: string; // e.g. "3-4 days/week"
  created_at?: string;
  avatar?: string;
  bio?: string;
  role?: 'user' | 'moderator' | 'admin';
  is_banned?: boolean;
  mfa_enabled?: boolean;
}

export interface Workout {
  id: string;
  user_id: string;
  workout_name: string;
  workout_type: string; // e.g. "Strength Training", "Cardio", "HIIT", etc.
  duration: number; // in minutes
  calories_burned: number;
  notes?: string;
  created_at: string; // date string
}

export interface Exercise {
  id: string;
  workout_id: string;
  exercise_name: string;
  category: string; // e.g. "Chest", "Legs", etc.
  sets: number;
  reps: number;
  weight: number; // in kg
  rest_time?: number; // in seconds
  notes?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_type: string; // e.g. "Weight", "Workout", "Health"
  title: string; // e.g. "Lose 5 kg", "10,000 steps daily"
  target_value: number;
  current_value: number;
  unit: string; // e.g. "kg", "workouts", "steps"
  created_at: string;
  estimated_completion?: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight: number;
  date: string; // YYYY-MM-DD
}

export interface NutritionLog {
  id: string;
  user_id: string;
  food_name: string;
  quantity?: string;
  calories: number;
  protein: number; // in g
  carbs: number; // in g
  fats: number; // in g
  date: string; // YYYY-MM-DD
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount: number; // ml
  date: string; // YYYY-MM-DD
}

export interface StepLog {
  id: string;
  user_id: string;
  steps: number;
  distance: number; // in km
  date: string; // YYYY-MM-DD
}

export interface MeasurementLog {
  id: string;
  user_id: string;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  date: string; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  achievement_key: string; // e.g. "first_workout", "streak_7", etc.
  unlocked_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: string; // "workout", "water", "goal", "summary"
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

