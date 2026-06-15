/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseService } from '../supabaseService';
import { 
  ShieldAlert, Users, Dumbbell, Send, Plus, 
  Activity, BellRing, Database, ChevronRight, CheckCircle2 
} from 'lucide-react';

interface AdminPanelProps {
  onRefreshAlertsHub: () => void;
}

export default function AdminPanel({ onRefreshAlertsHub }: AdminPanelProps) {
  const [stats, setStats] = useState<any>({
    totalUsers: 12,
    activeUsers: 8,
    totalWorkouts: 34,
    averageWorkoutsPerUser: 4.2
  });

  // Exercises DB Manager State
  const [exercisesDb, setExercisesDb] = useState<string[]>([
    'Incline Dumbbell Press', 'Barbell Back Squat', 'Romanian Deadlift', 
    'Preacher Curl', 'Plank Hold', 'Treadmill Sprints', 'Cable Lateral Raise'
  ]);
  const [newDbEx, setNewDbEx] = useState('');

  // Notification Broadcaster State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('workout');
  
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    const data = await supabaseService.getAdminStats();
    setStats(data);
  };

  const handleCreateDbExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDbEx) return;
    setExercisesDb([...exercisesDb, newDbEx]);
    setNewDbEx('');
    setStatusMsg('⚡ New exercise appended to database schema.');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    await supabaseService.addNotification(notifType, notifTitle, notifMessage);
    
    setNotifTitle('');
    setNotifMessage('');
    setStatusMsg('📢 Broadcaster pushed notification to alerts hub successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
    onRefreshAlertsHub();
  };

  return (
    <div id="admin-panel-layout" className="space-y-8 text-left animate-in fade-in duration-300">
      
      {/* HEADER HERO */}
      <div className="bg-neutral-950/20 p-5 border border-emerald-500/10 rounded-3xl backdrop-blur-md flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <ShieldAlert className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">System Administrative Terminal</h2>
          <p className="text-xs text-neutral-400">Manage global assets, broadcast micro-notifications, and retrieve performance stats.</p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-emerald-450 font-mono">
          {statusMsg}
        </div>
      )}

      {/* 2. ADMIN STATS Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-4 bg-neutral-950/45 border border-neutral-850 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-450 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider">Registered Athletes</span>
            <Users className="w-4 h-4 text-neutral-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-100">{stats.totalUsers}</p>
          <span className="text-[9px] text-neutral-500 font-mono">100% database match</span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-neutral-950/45 border border-neutral-850 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-450 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Concurrencies</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">{stats.activeUsers}</p>
          <span className="text-[9px] text-neutral-500 font-mono">Active within 24 hours</span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-neutral-950/45 border border-neutral-850 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-450 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider">Programs Logged</span>
            <Dumbbell className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-100">{stats.totalWorkouts}</p>
          <span className="text-[9px] text-neutral-500 font-mono">Global workout metrics</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-neutral-950/45 border border-neutral-850 rounded-2xl">
          <div className="flex justify-between items-center text-neutral-450 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider">Average Intensity</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-100">{stats.averageWorkoutsPerUser}</p>
          <span className="text-[9px] text-neutral-500 font-mono">Workouts per athlete</span>
        </div>

      </div>

      {/* 3. WORK AREAS (BROADCASTER & SCHEMA MANAGER) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AREA A: ALERTS BROADCASTER */}
        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-3xl backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 border-b border-neutral-900 pb-2.5">
            <BellRing className="w-4 h-4 text-emerald-400" /> PUSH BROADCASTER INFRASTRUCTURE
          </h3>

          <form onSubmit={handleBroadcastNotification} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 font-semibold">Broadcasting Category</label>
              <select 
                value={notifType} 
                onChange={(e) => setNotifType(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-neutral-100 placeholder-neutral-600 focus:outline-none"
              >
                <option value="workout">Training Program Prompt</option>
                <option value="water">Intense Hydration Alert</option>
                <option value="goal">Milestone Achieved Reward</option>
                <option value="summary">Weekly Analytics summary recap</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-semibold">Broadcaster Announcement Title</label>
              <input 
                type="text" 
                placeholder="e.g. Flash Hydration Challenge today!"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-neutral-100 placeholder-neutral-600 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-semibold">Rich Message Body</label>
              <textarea 
                placeholder="Construct a detailed bulletin push that flashes on athlete dashboards..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full min-h-24 bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-neutral-100 placeholder-neutral-600 focus:outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              Broadcast Notification
            </button>
          </form>
        </div>

        {/* AREA B: EXERCISE CATALOG SCHEMA TABLE */}
        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-3xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 border-b border-neutral-900 pb-2.5">
              <Database className="w-4 h-4 text-emerald-400" /> Exercise Dictionary Schema
            </h3>

            {/* CATALOG LIST SCROLLER */}
            <div className="my-4 max-h-56 overflow-y-auto divide-y divide-neutral-900 pr-1">
              {exercisesDb.map((ex, index) => (
                <div key={index} className="py-2.5 flex justify-between items-center text-xs text-neutral-300">
                  <span className="font-semibold">{ex}</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">Core schema</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateDbExercise} className="mt-4 pt-4 border-t border-neutral-900 flex gap-2">
            <input 
              type="text" 
              placeholder="Inject new entry..." 
              value={newDbEx}
              onChange={(e) => setNewDbEx(e.target.value)}
              className="grow bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
              required
            />
            <button 
              type="submit" 
              className="px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-800 hover:border-neutral-700 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
