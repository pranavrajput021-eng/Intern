/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabaseService, isLocalModeActive } from '../supabaseService';
import { UserProfile } from '../types';
import { 
  User, ShieldCheck, Bell, Sparkles, RefreshCw, 
  Settings2, Activity, Dumbbell, Mail, Info, LogOut,
  Eye, EyeOff, Lock, AlertTriangle, CheckCircle
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateSuccess: (updated: UserProfile) => void;
}

export default function ProfilePage({ user, onLogout, onUpdateSuccess }: ProfilePageProps) {
  // Input fields
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState<number | ''>(user.age || '');
  const [height, setHeight] = useState<number | ''>(user.height || '');
  const [weight, setWeight] = useState<number | ''>(user.weight || '');
  
  const [goal, setGoal] = useState(user.fitness_goal || 'General Fitness');
  const [level, setLevel] = useState(user.fitness_level || 'Intermediate');
  const [frequency, setFrequency] = useState(user.workout_frequency || '3–4 days/week');

  // Preferences toggles
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status handlers
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation warnings derived from state
  const isProfileAgeWarn = age !== '' && (age < 10 || age > 100);
  const isProfileHeightWarn = height !== '' && (height < 120 || height > 220);
  const isProfileWeightWarn = weight !== '' && (weight < 30 || weight > 250);

  // Save changes handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg('');

    if (age === '') {
      setProfileMsg('❌ Please enter your age.');
      setLoading(false);
      return;
    }
    if (age < 10 || age > 100) {
      setProfileMsg('❌ Age must be between 10 and 100 years.');
      setLoading(false);
      return;
    }

    if (weight === '') {
      setProfileMsg('❌ Please enter your weight.');
      setLoading(false);
      return;
    }
    if (weight < 30 || weight > 250) {
      setProfileMsg('❌ Weight must be between 30kg and 250kg.');
      setLoading(false);
      return;
    }

    if (height === '') {
      setProfileMsg('❌ Please enter your height.');
      setLoading(false);
      return;
    }
    if (height < 120 || height > 220) {
      setProfileMsg('❌ Height must be between 120cm and 220cm.');
      setLoading(false);
      return;
    }

    try {
      const updated = await supabaseService.saveOnboarding({
        name,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        fitness_goal: goal,
        fitness_level: level,
        workout_frequency: frequency
      });
      onUpdateSuccess(updated);
      setProfileMsg('⚡ Athlete bio configurations updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch {
      setProfileMsg('❌ Updating profile failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    // Ensure they enter current passcode
    if (!oldPassword) {
      setPasswordError('❌ Verification Required: Please enter your current passcode.');
      return;
    }

    // Retrieve active current passcode. If they signed up/logged in on this browser, 
    // it will be saved, otherwise we safely default to the standard 'password123' used by the prototype.
    const currentPasscode = localStorage.getItem('athlete_current_passcode') || 'password123';

    if (oldPassword !== currentPasscode) {
      setPasswordError('❌ Security Warning: Current passcode is incorrect. Authorization denied.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('❌ Password Security: Passcode must be at least 6 characters in length.');
      return;
    }

    if (newPassword === currentPasscode) {
      setPasswordError('❌ Security Policy: The new passcode cannot be identical to your current passcode.');
      return;
    }

    setLoading(true);
    try {
      // Standard auth user update if online
      if (!isLocalModeActive()) {
        const { supabase } = await import('../supabaseService');
        if (supabase) {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) {
            throw error;
          }
        }
      }

      // Persist the updated passcode in local storage session
      localStorage.setItem('athlete_current_passcode', newPassword);
      
      setOldPassword('');
      setNewPassword('');
      setPasswordMsg('⚡ Success: Account credentials modified and synchronized across active channels!');
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err: any) {
      setPasswordError(`❌ Update failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="profile-page-layout" className="max-w-4xl mx-auto space-y-8 text-left animate-in fade-in duration-300">
      
      {/* 1. ATHLETE BIO CARD */}
      <div className="bg-neutral-950/40 border border-neutral-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Graphic */}
        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 bg-neutral-900 flex items-center justify-center text-3xl shrink-0 font-sans shadow-lg uppercase select-none">
          {user.name.substring(0, 2)}
        </div>
        
        <div className="space-y-1.5 min-w-0 text-center sm:text-left grow">
          <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
            {level} ATHLETE
          </span>
          <h2 className="text-2xl font-black text-neutral-100">{user.name}</h2>
          <p className="text-xs text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-neutral-500" /> {user.email}
          </p>
        </div>

        <button 
          id="logout-action-btn"
          onClick={onLogout} 
          className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-red-400 hover:bg-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Disconnect Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* EDIT PROFILE BIO DETAILS */}
        <div className="lg:col-span-2 bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-neutral-100 flex items-center gap-1.5 border-b border-neutral-900 pb-3"><Settings2 className="w-5 h-5 text-emerald-400" /> Personal Anthropometrics</h3>

          {profileMsg && (
            <p className="p-2.5 rounded-xl bg-neutral-900 text-xs text-emerald-400 font-medium">{profileMsg}</p>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Age</label>
                <input 
                  type="number" 
                  min={10}
                  max={100}
                  value={age}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAge(val === '' ? '' : parseInt(val));
                  }}
                  className={`w-full bg-[#0D0D0D] border ${
                    isProfileAgeWarn ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-neutral-800 focus:border-emerald-500 text-neutral-100'
                  } rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors`}
                  required
                />
                {isProfileAgeWarn && (
                  <p className="text-[10px] text-red-400 font-medium animate-pulse mt-1">❌ Invalid: Must be 10 to 100</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Height (cm)</label>
                <input 
                  type="number" 
                  min={120}
                  max={220}
                  value={height}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHeight(val === '' ? '' : parseInt(val));
                  }}
                  className={`w-full bg-[#0D0D0D] border ${
                    isProfileHeightWarn ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-neutral-800 focus:border-emerald-500 text-neutral-100'
                  } rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors`}
                  required
                />
                {isProfileHeightWarn && (
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
                  value={weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    setWeight(val === '' ? '' : parseFloat(val));
                  }}
                  className={`w-full bg-[#0D0D0D] border ${
                    isProfileWeightWarn ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-neutral-800 focus:border-emerald-500 text-neutral-100'
                  } rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors`}
                  required
                />
                {isProfileWeightWarn && (
                  <p className="text-[10px] text-red-400 font-medium animate-pulse mt-1">❌ Invalid: Must be 30 - 250 kg</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Focus Goal</label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Strength Building">Strength Building</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Fitness Condition</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Target frequency</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                >
                  <option value="1–2 days/week">1–2 days/week</option>
                  <option value="3–4 days/week">3–4 days/week</option>
                  <option value="5–6 days/week">5–6 days/week</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-lg transition mt-2 cursor-pointer"
            >
              {loading ? 'Committing...' : 'Commit Settings'}
            </button>
          </form>
        </div>

        {/* SIDE COLUMN: ACCOUNT SECURITY & DEVELOPER DEMO SEED */}
        <div className="space-y-6">          
          {/* PASSWORD RESET MODULE */}
          <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 border-b border-neutral-900 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account Security
            </h3>

            {passwordMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start gap-2 animate-in fade-in duration-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-relaxed">{passwordMsg}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-2 animate-in fade-in duration-300">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                <span className="text-[11px] font-medium leading-relaxed">{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Passcode field */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Current Passcode</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 pl-9 pr-10 text-xs text-neutral-100 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Passcode field */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">New Secure Passcode</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-500/60" />
                  </span>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 pl-9 pr-10 text-xs text-neutral-100 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live constraint checklists */}
              {newPassword && (
                <div className="p-2.5 bg-[#090909] rounded-xl border border-neutral-900/60 space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-emerald-400' : 'bg-red-500'}`} />
                    <span className={newPassword.length >= 6 ? 'text-emerald-400' : 'text-neutral-500'}>Minimum 6 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${newPassword !== oldPassword && oldPassword !== '' ? 'bg-emerald-400' : 'bg-red-500'}`} />
                    <span className={newPassword !== oldPassword && oldPassword !== '' ? 'text-emerald-400' : 'text-neutral-500'}>Different from current passcode</span>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/25 hover:border-emerald-400 hover:text-black text-neutral-200 text-xs font-semibold rounded-xl transition duration-200 cursor-pointer shadow-lg"
              >
                {loading ? 'Validating & Updating...' : 'Update Shield Passcode'}
              </button>
            </form>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 border-b border-neutral-900 pb-2.5"><Bell className="w-4 h-4 text-emerald-400" /> Client Alerts</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-neutral-400">Workout remidners</span>
                <input 
                  type="checkbox" 
                  checked={workoutReminders} 
                  onChange={(e) => setWorkoutReminders(e.target.checked)}
                  className="rounded bg-[#0D0D0D] border-neutral-800 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-neutral-400">Water target prompt alerts</span>
                <input 
                  type="checkbox" 
                  checked={waterReminders} 
                  onChange={(e) => setWaterReminders(e.target.checked)}
                  className="rounded bg-[#0D0D0D] border-neutral-800 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-neutral-400">Weekly aesthetics recap reports</span>
                <input 
                  type="checkbox" 
                  checked={weeklyReports} 
                  onChange={(e) => setWeeklyReports(e.target.checked)}
                  className="rounded bg-[#0D0D0D] border-neutral-800 text-emerald-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
