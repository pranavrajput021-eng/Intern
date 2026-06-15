/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseService } from '../supabaseService';
import { Goal, Achievement } from '../types';
import { 
  Trophy, Plus, CheckCircle2, Award, Zap, 
  Calendar, RotateCcw, Target, Sparkles, AlertCircle 
} from 'lucide-react';

interface GoalsViewProps {
  onRefreshDashboard: () => void;
  triggerRefreshSignal: number;
}

export default function GoalsView({ onRefreshDashboard, triggerRefreshSignal }: GoalsViewProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  
  // Custom goal builder states
  const [goalType, setGoalType] = useState('Weight');
  const [goalTitle, setGoalTitle] = useState('');
  const [targetVal, setTargetVal] = useState<string>('');
  const [currentVal, setCurrentVal] = useState<string>('');
  const [unit, setUnit] = useState('kg');

  const [showCreateGoalForm, setShowCreateGoalForm] = useState(false);

  useEffect(() => {
    loadGoalsAndBadges();
  }, [triggerRefreshSignal]);

  const loadGoalsAndBadges = async () => {
    // Fetch goals
    const list = await supabaseService.getGoals();
    setGoals(list);

    // Fetch achievements
    const achs = await supabaseService.getAchievements();
    setUnlockedAchievements(achs.map(a => a.achievement_key));
  };

  const handleGoalTypeChange = (type: string) => {
    setGoalType(type);
    if (type === 'Weight') {
      setUnit('kg');
    } else if (type === 'Workout') {
      setUnit('workouts');
    } else {
      setUnit('steps');
    }
  };

  const handleSubmitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !targetVal) return;

    await supabaseService.createGoal({
      goal_type: goalType,
      title: goalTitle,
      target_value: parseFloat(targetVal) || 10,
      current_value: parseFloat(currentVal) || 0,
      unit: unit,
      estimated_completion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 days out
    });

    setGoalTitle('');
    setTargetVal('');
    setCurrentVal('');
    setShowCreateGoalForm(false);
    
    await supabaseService.addNotification('goal', 'Milestone Set!', `You set a new ${goalType} goal: "${goalTitle}". Focus and earn your badges!`);
    
    loadGoalsAndBadges();
    onRefreshDashboard();
  };

  const incrementGoalProgress = async (id: string, current: number, target: number) => {
    const nextVal = Math.min(current + (unit === 'steps' ? 1000 : 1), target);
    await supabaseService.updateGoalProgress(id, nextVal);
    loadGoalsAndBadges();
    onRefreshDashboard();
  };

  // Badge list data definition
  const badgeReferenceList = [
    { key: 'first_workout', name: 'First Workout', desc: 'Successfully complete and record your first training program.', icon: '💪', level: 'Bronze' },
    { key: 'streak_7', name: '7 Day Streak', desc: 'Unlock consecutive daily logins or custom physical exercises.', icon: '🔥', level: 'Silver' },
    { key: 'streak_30', name: '30 Day Streak', desc: 'Sustain muscle building conditioning for 30 consecutive days.', icon: '⚡', level: 'Gold' },
    { key: 'workouts_100', name: '100 Workouts', desc: 'Join the Centennial Club by logging 100 finished programs.', icon: '👑', level: 'Platinum' },
    { key: 'first_weight_goal', name: 'First Weight Goal', desc: 'Successfully transition body statistics to set targets.', icon: '🎯', level: 'Gold' },
    { key: 'steps_10k', name: '10k Steps Club', desc: 'Perform more than 10,000 recorded paces in a single daylight.', icon: '👟', level: 'Bronze' }
  ];

  return (
    <div id="goals-view-wrapper" className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO HEADER */}
      <div className="bg-neutral-950/20 p-6 rounded-3xl border border-neutral-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Objectives & Achievement Badges
          </h2>
          <p className="text-xs text-neutral-400">Track milestones and gamified rewards unlocked by sustaining conditioning plans.</p>
        </div>
        <button 
          id="construct-goal-open-btn"
          onClick={() => setShowCreateGoalForm(!showCreateGoalForm)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Construct Goal
        </button>
      </div>

      {/* FORM: GOALS FORMS EDITOR */}
      {showCreateGoalForm && (
        <form onSubmit={handleSubmitGoal} className="max-w-md mx-auto p-5 border border-neutral-800 bg-neutral-950/80 backdrop-blur-md rounded-3xl text-left space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
            <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-400" /> Goal Designer</h4>
            <button type="button" onClick={() => setShowCreateGoalForm(false)} className="text-neutral-500 hover:text-neutral-300 text-xs">Close</button>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-500 font-bold block">Type of Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {['Weight', 'Workout', 'Health'].map(type => (
                  <button 
                    key={type}
                    type="button"
                    onClick={() => handleGoalTypeChange(type)}
                    className={`py-1.5 border text-xs rounded-xl cursor-pointer transition ${goalType === type ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' : 'bg-[#0D0D0D] border-neutral-800 text-neutral-400'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-neutral-500 font-bold block">Goal Headline/Title</label>
              <input 
                type="text" 
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder={goalType === 'Weight' ? 'Lose 5 kg of fat' : (goalType === 'Workout' ? '4 intense squats sessions' : 'Drink 3 liters daily')}
                className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-bold block">Target Value ({unit})</label>
                <input 
                  type="number" 
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                  placeholder="80"
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-1.5 px-3 text-xs text-neutral-100 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-bold block">Current Starter Base</label>
                <input 
                  type="number" 
                  value={currentVal}
                  onChange={(e) => setCurrentVal(e.target.value)}
                  placeholder="70"
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-1.5 px-3 text-xs text-neutral-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-lg transition"
          >
            Construct Milestone Objective
          </button>
        </form>
      )}

      {/* 2. GOAL MILESTONES SPREADSHEET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* COL 1: Active Targets */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-mono font-black tracking-wider text-neutral-400 block pb-1 border-b border-neutral-900">Current Targets Log</span>
          {goals.length === 0 ? (
            <div className="py-12 bg-neutral-950/20 border border-neutral-800 rounded-3xl text-center text-neutral-500">
              <Target className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs">No active targets created yet.</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progressRatio = goal.target_value ? (goal.current_value / goal.target_value) : 0;
              const progressPercent = Math.min(Math.round(progressRatio * 100), 100);
              const isFinishedStr = goal.current_value >= goal.target_value;

              return (
                <div key={goal.id} className="p-4.5 bg-neutral-950/40 border border-neutral-800/80 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mb-1">
                        {goal.goal_type} Objective
                      </span>
                      <h4 className="font-bold text-sm text-neutral-100">{goal.title}</h4>
                    </div>
                    {isFinishedStr ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500/10 text-emerald-400" /> Finished
                      </span>
                    ) : (
                      <button 
                        onClick={() => incrementGoalProgress(goal.id, goal.current_value, goal.target_value)}
                        className="px-2.5 py-1 text-[10px] font-mono font-medium border border-neutral-800 text-teal-300 hover:border-emerald-500 active:bg-emerald-500/5 hover:text-white rounded-lg transition"
                      >
                        + Progress
                      </button>
                    )}
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                      <span>{progressPercent}% Complete</span>
                      <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                    </div>
                  </div>

                  {goal.estimated_completion && (
                    <div className="pt-2 border-t border-neutral-900 flex justify-between items-center text-[9px] font-mono text-neutral-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Estimated Completion Target</span>
                      <span>{new Date(goal.estimated_completion).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* COL 2: Unlocking criteria summary */}
        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-3xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-mono font-black tracking-wider text-neutral-400 block pb-1 border-b border-neutral-900 mb-4">Milestone Intel Tracker</span>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              By completing exercises or transitioning weight parameter thresholds, achievements are dynamically unlocked. Unlocking badges generates micro-feedbacks across your custom notification centers.
            </p>
          </div>

          <div className="my-5 p-4.5 bg-neutral-900/40 border border-neutral-850 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-neutral-500 font-mono block">BENCHMARK STANDARDS</span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-start gap-1.5">⚖️ <strong className="text-neutral-200">Fat Loss Target</strong>: Cardio elements combined with water target updates.</li>
              <li className="flex items-start gap-1.5">⚡ <strong className="text-neutral-200">Aggressive Conditioning</strong>: Log 10 or more finished programs to elevate score.</li>
              <li className="flex items-start gap-1.5">💧 <strong className="text-neutral-200">Hydration Thresholds</strong>: Maintain water quantities of 3.0L.</li>
            </ul>
          </div>

          <div className="text-[10px] font-mono text-neutral-500 text-center border-t border-neutral-900 pt-2.5">
            AESTHETIC INTELLIGENCE SEEDS ACTIVATED
          </div>
        </div>

      </div>

      {/* 3. ACHIVEMENT BADGES GRID */}
      <div>
        <span className="text-xs uppercase font-mono font-black tracking-wider text-neutral-400 text-left block pb-1 border-b border-neutral-900 mb-6">Gamified Badges Registry</span>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badgeReferenceList.map((badge) => {
            const isUnlocked = unlockedAchievements.includes(badge.key);

            return (
              <div 
                key={badge.key}
                id={`achievement-badge-${badge.key}`}
                className={`p-4.5 rounded-2xl border text-center flex flex-col items-center justify-between transition relative overflow-hidden group ${
                  isUnlocked 
                    ? 'bg-neutral-950/40 border-neutral-800/80 hover:border-emerald-500' 
                    : 'bg-[#060606]/85 border-neutral-900 opacity-60'
                }`}
              >
                {/* Visual Unlocked Sparkle Indicator */}
                {isUnlocked && (
                  <div className="absolute top-1.5 right-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  </div>
                )}

                {/* Badge Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow ${
                  isUnlocked 
                    ? 'bg-neutral-900 border border-neutral-800 group-hover:scale-110 duration-200' 
                    : 'bg-neutral-950 border border-neutral-900 filter grayscale'
                }`}>
                  {badge.icon}
                </div>

                <div className="space-y-1">
                  <h5 className={`text-xs font-bold ${isUnlocked ? 'text-neutral-100' : 'text-neutral-500'}`}>{badge.name}</h5>
                  <p className="text-[9px] text-neutral-500 leading-normal line-clamp-2 px-1">{badge.desc}</p>
                </div>

                {isUnlocked ? (
                  <span className="text-[9px] font-mono font-extrabold uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-3">
                    {badge.level} Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-neutral-600 uppercase mt-3">
                    Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
