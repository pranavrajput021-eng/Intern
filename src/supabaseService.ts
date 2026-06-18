/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { 
  UserProfile, Workout, Exercise, Goal, WeightLog, 
  NutritionLog, WaterLog, StepLog, MeasurementLog, Achievement, AppNotification 
} from './types';

// Check for Supabase configuration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isForcedLocal = typeof window !== 'undefined' && localStorage.getItem('fitness_app_force_local_mode') === 'true';

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseAnonKey.includes('your-supabase-anon-key') &&
  !isForcedLocal;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean IDs generator
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper for local storage
const loadLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(`fitness_app_${key}`);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveLocal = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(`fitness_app_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Local Storage Save Error', err);
  }
};

// Seed initial values for Sandbox mode
const seedDemoData = () => {
  const now = new Date();
  const getPastDateStr = (daysAgo: number) => {
    const d = new Date();
    d.setDate(now.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const demoUser: UserProfile = {
    id: 'demo-user-id',
    name: 'Pranav Rajput',
    email: 'pranavrajput021@gmail.com',
    age: 26,
    gender: 'Male',
    height: 180,
    weight: 79.5,
    fitness_goal: 'Muscle Gain',
    fitness_level: 'Intermediate',
    workout_frequency: '3–4 days/week',
    created_at: getPastDateStr(30)
  };

  const demoWorkouts: Workout[] = [
    {
      id: 'w1',
      user_id: 'demo-user-id',
      workout_name: 'Hypertrophy Push',
      workout_type: 'Strength Training',
      duration: 55,
      calories_burned: 420,
      notes: 'Felt extremely strong on flat bench. Focus on depth.',
      created_at: getPastDateStr(3)
    },
    {
      id: 'w2',
      user_id: 'demo-user-id',
      workout_name: 'High Intensity Core & Cardio',
      workout_type: 'HIIT',
      duration: 35,
      calories_burned: 480,
      notes: 'Added interval sprints on treadmill at 15km/h.',
      created_at: getPastDateStr(1)
    },
    {
      id: 'w3',
      user_id: 'demo-user-id',
      workout_name: 'Leg Day Power',
      workout_type: 'Strength Training',
      duration: 65,
      calories_burned: 610,
      notes: 'Squats felt heavy, form was pristine. Deep exhaustion.',
      created_at: getPastDateStr(0)
    }
  ];

  const demoExercises: Exercise[] = [
    // w1 exercises
    {
      id: 'e1',
      workout_id: 'w1',
      exercise_name: 'Incline Dumbbell Press',
      category: 'Chest',
      sets: 4,
      reps: 10,
      weight: 32,
      rest_time: 90,
      notes: 'Last set was close to failure.'
    },
    {
      id: 'e2',
      workout_id: 'w1',
      exercise_name: 'Overhead Barbell Press',
      category: 'Shoulders',
      sets: 3,
      reps: 8,
      weight: 50,
      rest_time: 90
    },
    {
      id: 'e3',
      workout_id: 'w1',
      exercise_name: 'Triceps Rope Pushdown',
      category: 'Arms',
      sets: 3,
      reps: 12,
      weight: 25,
      rest_time: 60
    },
    // w2 exercises
    {
      id: 'e4',
      workout_id: 'w2',
      exercise_name: 'Hanging Leg Raises',
      category: 'Core',
      sets: 3,
      reps: 15,
      weight: 0,
      rest_time: 45
    },
    {
      id: 'e5',
      workout_id: 'w2',
      exercise_name: 'Sprint Intervals',
      category: 'Cardio',
      sets: 10,
      reps: 1,
      weight: 0,
      rest_time: 30,
      notes: '30s sprint, 30s rest'
    },
    // w3 exercises
    {
      id: 'e6',
      workout_id: 'w3',
      exercise_name: 'Barbell Back Squat',
      category: 'Legs',
      sets: 4,
      reps: 8,
      weight: 100,
      rest_time: 120,
      notes: 'Felt very explosive today.'
    },
    {
      id: 'e7',
      workout_id: 'w3',
      exercise_name: 'Romanian Deadlift',
      category: 'Legs',
      sets: 4,
      reps: 10,
      weight: 80,
      rest_time: 90
    }
  ];

  const demoGoals: Goal[] = [
    {
      id: 'g1',
      user_id: 'demo-user-id',
      goal_type: 'Weight',
      title: 'Gain 4 kg',
      target_value: 82,
      current_value: 79.5,
      unit: 'kg',
      created_at: getPastDateStr(30),
      estimated_completion: getPastDateStr(-15)
    },
    {
      id: 'g2',
      user_id: 'demo-user-id',
      goal_type: 'Workout',
      title: '4 Workouts per week',
      target_value: 4,
      current_value: 3,
      unit: 'workouts',
      created_at: getPastDateStr(4),
      estimated_completion: getPastDateStr(-2)
    },
    {
      id: 'g3',
      user_id: 'demo-user-id',
      goal_type: 'Health',
      title: 'Drink 3L of water daily',
      target_value: 3000,
      current_value: 2250,
      unit: 'ml',
      created_at: getPastDateStr(0),
      estimated_completion: getPastDateStr(-1)
    }
  ];

  const demoWeightLogs: WeightLog[] = [
    { id: 'wt1', user_id: 'demo-user-id', weight: 78.2, date: getPastDateStr(14) },
    { id: 'wt2', user_id: 'demo-user-id', weight: 78.5, date: getPastDateStr(10) },
    { id: 'wt3', user_id: 'demo-user-id', weight: 79.1, date: getPastDateStr(7) },
    { id: 'wt4', user_id: 'demo-user-id', weight: 79.3, date: getPastDateStr(3) },
    { id: 'wt5', user_id: 'demo-user-id', weight: 79.5, date: getPastDateStr(0) }
  ];

  const demoNutritionLogs: NutritionLog[] = [
    { id: 'n1', user_id: 'demo-user-id', food_name: 'Oats with Whey & Banana', quantity: '1 bowl', calories: 520, protein: 42, carbs: 65, fats: 8, date: getPastDateStr(0) },
    { id: 'n2', user_id: 'demo-user-id', food_name: 'Chicken Rice & Broccoli', quantity: '400g', calories: 680, protein: 55, carbs: 80, fats: 10, date: getPastDateStr(0) },
    { id: 'n3', user_id: 'demo-user-id', food_name: 'Salmon with Sweet Potato', quantity: '350g', calories: 610, protein: 45, carbs: 50, fats: 18, date: getPastDateStr(0) },
    { id: 'n4', user_id: 'demo-user-id', food_name: 'Casein Shake & Almonds', quantity: '1 serving', calories: 310, protein: 30, carbs: 10, fats: 12, date: getPastDateStr(0) }
  ];

  const demoWaterLogs: WaterLog[] = [
    { id: 'wat1', user_id: 'demo-user-id', amount: 2500, date: getPastDateStr(4) },
    { id: 'wat2', user_id: 'demo-user-id', amount: 3000, date: getPastDateStr(3) },
    { id: 'wat3', user_id: 'demo-user-id', amount: 2750, date: getPastDateStr(2) },
    { id: 'wat4', user_id: 'demo-user-id', amount: 3250, date: getPastDateStr(1) },
    { id: 'wat5', user_id: 'demo-user-id', amount: 2250, date: getPastDateStr(0) }
  ];

  const demoStepLogs: StepLog[] = [
    { id: 'st1', user_id: 'demo-user-id', steps: 8400, distance: 6.2, date: getPastDateStr(4) },
    { id: 'st2', user_id: 'demo-user-id', steps: 11200, distance: 8.4, date: getPastDateStr(3) },
    { id: 'st3', user_id: 'demo-user-id', steps: 9500, distance: 7.1, date: getPastDateStr(2) },
    { id: 'st4', user_id: 'demo-user-id', steps: 12300, distance: 9.2, date: getPastDateStr(1) },
    { id: 'st5', user_id: 'demo-user-id', steps: 10200, distance: 7.6, date: getPastDateStr(0) }
  ];

  const demoMeasurementLogs: MeasurementLog[] = [
    { id: 'm1', user_id: 'demo-user-id', chest: 104, waist: 82, hips: 98, arms: 37, thighs: 59, date: getPastDateStr(14) },
    { id: 'm2', user_id: 'demo-user-id', chest: 105, waist: 81.5, hips: 98, arms: 37.5, thighs: 59.5, date: getPastDateStr(0) }
  ];

  const demoAchievements: Achievement[] = [
    { id: 'a1', achievement_key: 'first_workout', unlocked_at: getPastDateStr(14) },
    { id: 'a2', achievement_key: 'streak_7', unlocked_at: getPastDateStr(10) },
    { id: 'a3', achievement_key: 'steps_10k', unlocked_at: getPastDateStr(3) }
  ];

  const demoNotifications: AppNotification[] = [
    { id: 'not1', user_id: 'demo-user-id', type: 'workout', title: 'Workout Complete!', message: 'Amazing hyperthrophy session. You burned 420 kcal!', created_at: getPastDateStr(1), read: false },
    { id: 'not2', user_id: 'demo-user-id', type: 'goal', title: 'Goal Unlocked!', message: 'You have completed your steps goal of 10,000 steps today!', created_at: getPastDateStr(0), read: false },
    { id: 'not3', user_id: 'demo-user-id', type: 'water', title: 'Hydration Target Passed', message: 'Way to go keeping hydrated today.', created_at: getPastDateStr(0), read: true }
  ];

  saveLocal('users', [demoUser]);
  saveLocal('workouts', demoWorkouts);
  saveLocal('exercises', demoExercises);
  saveLocal('goals', demoGoals);
  saveLocal('weight_logs', demoWeightLogs);
  saveLocal('nutrition_logs', demoNutritionLogs);
  saveLocal('water_logs', demoWaterLogs);
  saveLocal('step_logs', demoStepLogs);
  saveLocal('measurement_logs', demoMeasurementLogs);
  saveLocal('achievements', demoAchievements);
  saveLocal('notifications', demoNotifications);

  return demoUser;
};

// Initialize Database Storage
if (!localStorage.getItem('fitness_app_seed_v1')) {
  seedDemoData();
  localStorage.setItem('fitness_app_seed_v1', 'seeded');
}

export const resetToDemoData = () => {
  localStorage.removeItem('fitness_app_seed_v1');
  seedDemoData();
  localStorage.setItem('fitness_app_seed_v1', 'seeded');
  window.location.reload();
};

// Current Session Handling
let activeSessionUser: UserProfile | null = loadLocal<UserProfile | null>('active_user', null);

export const supabaseService = {
  // --- AUTH SERVICES ---
  async getCurrentUser(): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data && !error) return data as UserProfile;
          // Fallback to auth payload if profile table is empty/errors
          return {
            id: user.id,
            name: user.user_metadata?.name || 'User',
            email: user.email || '',
          };
        }
      } catch (err) {
        console.error('Supabase Auth error', err);
      }
    }
    // Fallback to local Session
    return activeSessionUser;
  },

  async login(email: string, _password?: string): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: _password || 'password123',
      });
      if (error) throw error;
      if (data?.user) {
        // Fetch or create user model
        const { data: profile, error: profileErr } = await supabase
          .from('Users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile && !profileErr) {
          return profile as UserProfile;
        } else {
          // Create default profile
          const newProf: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: email,
          };
          await supabase.from('Users').upsert(newProf);
          return newProf;
        }
      }
    }

    // Local Storage login fallback
    const users = loadLocal<UserProfile[]>('users', []);
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Create user if email not found (simulating dynamic sandboxed registration/quick-test)
      user = {
        id: generateId(),
        name: email.split('@')[0],
        email: email,
      };
      users.push(user);
      saveLocal('users', users);
    }
    activeSessionUser = user;
    saveLocal('active_user', user);
    return user;
  },

  async register(name: string, email: string, _password?: string): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: _password || 'password123',
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      if (data?.user) {
        const newProf: UserProfile = {
          id: data.user.id,
          name,
          email,
        };
        const { error: dbErr } = await supabase.from('Users').insert(newProf);
        if (dbErr) console.error('Error writing registered user to DB table', dbErr);
        return newProf;
      }
    }

    // Local Storage registration fallback
    const users = loadLocal<UserProfile[]>('users', []);
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }
    const newProf: UserProfile = {
      id: generateId(),
      name,
      email,
      created_at: new Date().toISOString()
    };
    users.push(newProf);
    saveLocal('users', users);
    activeSessionUser = newProf;
    saveLocal('active_user', newProf);
    return newProf;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    activeSessionUser = null;
    localStorage.removeItem('fitness_app_active_user');
  },

  async saveOnboarding(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('Not logged in');

    const updatedProfile: UserProfile = {
      ...currentUser,
      ...profileData,
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('Users')
        .upsert(updatedProfile);
      if (error) throw error;
    } else {
      const users = loadLocal<UserProfile[]>('users', []);
      const index = users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        users[index] = updatedProfile;
      } else {
        users.push(updatedProfile);
      }
      saveLocal('users', users);
      activeSessionUser = updatedProfile;
      saveLocal('active_user', updatedProfile);
    }

    return updatedProfile;
  },

  // --- WORKOUTS ---
  async getWorkouts(): Promise<Workout[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('Workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Workout[];
    }

    const workouts = loadLocal<Workout[]>('workouts', []);
    return workouts
      .filter(w => w.user_id === user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createWorkout(workout: Omit<Workout, 'id' | 'user_id' | 'created_at'>, exercises: Omit<Exercise, 'id' | 'workout_id'>[]): Promise<Workout> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const newWorkout: Workout = {
      ...workout,
      id: generateId(),
      user_id: user.id,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error: wError } = await supabase.from('Workouts').insert(newWorkout);
      if (wError) throw wError;

      const exerciseRecords: Exercise[] = exercises.map(ex => ({
        ...ex,
        id: generateId(),
        workout_id: newWorkout.id
      }));

      const { error: eError } = await supabase.from('Exercises').insert(exerciseRecords);
      if (eError) throw eError;
    } else {
      // Save Workout locally
      const workouts = loadLocal<Workout[]>('workouts', []);
      workouts.unshift(newWorkout);
      saveLocal('workouts', workouts);

      // Save Exercises locally
      const currentExercises = loadLocal<Exercise[]>('exercises', []);
      const newExercises: Exercise[] = exercises.map(ex => ({
        ...ex,
        id: generateId(),
        workout_id: newWorkout.id
      }));
      saveLocal('exercises', [...newExercises, ...currentExercises]);

      // Achievement processing: check count
      const userWorkouts = workouts.filter(w => w.user_id === user.id);
      if (userWorkouts.length === 1) {
        await this.unlockAchievement('first_workout');
      } else if (userWorkouts.length >= 10) {
        await this.unlockAchievement('streak_7'); // just unlocked
      }
      
      // Auto triggers notification
      await this.addNotification('workout', 'Workout Logged!', `Successfully finished "${newWorkout.workout_name}"! Calories burned: ${newWorkout.calories_burned} kcal.`);
    }

    return newWorkout;
  },

  // --- EXERCISES ---
  async getExercises(workoutId: string): Promise<Exercise[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('Exercises')
        .select('*')
        .eq('workout_id', workoutId);
      if (error) throw error;
      return (data || []) as Exercise[];
    }

    const exercises = loadLocal<Exercise[]>('exercises', []);
    return exercises.filter(e => e.workout_id === workoutId);
  },

  // --- GOALS ---
  async getGoals(): Promise<Goal[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('Goals')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data || []) as Goal[];
    }

    const goals = loadLocal<Goal[]>('goals', []);
    return goals.filter(g => g.user_id === user.id);
  },

  async createGoal(goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>): Promise<Goal> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      user_id: user.id,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('Goals').insert(newGoal);
      if (error) throw error;
    } else {
      const goals = loadLocal<Goal[]>('goals', []);
      goals.unshift(newGoal);
      saveLocal('goals', goals);
    }

    return newGoal;
  },

  async updateGoalProgress(goalId: string, value: number): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('Goals')
        .update({ current_value: value })
        .eq('id', goalId);
      if (error) throw error;
    } else {
      const goals = loadLocal<Goal[]>('goals', []);
      const index = goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        goals[index].current_value = value;
        // Check if goal met
        if (goals[index].current_value >= goals[index].target_value && goals[index].goal_type === 'Weight') {
          await this.unlockAchievement('first_weight_goal');
        }
        saveLocal('goals', goals);
      }
    }
  },

  // --- WEIGHT LOGS ---
  async getWeightLogs(): Promise<WeightLog[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('WeightLogs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      if (error) throw error;
      return (data || []) as WeightLog[];
    }

    const logs = loadLocal<WeightLog[]>('weight_logs', []);
    return logs
      .filter(l => l.user_id === user.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async logWeight(weight: number, dateStr?: string): Promise<WeightLog> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const date = dateStr || new Date().toISOString().split('T')[0];
    const newLog: WeightLog = {
      id: generateId(),
      user_id: user.id,
      weight,
      date
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('WeightLogs').insert(newLog);
      if (error) throw error;
      
      // Update the user's current weight in the primary Profile as well
      await supabase.from('Users').update({ weight }).eq('id', user.id);
    } else {
      const logs = loadLocal<WeightLog[]>('weight_logs', []);
      logs.push(newLog);
      saveLocal('weight_logs', logs);

      // Save on user PROFILE
      const users = loadLocal<UserProfile[]>('users', []);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx].weight = weight;
        saveLocal('users', users);
        activeSessionUser = users[idx];
        saveLocal('active_user', users[idx]);
      }

      // Check goals related to weight
      const goals = loadLocal<Goal[]>('goals', []);
      const weightGoal = goals.find(g => g.user_id === user.id && g.goal_type === 'Weight');
      if (weightGoal) {
        weightGoal.current_value = weight;
        saveLocal('goals', goals);
      }
    }

    return newLog;
  },

  // --- MEASUREMENTS ---
  async getMeasurementLogs(): Promise<MeasurementLog[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      // In Supabase we check if custom table exists, or we store measurement points dynamically
      const { data, error } = await supabase
        .from('MeasurementLogs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      if (!error && data) return data as MeasurementLog[];
    }

    const logs = loadLocal<MeasurementLog[]>('measurement_logs', []);
    return logs
      .filter(l => l.user_id === user.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async logMeasurements(measurements: Omit<MeasurementLog, 'id' | 'user_id' | 'date'>): Promise<MeasurementLog> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const newLog: MeasurementLog = {
      id: generateId(),
      user_id: user.id,
      ...measurements,
      date: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('MeasurementLogs').insert(newLog);
    } else {
      const logs = loadLocal<MeasurementLog[]>('measurement_logs', []);
      logs.push(newLog);
      saveLocal('measurement_logs', logs);
    }

    return newLog;
  },

  // --- NUTRITION LOGS ---
  async getNutritionLogs(dateStr?: string): Promise<NutritionLog[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const d = dateStr || new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('NutritionLogs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', d);
      if (error) throw error;
      return (data || []) as NutritionLog[];
    }

    const logs = loadLocal<NutritionLog[]>('nutrition_logs', []);
    return logs.filter(l => l.user_id === user.id && l.date === d);
  },

  async logFood(food: Omit<NutritionLog, 'id' | 'user_id' | 'date'>): Promise<NutritionLog> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const newLog: NutritionLog = {
      ...food,
      id: generateId(),
      user_id: user.id,
      date: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('NutritionLogs').insert(newLog);
      if (error) throw error;
    } else {
      const logs = loadLocal<NutritionLog[]>('nutrition_logs', []);
      logs.push(newLog);
      saveLocal('nutrition_logs', logs);
    }

    return newLog;
  },

  // --- WATER LOGS ---
  async getWaterLogs(dateStr?: string): Promise<WaterLog[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('WaterLogs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate);
      if (error) throw error;
      return (data || []) as WaterLog[];
    }

    const logs = loadLocal<WaterLog[]>('water_logs', []);
    return logs.filter(l => l.user_id === user.id && l.date === targetDate);
  },

  async logWater(amount: number): Promise<WaterLog> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const date = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured && supabase) {
      const { data: existing } = await supabase
        .from('WaterLogs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date);

      if (existing && existing.length > 0) {
        const total = existing[0].amount + amount;
        const { error } = await supabase
          .from('WaterLogs')
          .update({ amount: total })
          .eq('id', existing[0].id);
        if (error) throw error;
        return { ...existing[0], amount: total };
      } else {
        const newLog: WaterLog = {
          id: generateId(),
          user_id: user.id,
          amount,
          date
        };
        const { error } = await supabase.from('WaterLogs').insert(newLog);
        if (error) throw error;
        return newLog;
      }
    }

    // Local Storage
    const logs = loadLocal<WaterLog[]>('water_logs', []);
    const index = logs.findIndex(l => l.user_id === user.id && l.date === date);
    
    if (index !== -1) {
      logs[index].amount += amount;
      saveLocal('water_logs', logs);
      return logs[index];
    } else {
      const newLog: WaterLog = {
        id: generateId(),
        user_id: user.id,
        amount,
        date
      };
      logs.push(newLog);
      saveLocal('water_logs', logs);
      return newLog;
    }
  },

  // --- STEP COUNTER ---
  async getStepLogs(): Promise<StepLog[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('StepLogs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      if (!error && data) return data as StepLog[];
    }

    const logs = loadLocal<StepLog[]>('step_logs', []);
    return logs
      .filter(l => l.user_id === user.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async logSteps(steps: number, distance: number, dateStr?: string): Promise<StepLog> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const date = dateStr || new Date().toISOString().split('T')[0];
    const newLog: StepLog = {
      id: generateId(),
      user_id: user.id,
      steps,
      distance,
      date
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('StepLogs').insert(newLog);
    } else {
      const logs = loadLocal<StepLog[]>('step_logs', []);
      logs.push(newLog);
      saveLocal('step_logs', logs);

      if (steps >= 10000) {
        await this.unlockAchievement('steps_10k');
      }
    }

    return newLog;
  },

  // --- ACHIEVEMENTS ---
  async getAchievements(): Promise<Achievement[]> {
    if (isSupabaseConfigured && supabase) {
      // In Supabase, can fetch user's unlocked achievements
      const { data } = await supabase
        .from('Achievements')
        .select('*');
      return (data || []) as Achievement[];
    }

    return loadLocal<Achievement[]>('achievements', []);
  },

  async unlockAchievement(achievementKey: string): Promise<void> {
    const achievements = loadLocal<Achievement[]>('achievements', []);
    if (achievements.find(a => a.achievement_key === achievementKey)) return; // Already unlocked

    const newUnlock: Achievement = {
      id: generateId(),
      achievement_key: achievementKey,
      unlocked_at: new Date().toISOString()
    };

    achievements.push(newUnlock);
    saveLocal('achievements', achievements);

    // Create custom notifications
    const badgesFriendlyNames: Record<string, string> = {
      first_workout: 'First Workout Complete',
      streak_7: '7 Day Workout Streak',
      streak_30: '30 Day Workout Streak',
      workouts_100: 'Century Club (100 Workouts)',
      first_weight_goal: 'First Weight Goal Achieved',
      steps_10k: '10k Steps Club'
    };

    await this.addNotification(
      'goal',
      'Achievement Unlocked!',
      `Congratulations! You unlocked the "${badgesFriendlyNames[achievementKey] || achievementKey}" badge!`
    );
  },

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<AppNotification[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('Notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return (data || []) as AppNotification[];
    }

    const notifs = loadLocal<AppNotification[]>('notifications', []);
    return notifs
      .filter(n => n.user_id === user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async addNotification(type: string, title: string, message: string): Promise<AppNotification> {
    const user = await this.getCurrentUser();
    const userId = user ? user.id : 'demo-user-id';

    const newNotif: AppNotification = {
      id: generateId(),
      user_id: userId,
      type,
      title,
      message,
      created_at: new Date().toISOString(),
      read: false
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('Notifications').insert(newNotif);
    } else {
      const notifs = loadLocal<AppNotification[]>('notifications', []);
      notifs.unshift(newNotif);
      saveLocal('notifications', notifs);
    }

    return newNotif;
  },

  async markAllNotificationsRead(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('Notifications')
        .update({ read: true })
        .eq('user_id', user.id);
    } else {
      const notifs = loadLocal<AppNotification[]>('notifications', []);
      notifs.forEach(n => {
        if (n.user_id === user.id) n.read = true;
      });
      saveLocal('notifications', notifs);
    }
  },

  // --- ADMIN ANALYTICS ---
  async getAdminStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalWorkouts: number;
    averageWorkoutsPerUser: number;
    systemLogsCount: number;
  }> {
    const users = loadLocal<UserProfile[]>('users', []);
    const workouts = loadLocal<Workout[]>('workouts', []);
    const todayStr = new Date().toISOString().split('T')[0];

    // Simulating active users
    const waterLogsCount = loadLocal<any[]>('water_logs', []).length;
    
    return {
      totalUsers: Math.max(users.length, 12),
      activeUsers: Math.max(Math.floor(users.length * 0.75), 8),
      totalWorkouts: Math.max(workouts.length, 34),
      averageWorkoutsPerUser: workouts.length ? Number((workouts.length / Math.max(users.length, 1)).toFixed(1)) : 4.2,
      systemLogsCount: waterLogsCount + workouts.length + 12
    };
  }
};
