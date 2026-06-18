/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabaseService } from '../supabaseService';
import { UserProfile } from '../types';
import { 
  KeyRound, Mail, User, ShieldCheck, Dumbbell, 
  Sparkles, CheckCircle2, ChevronRight, Gauge, 
  HelpCircle, LogIn, UserPlus, Info
} from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'register' | 'onboarding' | 'forgot_password';

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  // Mode selection
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Onboarding parameters
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [primaryGoal, setPrimaryGoal] = useState('General Fitness');
  const [workoutFrequency, setWorkoutFrequency] = useState('3–4 days/week');

  // Error/loading handlers
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation warnings derived from state
  const isAgeWarn = age !== '' && (age < 10 || age > 100);
  const isHeightWarn = height !== '' && (height < 120 || height > 220);
  const isWeightWarn = weight !== '' && (weight < 30 || weight > 250);

  // Authenticated placeholder user till onboarding finished
  const [tempUser, setTempUser] = useState<UserProfile | null>(null);

  const resetMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      const loggedUser = await supabaseService.login(email, password);
      // If user does not have onboarding set yet, guide them to Onboarding
      if (!loggedUser.fitness_goal) {
        setTempUser(loggedUser);
        setMode('onboarding');
      } else {
        onAuthSuccess(loggedUser);
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please double check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      const newUser = await supabaseService.register(name, email, password);
      setTempUser(newUser);
      setSuccessMsg('Account created successfully! Let\'s setup your fitness goals.');
      setTimeout(() => {
        setMode('onboarding');
        resetMessages();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;

    if (age === '') {
      setError('❌ Please input your age.');
      return;
    }
    if (age < 10 || age > 100) {
      setError('❌ Age must be between 10 and 100 years.');
      return;
    }

    if (weight === '') {
      setError('❌ Please input your weight.');
      return;
    }
    if (weight < 30 || weight > 250) {
      setError('❌ Weight must be between 30kg and 250kg.');
      return;
    }

    if (height === '') {
      setError('❌ Please input your height.');
      return;
    }
    if (height < 120 || height > 220) {
      setError('❌ Height must be between 120cm and 220cm.');
      return;
    }

    setLoading(true);
    resetMessages();
    try {
      const onboardedProfile = await supabaseService.saveOnboarding({
        ...tempUser,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        fitness_goal: primaryGoal,
        fitness_level: fitnessLevel,
        workout_frequency: workoutFrequency,
      });

      // Quick log initial weight inside user session database logs
      await supabaseService.logWeight(Number(weight));
      
      // Seed step, water and health targets
      const stepGoalVal = primaryGoal === 'Weight Loss' ? 12000 : 10000;
      const waterGoalVal = gender === 'Male' ? 3500 : 2500;
      await supabaseService.createGoal({
        goal_type: 'Health',
        title: 'Daily Step Challenge',
        target_value: stepGoalVal,
        current_value: 0,
        unit: 'steps'
      });
      await supabaseService.createGoal({
        goal_type: 'Health',
        title: 'Hydration Target',
        target_value: waterGoalVal,
        current_value: 0,
        unit: 'ml'
      });

      setSuccessMsg('Onboarding complete! Loading your active training engine...');
      setTimeout(() => {
        onAuthSuccess(onboardedProfile);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed saving onboarding selections.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }
    resetMessages();
    setSuccessMsg('If this account exists, we have sent password reset instructions to your inbox.');
  };

  return (
    <div id="auth-screen-layout" className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Premium Cyber Aesthetic Background Accent */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      
      {/* Clean Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="w-full max-w-lg z-10 transition duration-300">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-505 via-emerald-400 to-blue-500 p-[1.5px] shadow-lg shadow-emerald-500/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0A0A] rounded-2xl flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-emerald-400 to-blue-400 font-sans">
            AESTHETIC ATHLETE
          </h1>
          <p className="text-sm font-light text-neutral-400 max-w-sm mt-1">
            Engineered workout tracking & hyper-personalized analytics.
          </p>
        </div>



        {/* Card and Forms */}
        <div id="auth-form-card" className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-950/20 border border-red-800/35 text-xs text-red-400 text-left space-y-3 shadow-inner">
              <p className="font-medium">💡 {error}</p>
              {(error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('rate_limit')) && (
                <div className="pt-2 border-t border-red-900/30 text-[11px] text-neutral-400 leading-normal">
                  Supabase free plan allows a maximum of 3 authentication emails per hour. Please wait a bit before requesting another attempt.
                </div>
              )}
              {(error.toLowerCase().includes('credentials') || error.toLowerCase().includes('confirm') || error.toLowerCase().includes('verified')) && (
                <div className="pt-2 border-t border-red-900/30 space-y-2">
                  <p className="text-[11px] text-neutral-300 leading-normal">
                    <strong>Why is this happening?</strong> 
                    <br />
                    By default, new Supabase projects require you to confirm your email before logging in. If you didn't click a verification link or if email delivery failed, Supabase blocks sign-in and reports "Invalid login credentials".
                  </p>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-red-950/40 space-y-1.5">
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">🛠️ How to fix in Supabase:</p>
                    <ol className="list-decimal list-inside text-[10px] text-neutral-400 space-y-1 pl-1">
                      <li>Go to your <strong className="text-neutral-300">Supabase Dashboard</strong></li>
                      <li>Select <strong className="text-neutral-300">Authentication</strong> &gt; <strong className="text-neutral-300">Providers</strong> &gt; <strong className="text-neutral-300">Email</strong></li>
                      <li>Turn OFF <strong className="text-neutral-300">"Confirm Email"</strong> and save changes</li>
                    </ol>
                  </div>
                </div>
              )}
              {(error.toLowerCase().includes('rls') || error.toLowerCase().includes('row-level') || error.toLowerCase().includes('policy') || error.toLowerCase().includes('violat') || error.toLowerCase().includes('security')) && (
                <div className="pt-2 border-t border-red-900/30 space-y-2">
                  <p className="text-[11px] text-neutral-300 leading-normal">
                    <strong>💥 Row-Level Security (RLS) Policy Issue detected:</strong> 
                    <br />
                    In Supabase, having a table isn't enough; you must explicitly define permission policies (like allowing users to insert their own records). Let's fix this in 10 seconds!
                  </p>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-red-950/40 space-y-2 text-left">
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">📋 Run this SQL in your Supabase SQL Editor:</p>
                    <textarea 
                      readOnly 
                      value={`-- Drop existing broken policies if any
drop policy if exists "Allow check and upsert for self" on public."Users";
drop policy if exists "Allow workouts control for self" on public."Workouts";
drop policy if exists "Allow exercise operations" on public."Exercises";
drop policy if exists "Allow goals control for self" on public."Goals";
drop policy if exists "Allow weight logs control for self" on public."WeightLogs";
drop policy if exists "Allow measurement logs control for self" on public."MeasurementLogs";
drop policy if exists "Allow nutrition logs control for self" on public."NutritionLogs";
drop policy if exists "Allow water logs control for self" on public."WaterLogs";
drop policy if exists "Allow step logs control for self" on public."StepLogs";

-- 1. Setup policies for Users
alter table public."Users" enable row level security;
create policy "Allow check and upsert for self" on public."Users"
  for all using (auth.uid()::text = id) with check (auth.uid()::text = id);

-- 2. Setup policies for Workouts
alter table public."Workouts" enable row level security;
create policy "Allow workouts control for self" on public."Workouts"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- 3. Setup policies for Exercises
alter table public."Exercises" enable row level security;
create policy "Allow exercise operations" on public."Exercises"
  for all using (true) with check (true);

-- 4. Setup policies for Goals
alter table public."Goals" enable row level security;
create policy "Allow goals control for self" on public."Goals"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- 5. Setup policies for WeightLogs
alter table public."WeightLogs" enable row level security;
create policy "Allow weight logs control for self" on public."WeightLogs"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- 6. Setup policies for MeasurementLogs
alter table public."MeasurementLogs" enable row level security;
create policy "Allow measurement logs control for self" on public."MeasurementLogs"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- 7. Setup policies for NutritionLogs
alter table public."NutritionLogs" enable row level security;
create policy "Allow nutrition logs control for self" on public."NutritionLogs"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- 8. Setup policies for WaterLogs
alter table public."WaterLogs" enable row level security;
create policy "Allow water logs control for self" on public."WaterLogs"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- 9. Setup policies for StepLogs
alter table public."StepLogs" enable row level security;
create policy "Allow step logs control for self" on public."StepLogs"
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);`}
                      onClick={(e) => {
                        (e.target as HTMLTextAreaElement).select();
                        navigator.clipboard.writeText((e.target as HTMLTextAreaElement).value);
                      }}
                      className="w-full h-32 bg-zinc-950 text-neutral-300 font-mono text-[9px] p-2 rounded border border-zinc-800 focus:outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                    />
                    <p className="text-[9px] text-zinc-400">💡 <strong>Tip:</strong> Click inside the text box above to auto-copy the code, open your <span className="text-zinc-200 font-medium">Supabase Console &gt; SQL Editor</span>, paste and run it!</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/25 border border-emerald-800/30 text-xs text-emerald-400 text-left flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 text-left">
              <div className="flex justify-between items-end border-b border-neutral-800/50 pb-3">
                <span className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-emerald-400" />
                  Sign In
                </span>
                <button 
                  type="button" 
                  onClick={() => { setMode('register'); resetMessages(); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  Create an account
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition font-sans placeholder-neutral-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs text-neutral-400 font-medium">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot_password'); resetMessages(); }}
                    className="text-[11px] text-neutral-500 hover:text-emerald-400 transition"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition font-sans placeholder-neutral-600"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-800 bg-[#0D0D0D] text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-neutral-400 select-none">Remember my session</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 transition"
              >
                {loading ? 'Securing Link...' : 'Access Dashboard'}
                <ChevronRight className="w-4 h-4 text-black" />
              </button>

              <div className="block text-center text-[10px] text-neutral-600 mt-2">
                By tapping continue, you agree to our terms of training.
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div className="flex justify-between items-end border-b border-neutral-800/50 pb-3">
                <span className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  Create Profile
                </span>
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); resetMessages(); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  Already have an account?
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 font-medium">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Athlete" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 font-medium">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@gmail.com" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-medium">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars" 
                      className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-medium">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password" 
                      className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 mt-4 transition"
              >
                {loading ? 'Creating Athlete Profile...' : 'Begin Onboarding Flow'}
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-5 text-left">
              <div className="flex justify-between items-end border-b border-neutral-800/50 pb-3">
                <span className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  Forgot Password
                </span>
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); resetMessages(); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  Back to sign in
                </button>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Provide your email address and we will forward a secured verification code to change your login credentials.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Registered Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@domain.com" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-100 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full h-11 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-semibold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 transition"
              >
                Send Assistance Link
              </button>
            </form>
          )}

          {/* MODE: ONBOARDING */}
          {mode === 'onboarding' && (
            <form onSubmit={handleOnboardingSubmit} className="space-y-5 text-left">
              <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                    Onboarding Profile
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Let\'s curate metrics perfectly tailored to your targets</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-1 rounded border border-emerald-500/20">Configuring</span>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Age (years)</label>
                  <input 
                    type="number" 
                    min={10} 
                    max={100}
                    placeholder="e.g. 25"
                    value={age}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAge(val === '' ? '' : parseInt(val));
                    }}
                    className={`w-full bg-[#0D0D0D] border ${
                      isAgeWarn ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-neutral-800 focus:border-emerald-500 text-neutral-100'
                    } rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors`}
                    required
                  />
                  {isAgeWarn && (
                    <p className="text-[10px] text-red-400 font-medium animate-pulse mt-1">❌ Invalid: Must be 10 to 100</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer Not Say">Prefer Not Say</option>
                  </select>
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Height (cm)</label>
                  <input 
                    type="number" 
                    min={120} 
                    max={220}
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHeight(val === '' ? '' : parseInt(val));
                    }}
                    className={`w-full bg-[#0D0D0D] border ${
                      isHeightWarn ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-neutral-800 focus:border-emerald-500 text-neutral-100'
                    } rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors`}
                    required
                  />
                  {isHeightWarn && (
                    <p className="text-[10px] text-red-400 font-medium animate-pulse mt-1">❌ Invalid: Must be 120 - 220 cm</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min={30} 
                    max={250}
                    placeholder="e.g. 72.5"
                    value={weight}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWeight(val === '' ? '' : parseFloat(val));
                    }}
                    className={`w-full bg-[#0D0D0D] border ${
                      isWeightWarn ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-neutral-800 focus:border-emerald-500 text-neutral-100'
                    } rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors`}
                    required
                  />
                  {isWeightWarn && (
                    <p className="text-[10px] text-red-400 font-medium animate-pulse mt-1">❌ Invalid: Must be 30 - 250 kg</p>
                  )}
                </div>
              </div>

              {/* Fitness Level */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Your Current Fitness Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFitnessLevel(lvl)}
                      className={`py-2 px-1 text-center text-xs rounded-xl border transition cursor-pointer ${
                        fitnessLevel === lvl 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold' 
                          : 'bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Goal */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">What is your principal Fitness Goal?</label>
                <select 
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                >
                  <option value="Weight Loss">Weight Loss (Burn fat & slim down)</option>
                  <option value="Muscle Gain">Muscle Gain (Hypertrophy & definition)</option>
                  <option value="Fat Loss">Fat Loss (Increase metabolism)</option>
                  <option value="Strength Building">Strength Building (Heavy lifts progress)</option>
                  <option value="General Fitness">General Fitness (Conditioning & health)</option>
                  <option value="Athletic Performance">Athletic Performance (Sprints & speed)</option>
                </select>
              </div>

              {/* Workout Frequency */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">How often do you plan to train?</label>
                <select 
                  value={workoutFrequency}
                  onChange={(e) => setWorkoutFrequency(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                >
                  <option value="1–2 days/week">1–2 days/week (Light Maintenance)</option>
                  <option value="3–4 days/week">3–4 days/week (Standard Split)</option>
                  <option value="5–6 days/week">5–6 days/week (Intense Hypertrophy)</option>
                  <option value="Daily">Daily (Hardcore Conditioning)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 mt-4 transition"
              >
                {loading ? 'Assembling Training Plans...' : 'Power On Dashboard'}
                <Gauge className="w-4 h-4 text-black" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
