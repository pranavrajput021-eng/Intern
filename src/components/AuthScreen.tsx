/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabaseService, isUsingCustomKeys } from '../supabaseService';
import { UserProfile } from '../types';
import { 
  KeyRound, Mail, User, ShieldCheck, Dumbbell, 
  Sparkles, CheckCircle2, ChevronRight, Gauge, 
  HelpCircle, LogIn, UserPlus, Info, Sun, Moon,
  Brain, Apple, TrendingUp, Target, Shield, Check, AlertCircle, ChevronDown,
  Leaf
} from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
}

type AuthMode = 'login' | 'register' | 'onboarding' | 'forgot_password';

export default function AuthScreen({ onAuthSuccess, theme, setTheme }: AuthScreenProps) {
  const isLight = theme === 'light';
  const isDev = typeof window !== 'undefined' && (
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1') || 
    window.location.hostname.includes('-dev-')
  );

  const sanitizeErrorMessage = (message: string): string => {
    if (!message) return 'An unexpected system error occurred. Please try again.';
    const msgLower = message.toLowerCase();

    if (!isDev) {
      if (
        msgLower.includes('users_email_key') || 
        msgLower.includes('unique constraint') || 
        msgLower.includes('already registered') ||
        msgLower.includes('email already exists') ||
        msgLower.includes('already exists')
      ) {
        return 'An account with this email address already exists. Please sign in instead.';
      }
      if (
        msgLower.includes('invalid login credentials') || 
        msgLower.includes('invalid_credentials') ||
        msgLower.includes('incorrect') ||
        msgLower.includes('invalid credential')
      ) {
        return 'Incorrect email or password.';
      }
      if (
        msgLower.includes('supabase') ||
        msgLower.includes('connection') ||
        msgLower.includes('not configured') ||
        msgLower.includes('rls') ||
        msgLower.includes('policy') ||
        msgLower.includes('violat') ||
        msgLower.includes('security') ||
        msgLower.includes('database') ||
        msgLower.includes('failed to fetch') ||
        msgLower.includes('network')
      ) {
        return 'An unexpected system error occurred. Please try again later.';
      }
      if (msgLower.includes('password') && msgLower.includes('6 characters')) {
        return 'Password must be at least 6 characters.';
      }
      return 'An unexpected system error occurred. Please try again.';
    }

    if (
      msgLower.includes('users_email_key') || 
      msgLower.includes('unique constraint') || 
      msgLower.includes('email already exists') ||
      msgLower.includes('already exists')
    ) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (msgLower.includes('invalid login credentials') || msgLower.includes('incorrect')) {
      return 'Incorrect email or password.';
    }
    return message;
  };

  // Mode selection
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Focus states to dynamically style input decoration
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Onboarding parameters
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [primaryGoal, setPrimaryGoal] = useState('Muscle Gain');
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

  // Live Biometric Tickers for Stunning UI Experience
  const [liveBpm, setLiveBpm] = useState(62);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  const quotes = [
    "No citizen has a right to be an amateur in the matter of physical training.",
    "The body achieves what the mind believes.",
    "Aesthetic performance is the synthesis of precision and willpower.",
    "Force resides within the design of disciplined muscle fibers.",
    "Elevate your capacity. Redefine your biometric ceiling."
  ];

  React.useEffect(() => {
    // 1. Simulated heart-rate stream
    const bpmInterval = setInterval(() => {
      setLiveBpm(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return next < 55 ? 55 : next > 75 ? 75 : next;
      });
    }, 2000);

    // 2. Rotating Motivational quotes
    const quoteInterval = setInterval(() => {
      setActiveQuoteIdx(prev => (prev + 1) % quotes.length);
    }, 8000);

    return () => {
      clearInterval(bpmInterval);
      clearInterval(quoteInterval);
    };
  }, []);

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
      localStorage.setItem('athlete_current_passcode', password);
      if (!loggedUser.fitness_goal) {
        setTempUser(loggedUser);
        setMode('onboarding');
      } else {
        onAuthSuccess(loggedUser);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Login failed. Please double check your credentials.';
      setError(sanitizeErrorMessage(errMsg));
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
    if (!agreeTerms) {
      setError('You must agree to the terms of training to continue.');
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      const newUser = await supabaseService.register(name, email, password);
      localStorage.setItem('athlete_current_passcode', password);
      setTempUser(newUser);
      setSuccessMsg('Athlete profile registered! Preparing metrics onboarding...');
      setTimeout(() => {
        setMode('onboarding');
        resetMessages();
      }, 1200);
    } catch (err: any) {
      const errMsg = err?.message || 'Registration failed. Email might already exist.';
      setError(sanitizeErrorMessage(errMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;

    if (age === '') {
      setError('Please input your age.');
      return;
    }
    if (age < 10 || age > 100) {
      setError('Age must be between 10 and 100 years.');
      return;
    }
    if (weight === '') {
      setError('Please input your weight.');
      return;
    }
    if (weight < 30 || weight > 250) {
      setError('Weight must be between 30kg and 250kg.');
      return;
    }
    if (height === '') {
      setError('Please input your height.');
      return;
    }
    if (height < 120 || height > 220) {
      setError('Height must be between 120cm and 220cm.');
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

      await supabaseService.logWeight(Number(weight));
      
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

      setSuccessMsg('Athlete Profile Complete. Powering on training modules...');
      setTimeout(() => {
        onAuthSuccess(onboardedProfile);
      }, 1200);
    } catch (err: any) {
      const errMsg = err?.message || 'Failed saving onboarding telemetry.';
      setError(sanitizeErrorMessage(errMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    resetMessages();
    setSuccessMsg('If account is found, recovery passcode links will be forwarded to your inbox.');
  };

  return (
    <div id="auth-screen-layout" className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#050505] text-white'} flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden select-none font-sans`}>
      
      {/* Dynamic Theme Toggle */}
      {setTheme && theme && (
        <div 
          id="auth-theme-switcher-pill"
          className={`absolute top-6 right-6 z-50 p-1 ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#0A0A0A]/80 border-white/5'} rounded-full flex items-center gap-1 cursor-pointer shadow-xl backdrop-blur-md h-9 w-[70px]`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div 
            className="absolute top-1 bottom-1 bg-[#00E38C]/10 border border-[#00E38C]/20 rounded-full transition-transform duration-300 ease-out"
            style={{
              transform: theme === 'dark' ? 'translateX(0px)' : 'translateX(32px)',
              width: '28px'
            }}
          />
          <div className="w-7 h-7 flex items-center justify-center z-10 transition">
            <Sun className={`w-4 h-4 transition duration-200 ${theme === 'dark' ? 'text-[#00E38C] font-bold scale-110 drop-shadow-[0_0_8px_rgba(0,227,140,0.4)]' : 'text-neutral-500 scale-90'}`} />
          </div>
          <div className="w-7 h-7 flex items-center justify-center z-10 transition">
            <Moon className={`w-4 h-4 transition duration-200 ${theme === 'light' ? 'text-[#18D8FF] font-bold scale-110 drop-shadow-[0_0_8px_rgba(24,216,255,0.4)]' : 'text-neutral-500 scale-90'}`} />
          </div>
        </div>
      )}

      {/* Luxury Cyber Fitness Backdrop */}
      <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#050505]'} select-none`}>
        {/* Soft, professional, slow floating radiant neon glows */}
        <motion.div 
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full ${isLight ? 'bg-[#00E38C]/[0.08]' : 'bg-[#00E38C]/[0.02]'} blur-[140px]`} 
        />
        <motion.div 
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 80, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-[10%] right-[15%] w-[600px] h-[600px] rounded-full ${isLight ? 'bg-[#18D8FF]/[0.08]' : 'bg-[#18D8FF]/[0.025]'} blur-[150px]`} 
        />
        
        {/* Animated Cyber Grid Overlay */}
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)]'} bg-[size:40px_40px]`} />
        
        {/* Scanning Laser Line */}
        <motion.div 
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E38C]/${isLight ? '35' : '15'} to-transparent blur-[1px]`}
        />

        {/* Delicate tech-circuit circular aesthetics */}
        <div className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border ${isLight ? 'border-slate-300' : 'border-white/[0.015]'} flex items-center justify-center`}>
          <div className={`w-[450px] h-[440px] rounded-full border ${isLight ? 'border-emerald-500/[0.08]' : 'border-[#00E38C]/[0.01]'} flex items-center justify-center`} />
        </div>
        
        {/* Large transparent display watermark */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none ${isLight ? 'opacity-[0.05]' : 'opacity-[0.015]'} select-none z-0`}>
          <span className={`text-[12rem] md:text-[18rem] font-black tracking-[0.25em] font-display ${isLight ? 'text-slate-900' : 'text-white'} select-none`}>ATHLETE</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl z-10 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E38C] to-[#18D8FF] p-[1.5px] shadow-[0_0_25px_rgba(0,227,140,0.15)] hover:shadow-[0_0_35px_rgba(24,216,255,0.25)] transition-all duration-500 mb-4 flex items-center justify-center relative group"
          >
            {/* Pulsing balance back-light around the logo */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00E38C]/20 to-[#18D8FF]/20 blur-lg pointer-events-none group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            <div className={`w-full h-full ${isLight ? 'bg-white' : 'bg-[#050505]'} rounded-2xl flex items-center justify-center relative z-10`}>
              <Dumbbell className={`w-8 h-8 ${isLight ? 'text-slate-950' : 'text-white'} group-hover:text-[#00E38C] transition-colors duration-500`} />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className={`text-3xl font-bold tracking-widest font-display ${isLight ? 'text-slate-900' : 'text-white'}`}
          >
            AESTHETIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E38C] to-[#18D8FF]">ATHLETE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-xs tracking-wider ${isLight ? 'text-slate-700 font-semibold' : 'text-neutral-400'} max-w-sm mt-2 font-mono uppercase`}
          >
            Luxury Cyber SaaS Training & Predictive Analytics
          </motion.p>
        </div>

        {/* Outer Split Layout Card */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-stretch justify-center">
            
            {/* Left Card: Form Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`w-full ${mode === 'register' ? 'max-w-xl' : 'max-w-md'} ${isLight ? 'bg-white/95 border-slate-200 shadow-[0_15px_40px_rgba(15,23,42,0.06)]' : 'bg-[#0A0A0A]/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]'} rounded-[24px] p-6 sm:p-8 relative overflow-hidden backdrop-blur-2xl flex flex-col justify-between`}
            >
              {/* Card top edge accent line */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E38C]/30 to-transparent pointer-events-none" />

              <div>
                {/* Alert Banners */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mb-6 p-4 rounded-xl ${isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-950/20 border border-red-500/20 text-red-400'} text-xs text-left flex items-start gap-2.5 shadow-lg`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-mono">{error}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mb-6 p-4 rounded-xl ${isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-[#00E38C]/10 border border-[#00E38C]/20 text-[#00E38C]'} text-xs text-left flex items-start gap-2.5 shadow-lg`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-mono">{successMsg}</span>
                  </motion.div>
                )}

                {/* Form Modes Switch rendering */}
                <AnimatePresence mode="wait">
                  
                  {/* MODE: LOGIN */}
                  {mode === 'login' && (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className={`text-left space-y-1 border-b ${isLight ? 'border-slate-200' : 'border-white/5'} pb-4`}>
                        <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>Welcome Back, Athlete</h2>
                        <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'}`}>Continue your training journey.</p>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Email Address</label>
                          <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'email' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                              <Mail className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                            </span>
                            <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="athlete@luxury.com" 
                              className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Password</label>
                            <button 
                              type="button" 
                              onClick={() => { setMode('forgot_password'); resetMessages(); }}
                              className={`text-[10px] ${isLight ? 'text-slate-700 hover:text-[#00E38C] font-semibold' : 'text-neutral-500 hover:text-[#00E38C]'} font-mono transition`}
                            >
                              FORGOT PASSWORD?
                            </button>
                          </div>
                          <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'password' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                              <KeyRound className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                            </span>
                            <input 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onFocus={() => setFocusedField('password')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="••••••••" 
                              className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center pt-2">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className={`rounded ${isLight ? 'border-slate-400 bg-slate-100' : 'border-white/10 bg-black'} text-[#00E38C] focus:ring-0 w-4 h-4`}
                            />
                            <span className={`text-xs ${isLight ? 'text-slate-800 font-medium' : 'text-neutral-400'} font-mono tracking-wide`}>Remember my training session</span>
                          </label>
                        </div>

                        <motion.button 
                          type="submit" 
                          disabled={loading}
                          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 227, 140, 0.2)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-12 mt-4 bg-gradient-to-r from-[#00E38C] to-[#18D8FF] text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                        >
                          {loading ? 'SECURING BIO-LINK...' : 'ACCESS WORKOUT HUB'}
                          <ChevronRight className="w-4 h-4 text-neutral-950" />
                        </motion.button>
                      </form>

                      <div className={`text-center pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                        <span className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-500'}`}>Don't have an athlete account? </span>
                        <button 
                          type="button" 
                          onClick={() => { setMode('register'); resetMessages(); }}
                          className="text-xs text-[#00E38C] hover:underline font-bold transition inline-flex items-center gap-1"
                        >
                          Create Account →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* MODE: REGISTER */}
                  {mode === 'register' && (
                    <motion.div
                      key="register-form"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className={`text-left space-y-1 border-b ${isLight ? 'border-slate-200' : 'border-white/5'} pb-4`}>
                        <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>Create Your Athlete Account</h2>
                        <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'}`}>Build your personalized training platform.</p>
                      </div>

                      <form onSubmit={handleRegister} className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Full Name</label>
                          <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'regName' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                              <User className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'regName' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                            </span>
                            <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedField('regName')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Rex Athlete" 
                              className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Email Address</label>
                          <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'regEmail' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                              <Mail className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'regEmail' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                            </span>
                            <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onFocus={() => setFocusedField('regEmail')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="athlete@luxury.com" 
                              className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Password</label>
                            <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'regPass' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                                <KeyRound className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'regPass' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                              </span>
                              <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('regPass')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Min 6 chars" 
                                className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Confirm Password</label>
                            <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'regConf' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                                <ShieldCheck className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'regConf' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                              </span>
                              <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setFocusedField('regConf')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Repeat pass" 
                                className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Interactive dropdown panels for Fitness Goal and Experience level requested in spec */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Fitness Goal</label>
                            <div className={`relative rounded-xl border ${isLight ? 'border-slate-200 bg-slate-50 hover:border-slate-300' : 'border-white/5 bg-black/60 hover:border-white/10'} transition`}>
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                                <Dumbbell className="w-4 h-4 text-neutral-500" />
                              </span>
                              <select 
                                value={primaryGoal}
                                onChange={(e) => setPrimaryGoal(e.target.value)}
                                className={`w-full bg-transparent py-3 pl-10 pr-10 text-xs ${isLight ? 'text-slate-900' : 'text-white'} focus:outline-none appearance-none cursor-pointer`}
                              >
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Strength Building">Strength</option>
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Muscle Gain">Muscle Gain</option>
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Fat Loss">Fat Loss</option>
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Athletic Performance">Athletic Perf</option>
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="General Fitness">General Fitness</option>
                              </select>
                              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Experience Level</label>
                            <div className={`relative rounded-xl border ${isLight ? 'border-slate-200 bg-slate-50 hover:border-slate-300' : 'border-white/5 bg-black/60 hover:border-white/10'} transition`}>
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                                <Gauge className="w-4 h-4 text-neutral-500" />
                              </span>
                              <select 
                                value={fitnessLevel}
                                onChange={(e) => setFitnessLevel(e.target.value)}
                                className={`w-full bg-transparent py-3 pl-10 pr-10 text-xs ${isLight ? 'text-slate-900' : 'text-white'} focus:outline-none appearance-none cursor-pointer`}
                              >
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Beginner">Beginner</option>
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Intermediate">Intermediate</option>
                                <option className={isLight ? "bg-white text-slate-900" : "bg-[#0e0e0e] text-white"} value="Advanced">Advanced</option>
                              </select>
                              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start pt-2">
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                              className={`rounded ${isLight ? 'border-slate-300 bg-slate-100' : 'border-white/10 bg-black'} text-[#00E38C] focus:ring-0 w-4 h-4 mt-0.5`}
                            />
                            <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'} leading-normal font-mono text-left`}>
                              I agree to the <span className="text-[#00E38C] underline">Terms of Training</span> and <span className="text-[#00E38C] underline">Biome Privacy Protocol</span>.
                            </span>
                          </label>
                        </div>

                        <motion.button 
                          type="submit" 
                          disabled={loading}
                          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 227, 140, 0.2)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-12 mt-4 bg-gradient-to-r from-[#00E38C] to-[#18D8FF] text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                        >
                          {loading ? 'INITIALIZING PROTOCOLS...' : 'CREATE ATHLETE ACCOUNT'}
                          <ChevronRight className="w-4 h-4 text-neutral-950" />
                        </motion.button>
                      </form>

                      <div className={`text-center pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                        <span className="text-xs text-neutral-500">Already have an account? </span>
                        <button 
                          type="button" 
                          onClick={() => { setMode('login'); resetMessages(); }}
                          className="text-xs text-[#00E38C] hover:underline font-bold transition inline-flex items-center gap-1"
                        >
                          Sign In →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* MODE: FORGOT PASSWORD */}
                  {mode === 'forgot_password' && (
                    <motion.div
                      key="forgot-form"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className={`text-left space-y-1 border-b ${isLight ? 'border-slate-200' : 'border-white/5'} pb-4`}>
                        <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>Recover Credentials</h2>
                        <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'}`}>Restore secure interface access.</p>
                      </div>

                      <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Registered Email Address</label>
                          <div className={`relative rounded-xl border transition-all duration-300 ${isLight ? 'bg-slate-50' : 'bg-black/60'} ${focusedField === 'forgotEmail' ? 'border-[#00E38C] shadow-[0_0_12px_rgba(0,227,140,0.15)]' : isLight ? 'border-slate-300' : 'border-white/5'}`}>
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center">
                              <Mail className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'forgotEmail' ? 'text-[#00E38C]' : 'text-slate-500'}`} />
                            </span>
                            <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onFocus={() => setFocusedField('forgotEmail')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="athlete@luxury.com" 
                              className={`w-full bg-transparent py-3 pl-10 pr-4 text-xs ${isLight ? 'text-slate-950 placeholder-slate-500 font-medium' : 'text-white placeholder-neutral-600'} focus:outline-none`}
                              required
                            />
                          </div>
                        </div>

                        <motion.button 
                          type="submit" 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full h-12 mt-4 ${isLight ? 'bg-slate-900 hover:bg-slate-800' : 'bg-neutral-900'} border ${isLight ? 'border-slate-300 text-white' : 'border-white/10 text-white hover:text-[#00E38C]'} font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300`}
                        >
                          DISPATCH RESTORE LINK
                        </motion.button>
                      </form>

                      <div className={`text-center pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                        <button 
                          type="button" 
                          onClick={() => { setMode('login'); resetMessages(); }}
                          className="text-xs text-[#00E38C] hover:underline font-bold transition inline-flex items-center gap-1"
                        >
                          ← Back to Sign In
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* MODE: ONBOARDING */}
                  {mode === 'onboarding' && (
                    <motion.div
                      key="onboarding-form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className={`text-left space-y-1 border-b ${isLight ? 'border-slate-200' : 'border-white/5'} pb-4 flex justify-between items-center`}>
                        <div>
                          <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-display flex items-center gap-2`}>
                            <Sparkles className="w-5 h-5 text-[#00E38C] animate-pulse" />
                            Athlete Onboarding
                          </h2>
                          <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'}`}>Curate metrics perfectly tailored to your targets</p>
                        </div>
                        <span className="text-[10px] font-mono border border-[#00E38C]/20 bg-[#00E38C]/10 text-[#00E38C] px-2 py-0.5 rounded uppercase tracking-wider">CONFIG_STAGE_01</span>
                      </div>

                      <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-left">
                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Age (years)</label>
                            <input 
                              type="number" 
                              min={10} 
                              max={100}
                              placeholder="e.g. 24"
                              value={age}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  setAge(val === '' ? '' : parseInt(val));
                              }}
                              className={`w-full ${isLight ? 'bg-slate-50 text-slate-950 placeholder-slate-500 font-medium' : 'bg-black/60 text-white'} border rounded-xl py-2.5 px-3 text-xs focus:outline-none transition-all ${
                                isAgeWarn ? 'border-red-500 focus:border-red-500 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : isLight ? 'border-slate-300 focus:border-[#00E38C]' : 'border-white/5 focus:border-[#00E38C] focus:shadow-[0_0_12px_rgba(0,227,140,0.15)]'
                              }`}
                              required
                            />
                            {isAgeWarn && (
                              <p className="text-[9px] text-red-400 font-mono mt-1">❌ Invalid age range (10 - 100)</p>
                            )}
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Gender Identity</label>
                            <div className={`relative rounded-xl border ${isLight ? 'border-slate-300 bg-slate-50 hover:border-slate-400' : 'border-white/5 bg-black/60 hover:border-white/10'} transition`}>
                              <select 
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className={`w-full bg-transparent py-2.5 pl-3 pr-10 text-xs ${isLight ? 'text-slate-950 font-medium' : 'text-white'} focus:outline-none appearance-none cursor-pointer`}
                              >
                                <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="Male">Male</option>
                                <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="Female">Female</option>
                                <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="Non-Binary">Non-Binary</option>
                                <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="Prefer Not Say">Prefer Not Say</option>
                              </select>
                              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`} />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Height & Weight */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Height (cm)</label>
                            <input 
                              type="number" 
                              min={120} 
                              max={220}
                              placeholder="e.g. 182"
                              value={height}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHeight(val === '' ? '' : parseInt(val));
                              }}
                              className={`w-full ${isLight ? 'bg-slate-50 text-slate-950 placeholder-slate-500 font-medium' : 'bg-black/60 text-white'} border rounded-xl py-2.5 px-3 text-xs focus:outline-none transition-all ${
                                isHeightWarn ? 'border-red-500 focus:border-red-500 text-red-200' : isLight ? 'border-slate-300 focus:border-[#00E38C]' : 'border-white/5 focus:border-[#00E38C] focus:shadow-[0_0_12px_rgba(0,227,140,0.15)]'
                              }`}
                              required
                            />
                            {isHeightWarn && (
                              <p className="text-[9px] text-red-400 font-mono mt-1">❌ Invalid height range (120 - 220)</p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Weight (kg)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              min={30} 
                              max={250}
                              placeholder="e.g. 78.5"
                              value={weight}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWeight(val === '' ? '' : parseFloat(val));
                              }}
                              className={`w-full ${isLight ? 'bg-slate-50 text-slate-950 placeholder-slate-500 font-medium' : 'bg-black/60 text-white'} border rounded-xl py-2.5 px-3 text-xs focus:outline-none transition-all ${
                                isWeightWarn ? 'border-red-500 focus:border-red-500 text-red-200' : isLight ? 'border-slate-300 focus:border-[#00E38C]' : 'border-white/5 focus:border-[#00E38C] focus:shadow-[0_0_12px_rgba(0,227,140,0.15)]'
                              }`}
                              required
                            />
                            {isWeightWarn && (
                              <p className="text-[9px] text-red-400 font-mono mt-1">❌ Invalid weight range (30 - 250)</p>
                            )}
                          </div>
                        </div>

                        {/* Workout Frequency */}
                        <div className="space-y-1.5">
                          <label className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} font-mono tracking-widest uppercase`}>Target Training Frequency</label>
                          <div className={`relative rounded-xl border ${isLight ? 'border-slate-300 bg-slate-50 hover:border-slate-400' : 'border-white/5 bg-black/60 hover:border-white/10'} transition`}>
                            <select 
                              value={workoutFrequency}
                              onChange={(e) => setWorkoutFrequency(e.target.value)}
                              className={`w-full bg-transparent py-2.5 pl-3 pr-10 text-xs ${isLight ? 'text-slate-950 font-medium' : 'text-white'} focus:outline-none appearance-none cursor-pointer`}
                            >
                              <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="1–2 days/week">1–2 days/week (Light Maintenance)</option>
                              <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="3–4 days/week">3–4 days/week (Standard Split)</option>
                              <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="5–6 days/week">5–6 days/week (Intense Hypertrophy)</option>
                              <option className={isLight ? "bg-white text-slate-950" : "bg-[#0e0e0e] text-white"} value="Daily">Daily (Hardcore Conditioning)</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ChevronDown className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`} />
                            </span>
                          </div>
                        </div>

                        <motion.button 
                          type="submit" 
                          disabled={loading}
                          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 227, 140, 0.2)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-12 mt-4 bg-gradient-to-r from-[#00E38C] to-[#18D8FF] text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                        >
                          {loading ? 'CALCULATING ANABOLIC PARAMETERS...' : 'INITIALIZE PERFORMANCE INDEX'}
                          <Gauge className="w-4 h-4 text-neutral-950" />
                        </motion.button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Minimal aesthetic footer */}
              <div className={`mt-8 pt-4 border-t ${isLight ? 'border-slate-200 text-slate-600 font-semibold' : 'border-white/5 text-neutral-600'} text-[9px] font-mono flex justify-between items-center uppercase tracking-widest`}>
                <span>SYSTEM VERSION: C_0.4.9</span>
                <span>DATA SECURE UNDER AES-256</span>
              </div>

            </motion.div>

            {/* Right Card: Dynamic Tech Showcase or Real-time Biometrics Dashboard */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`hidden lg:flex w-full max-w-[440px] flex-col justify-between ${isLight ? 'bg-white/95 border-slate-200 shadow-[0_15px_40px_rgba(15,23,42,0.06)] text-slate-900' : 'bg-black/40 border border-white/5 shadow-2xl text-white'} rounded-[24px] p-8 relative overflow-hidden backdrop-blur-md`}
            >
              {/* Tech scan dots in background */}
              <div className="absolute inset-0 bg-radial from-[#18D8FF]/5 to-transparent pointer-events-none opacity-40" />
              
              {mode === 'register' ? (
                // Register details
                <div className="space-y-6">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-mono text-[#18D8FF] uppercase tracking-widest font-semibold">Aesthetic Platform Capabilities</span>
                    <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>THE CYBERMETRIC ADVANTAGE</h3>
                    <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'}`}>Unlock luxury metrics, intelligent coaches, and hyper-personalized telemetry grids.</p>
                  </div>

                  {/* Features List with glass hover lifts & animated icons */}
                  <div className="space-y-3.5 text-left">
                    {[
                      { icon: <Brain className="w-4 h-4 text-[#00E38C]" />, title: "AI Fitness Coach", desc: "Biometric adjustments & custom daily dynamic split generators." },
                      { icon: <Dumbbell className="w-4 h-4 text-[#18D8FF]" />, title: "Workout Tracker", desc: "Interactive telemetry logs for exercises, weights, sets, and rest tracking." },
                      { icon: <Apple className="w-4 h-4 text-[#00E38C]" />, title: "Nutrition Hub", desc: "Dynamic hydration targets, custom macros split, and volume monitoring." },
                      { icon: <TrendingUp className="w-4 h-4 text-[#18D8FF]" />, title: "Progress Analytics", desc: "Interactive volume metrics charts, personal record counters, and logs." },
                      { icon: <Target className="w-4 h-4 text-[#00E38C]" />, title: "Smart Goal Tracking", desc: "Predictive completion estimators for weight milestones and strength goals." }
                    ].map((feat, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ x: 6, backgroundColor: isLight ? "rgba(15,23,42,0.02)" : "rgba(255,255,255,0.02)", borderColor: "rgba(0,227,140,0.12)" }}
                        className={`p-3 border rounded-2xl flex items-start gap-3.5 transition-all duration-300 ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-black/50 border-white/[0.03]'}`}
                      >
                        <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                          {feat.icon}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{feat.title}</h4>
                          <p className={`text-[10px] ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'} leading-normal`}>{feat.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                // Login, forgot_password, or onboarding details: Live Biometric HUD
                <div className="space-y-6">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-mono text-[#00E38C] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E38C] animate-ping" />
                      Live Biometric Stream
                    </span>
                    <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>ATHLETE PROTOCOL HUD</h3>
                    <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-neutral-400'}`}>Monitoring real-time cybernetic feedback, active load indexes, and synchronization pools.</p>
                  </div>

                  {/* Stunning real-time heartbeat monitor */}
                  <div className={`border rounded-2xl p-4 space-y-4 relative overflow-hidden ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/60 border-white/5'}`}>
                    <div className={`absolute top-2 right-3 flex items-center gap-1.5 text-[9px] font-mono ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SECURE SYNC
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 text-left">
                        <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-400'} uppercase tracking-wider`}>Simulated Heart Rate</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-black font-mono text-emerald-500 tabular-nums animate-pulse">{liveBpm}</span>
                          <span className={`text-[10px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'} font-mono`}>BPM</span>
                        </div>
                      </div>
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <Brain className="w-5 h-5 text-emerald-500 animate-bounce" />
                      </div>
                    </div>

                    {/* Futuristic ECG moving Waveform SVG */}
                    <div className={`w-full h-12 rounded-xl border relative overflow-hidden flex items-center ${isLight ? 'bg-white border-slate-200' : 'bg-neutral-950/80 border-white/5'}`}>
                      <svg className="w-full h-full text-emerald-500 opacity-80" viewBox="0 0 300 40" fill="none">
                        <path 
                          d="M0 20 L40 20 L45 20 L50 5 L55 35 L60 20 L65 20 L110 20 L115 10 L120 30 L125 20 L130 20 L170 20 L175 20 L180 0 L185 40 L190 20 L195 20 L240 20 L245 12 L250 28 L255 20 L300 20" 
                          stroke="currentColor" 
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-pulse-wave"
                        />
                      </svg>
                      {/* Grid background on SVG */}
                      <div className={`absolute inset-0 bg-[size:10px_10px] ${isLight ? 'bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)]'}`} />
                    </div>
                  </div>

                  {/* Dynamic HUD Animations */}
                  <div className="grid grid-cols-2 gap-3.5 text-left">
                    {/* Widget 1: Aesthetic Biometric Core */}
                    <div className={`p-4 ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-black/30 border border-white/[0.03]'} rounded-2xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden h-40`}>
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#00E38C_1px,transparent_1px)] [background-size:12px_12px]" />
                      
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        {/* Outer Rotating Ring - clockwise */}
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className={`absolute inset-0 rounded-full border border-dashed ${isLight ? 'border-emerald-500/40' : 'border-[#00E38C]/30'}`}
                        />
                        {/* Inner Rotating Ring - counter-clockwise */}
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          className={`absolute w-12 h-12 rounded-full border border-dotted ${isLight ? 'border-[#18D8FF]/50' : 'border-[#18D8FF]/30'}`}
                        />
                        {/* Concentric Breathing Pulse Core */}
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00E38C] to-[#18D8FF] shadow-[0_0_15px_rgba(0,227,140,0.5)] flex items-center justify-center"
                        >
                          <div className={`w-2 h-2 rounded-full ${isLight ? 'bg-white' : 'bg-[#050505]'}`} />
                        </motion.div>
                      </div>
                      
                      <div className="text-center space-y-0.5 z-10">
                        <span className={`text-[8px] font-mono ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'} uppercase tracking-widest block`}>BIOMETRIC CORE</span>
                        <span className={`text-[9.5px] font-bold ${isLight ? 'text-emerald-700' : 'text-[#00E38C]'} font-mono uppercase tracking-tight flex items-center justify-center gap-1`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          SYS_ACTIVE
                        </span>
                      </div>
                    </div>

                    {/* Widget 2: Kinetic Load Telemetry Spectrum */}
                    <div className={`p-4 ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-black/30 border border-white/[0.03]'} rounded-2xl flex flex-col justify-between relative overflow-hidden h-40`}>
                      <div className="flex items-center justify-between z-10">
                        <div className="text-left space-y-0.5">
                          <span className={`text-[8px] font-mono ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'} uppercase tracking-widest block`}>KINETIC SPECTRUM</span>
                          <span className={`text-[10px] font-bold ${isLight ? 'text-slate-900' : 'text-white'} font-mono uppercase tracking-wider`}>LOAD MATRIX</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#18D8FF] font-mono tracking-tighter bg-[#18D8FF]/10 px-1.5 py-0.5 rounded border border-[#18D8FF]/20 animate-pulse">
                          84.7%
                        </span>
                      </div>

                      {/* Frequency Spectrum Columns */}
                      <div className="flex items-end justify-between gap-1 h-14 px-0.5 z-10">
                        {[0.6, 0.4, 0.85, 0.5, 0.9, 0.35, 0.7, 0.55].map((initialVal, idx) => (
                          <motion.div 
                            key={idx}
                            animate={{ 
                              height: ["15%", "95%", "35%", "85%", "20%", "75%", "15%"] 
                            }}
                            transition={{ 
                              duration: 1.8 + idx * 0.25, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: idx * 0.12
                            }}
                            style={{ height: `${initialVal * 100}%` }}
                            className="flex-1 rounded-sm bg-gradient-to-t from-[#00E38C] to-[#18D8FF]"
                          />
                        ))}
                      </div>

                      <div className="text-left z-10">
                        <span className={`text-[8.5px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'} font-mono uppercase tracking-wider block`}>
                          PROCESSING STREAMS...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rotating Motivational Quotes Card */}
                  <div className={`p-5 rounded-2xl relative overflow-hidden text-left border transition-all duration-500 ${isLight ? 'bg-gradient-to-br from-emerald-50/40 to-cyan-50/40 border-slate-200 shadow-inner' : 'bg-gradient-to-br from-[#0c1a16]/40 to-[#0a151b]/40 border-emerald-500/10'}`}>
                    {/* Glowing organic background blob */}
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 0.95, 1.15, 1],
                        x: [0, 10, -15, 5, 0],
                        y: [0, -12, 10, -8, 0],
                        rotate: [0, 120, 240, 360],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#00E38C]/10 rounded-full blur-2xl pointer-events-none"
                    />

                    {/* Glowing second organic background blob */}
                    <motion.div
                      animate={{
                        scale: [1.1, 0.9, 1.2, 1, 1.1],
                        x: [0, -10, 12, -5, 0],
                        y: [0, 8, -12, 6, 0],
                      }}
                      transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -left-8 -top-8 w-24 h-24 bg-[#18D8FF]/10 rounded-full blur-2xl pointer-events-none"
                    />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-[#00E38C] animate-pulse" />
                        <span className={`text-[8.5px] font-mono ${isLight ? 'text-emerald-700/80' : 'text-emerald-400/80'} uppercase tracking-widest font-semibold`}>
                          BIOPHILIC INSPIRATION
                        </span>
                      </div>
                      
                      {/* Active Wave pulse design indicator */}
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E38C] animate-ping" />
                        <span className={`text-[8px] font-mono ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'} uppercase tracking-widest`}>
                          LIVE ENERGY
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 pb-3 h-20 flex items-center relative z-10 pl-1">
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={activeQuoteIdx}
                          initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`text-xs italic leading-relaxed font-sans font-bold ${isLight ? 'text-slate-900' : 'text-neutral-300'}`}
                        >
                          "{quotes[activeQuoteIdx]}"
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Infinite looping quote timeline progress indicator */}
                    <div className={`w-full h-[3px] rounded-full overflow-hidden relative ${isLight ? 'bg-slate-200' : 'bg-white/5'}`}>
                      <motion.div 
                        key={activeQuoteIdx}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 8, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-[#00E38C] to-[#18D8FF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className={`text-left pt-4 border-t ${isLight ? 'border-slate-200 text-slate-700 font-bold' : 'border-white/5 text-neutral-500'} flex items-center justify-between text-[10px] font-mono uppercase tracking-widest`}>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#00E38C]" />
                  <span>BIO-PROTECTED</span>
                </div>
                <span>ATHLETE CO. © 2026</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Global Footer (Terms, Privacy, Support) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-12 text-[11px] ${isLight ? 'text-slate-700 font-bold' : 'text-neutral-500'} font-mono tracking-widest uppercase flex gap-6 z-10`}
        >
          <a href="#" className={`hover:text-emerald-500 transition font-bold ${isLight ? 'text-slate-800' : 'text-neutral-400'}`}>TERMS OF SERVICE</a>
          <span>•</span>
          <a href="#" className={`hover:text-emerald-500 transition font-bold ${isLight ? 'text-slate-800' : 'text-neutral-400'}`}>PRIVACY POLICY</a>
          <span>•</span>
          <a href="#" className={`hover:text-emerald-500 transition font-bold ${isLight ? 'text-slate-800' : 'text-neutral-400'}`}>SECURE SUPPORT</a>
        </motion.div>

      </div>
    </div>
  );
}
