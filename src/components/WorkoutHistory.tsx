/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseService } from '../supabaseService';
import { Workout } from '../types';
import { 
  Search, ListFilter, ArrowDownUp, Clock, Flame, 
  Dumbbell, Calendar, ChevronRight, BookOpen, AlertCircle 
} from 'lucide-react';

export default function WorkoutHistory() {
  const [history, setHistory] = useState<Workout[]>([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortKey, setSortKey] = useState<Omit<keyof Workout, 'id' | 'user_id' | 'notes'> | 'date'>('created_at');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const list = await supabaseService.getWorkouts();
    setHistory(list);
  };

  // Filtering + Sorting pipeline
  const filteredHistory = history
    .filter(w => {
      const matchSearch = w.workout_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchFilter = filterType === 'All' || w.workout_type === filterType;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortKey === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortKey === 'duration') {
        return b.duration - a.duration;
      }
      if (sortKey === 'calories_burned') {
        return b.calories_burned - a.calories_burned;
      }
      return 0;
    });

  return (
    <div id="workout-history-layout" className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* HEADER HERO */}
      <div className="bg-neutral-950/20 p-5 border border-neutral-800/60 rounded-3xl backdrop-blur-md">
        <h2 className="text-xl font-extrabold text-white">Your Training Ledger</h2>
        <p className="text-xs text-neutral-400 mt-1">Review historic sessions, exercise duration records, and calories expenditure.</p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-950/40 p-4 border border-neutral-800/80 rounded-2xl backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search exercises or notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0E0E0E] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 pl-9 pr-4 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="relative flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-neutral-500 shrink-0" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-[#0E0E0E] text-xs border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Cardio">Cardio</option>
            <option value="HIIT">HIIT</option>
            <option value="Yoga">Yoga</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Functional Training">Functional Training</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-neutral-500 shrink-0" />
          <select 
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="w-full bg-[#0E0E0E] text-xs border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 focus:outline-none"
          >
            <option value="created_at">Sort by Newest Date</option>
            <option value="duration">Sort by Longest Duration</option>
            <option value="calories_burned">Sort by Highest Calories</option>
          </select>
        </div>
      </div>

      {/* SPREADSHEETS DIARY ENTRIES */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 border border-neutral-850 bg-neutral-950/20 rounded-3xl">
            <BookOpen className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm font-semibold">No logs comply with selectors</p>
            <p className="text-xs text-neutral-605 mt-1">Expand search variables or submit standard exercises.</p>
          </div>
        ) : (
          filteredHistory.map((workout) => (
            <div 
              key={workout.id} 
              id={`history-row-${workout.id}`}
              className="p-5 bg-neutral-950/40 border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1.5 text-left min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] uppercase font-mono font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/10">
                    {workout.workout_type}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(workout.created_at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-bold text-base text-neutral-100 truncate">{workout.workout_name}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xl truncate">{workout.notes || 'No custom annotations recorded.'}</p>
              </div>

              {/* STATS BREAKDOWN OR HIGHLIGHTS */}
              <div className="flex items-center gap-5 sm:self-center shrink-0 w-full sm:w-auto justify-between sm:justify-start pt-3 sm:pt-0 border-t border-neutral-900 sm:border-0">
                <div className="flex gap-4 text-xs font-mono text-neutral-400">
                  <div className="text-center sm:text-right">
                    <span className="text-[9px] text-neutral-500 block">MINUTES</span>
                    <span className="font-bold text-neutral-200 flex items-center gap-1 justify-end"><Clock className="w-3.5 h-3.5 text-neutral-500" /> {workout.duration}m</span>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[9px] text-neutral-500 block">KCAL BURN</span>
                    <span className="font-bold text-red-400 flex items-center gap-1 justify-end"><Flame className="w-3.5 h-3.5 text-red-500" /> {workout.calories_burned}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
