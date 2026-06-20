/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabaseService } from '../supabaseService';
import { Workout, Exercise } from '../types';
import { 
  Play, Plus, Dumbbell, Clock, Flame, ChevronRight, 
  Trash2, PlusCircle, Check, Sparkles, X, 
  RotateCcw, SkipForward, Star, ChevronLeft, Volume2
} from 'lucide-react';

interface WorkoutManagerProps {
  onRefreshDashboard: () => void;
}

export default function WorkoutManager({ onRefreshDashboard }: WorkoutManagerProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'active'>('list');

  // Creator state
  const [name, setName] = useState('');
  const [type, setType] = useState('Strength Training');
  const [duration, setDuration] = useState<number>(45);
  const [notes, setNotes] = useState('');
  
  // Custom temp exercises of current creator draft
  const [draftExercises, setDraftExercises] = useState<Omit<Exercise, 'id' | 'workout_id'>[]>([]);
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('Chest');
  const [exSets, setExSets] = useState<number>(3);
  const [exReps, setExReps] = useState<number>(10);
  const [exWeight, setExWeight] = useState<number>(20);
  const [exRest, setExRest] = useState<number>(60);
  const [exNotes, setExNotes] = useState('');

  // Active workout session state
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [activeExercises, setActiveExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  
  // Active Timer hooks
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);

  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const list = await supabaseService.getWorkouts();
    setWorkouts(list);
  };

  // --- AUDIO SYNTHESIZER ---
  const playBeep = (freq: number = 800, durationMs: number = 100) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + durationMs/1000);
      
      osc.start();
      osc.stop(audioCtx.currentTime + durationMs/1000);
    } catch {
      // Audio context might be restricted of iframe by default browser security
    }
  };

  // --- CREATOR FUNCTIONS ---
  
  const addExerciseToDraft = () => {
    if (!exName) return;
    setDraftExercises([
      ...draftExercises,
      {
        exercise_name: exName,
        category: exCategory,
        sets: exSets,
        reps: exReps,
        weight: exWeight,
        rest_time: exRest,
        notes: exNotes
      }
    ]);
    // Clear exercise inputs
    setExName('');
    setExNotes('');
  };

  const removeExerciseFromDraft = (index: number) => {
    setDraftExercises(draftExercises.filter((_, i) => i !== index));
  };

  const saveCustomWorkout = async () => {
    if (!name) return;
    if (draftExercises.length === 0) {
      alert('Please add at least one exercise to your custom routine!');
      return;
    }

    const calculatedCalories = duration * (
      type === 'HIIT' ? 12 :
      type === 'Cardio' ? 10 :
      type === 'Running' ? 11 :
      type === 'Cycling' ? 9 : 7
    );

    await supabaseService.createWorkout({
      workout_name: name,
      workout_type: type,
      duration: duration,
      calories_burned: calculatedCalories,
      notes: notes
    }, draftExercises);

    // Reset Form
    setName('');
    setNotes('');
    setDraftExercises([]);
    setView('list');
    loadWorkouts();
    onRefreshDashboard();
  };

  // --- LIVE ACTIVE WORKOUT ENGINE ---

  const startActiveSession = async (workout: Workout) => {
    setActiveWorkout(workout);
    
    // Fetch real exercises from db/storage
    const exercisesList = await supabaseService.getExercises(workout.id);
    if (exercisesList.length === 0) {
      setActiveExercises([
        {
          id: 'temp-ex-1',
          workout_id: workout.id,
          exercise_name: 'Dumbbell Shoulder Press',
          category: 'Shoulders',
          sets: 3,
          reps: 10,
          weight: 22,
          rest_time: 60
        },
        {
          id: 'temp-ex-2',
          workout_id: workout.id,
          exercise_name: 'Lateral Dumbbell Raises',
          category: 'Shoulders',
          sets: 3,
          reps: 12,
          weight: 10,
          rest_time: 45
        }
      ]);
    } else {
      setActiveExercises(exercisesList);
    }

    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setWorkoutSeconds(0);
    setRestSeconds(0);
    setView('active');

    // Start total workout timer
    if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    workoutTimerRef.current = setInterval(() => {
      setWorkoutSeconds(prev => prev + 1);
    }, 1000);
  };

  // Rest Timer Controller
  useEffect(() => {
    if (isResting && restSeconds > 0) {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
      restTimerRef.current = setInterval(() => {
        setRestSeconds(prev => {
          if (prev <= 1) {
            // End of Rest
            setIsResting(false);
            if (restTimerRef.current) clearInterval(restTimerRef.current);
            playBeep(900, 250); // Beep to start training!
            return 0;
          }
          if (prev === 4 || prev === 3 || prev === 2) {
            playBeep(600, 80); // Little alert countdown beeps
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isResting, restSeconds]);

  const handleCompleteSet = () => {
    const currentEx = activeExercises[currentExerciseIndex];
    if (currentSet < currentEx.sets) {
      setCurrentSet(prev => prev + 1);
      // Trigger Rest mode!
      const restDuration = currentEx.rest_time || 60;
      setRestSeconds(restDuration);
      setIsResting(true);
      playBeep(400, 150); // complete rest beep
    } else {
      // Next Exercise or Finish!
      if (currentExerciseIndex < activeExercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(false);
        playBeep(850, 150);
      } else {
        finishWorkoutSuccessfully();
      }
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < activeExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      playBeep(500, 150);
    } else {
      finishWorkoutSuccessfully();
    }
  };

  const finishWorkoutSuccessfully = async () => {
    if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);

    const calculatedDuration = Math.max(Math.round(workoutSeconds / 60), 1);
    const calRate = activeWorkout?.workout_type === 'HIIT' ? 12 : 
                    activeWorkout?.workout_type === 'Cardio' ? 10 : 8;
    const computedBurn = calculatedDuration * calRate;

    // Save final stats back to dashboard logs
    if (activeWorkout) {
      await supabaseService.createWorkout({
        workout_name: activeWorkout.workout_name,
        workout_type: activeWorkout.workout_type,
        duration: calculatedDuration,
        calories_burned: computedBurn,
        notes: `Executed via live training room. Average pulse high.`
      }, activeExercises);
    }

    playBeep(1200, 500); // Massive victory cheer synth buzzer!

    alert(`💪 Workout Absolute Victory!\nDuration: ${calculatedDuration} minutes\nEstimated Calories Burned: ${computedBurn} kcal.`);

    setView('list');
    setActiveWorkout(null);
    loadWorkouts();
    onRefreshDashboard();
  };

  const terminateWorkoutSession = () => {
    if (confirm('Are you sure you want to stop this training session? No progress will be logged.')) {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
      if (restTimerRef.current) clearInterval(restTimerRef.current);
      setView('list');
      setActiveWorkout(null);
    }
  };

  // Format Helper
  const formatSecs = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEx = activeExercises[currentExerciseIndex];

  return (
    <div id="workout-manager-wrapper" className="space-y-6">

      {/* VIEW: LIST (WORKOUTS LIBRARY) */}
      {view === 'list' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-neutral-950/20 p-5 rounded-3xl border border-neutral-800/60">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">Your Workout Programs</h2>
              <p className="text-xs text-neutral-400">Launch standard presets or construct your own hypertrophy training splits.</p>
            </div>
            <button 
              id="create-new-workout-btn"
              onClick={() => setView('create')} 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Build Custom
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Standard preseeded / dynamic list card */}
            {workouts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-3xl">
                <Dumbbell className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm font-semibold">No workouts created yet</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">Create a custom routine with your favorite exercises and launch details whenever you are ready! Or reset the system to generate demo exercises.</p>
              </div>
            ) : (
              workouts.map((workout) => (
                <div 
                  key={workout.id} 
                  id={`workout-card-${workout.id}`}
                  className="bg-neutral-950/40 border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {workout.workout_type}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(workout.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-neutral-100">{workout.workout_name}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{workout.notes || 'No notes left. Focus on power and pacing.'}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-900 flex justify-between items-center">
                    <div className="flex gap-4 text-xs font-mono text-neutral-400">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-500" /> {workout.duration}m</span>
                      <span className="flex items-center gap-1 text-red-400"><Flame className="w-3.5 h-3.5 text-red-500" /> {workout.calories_burned} kcal</span>
                    </div>

                    <button 
                      id={`start-session-btn-${workout.id}`}
                      onClick={() => startActiveSession(workout)} 
                      className="p-2 rounded-xl bg-[#0D0D0D] border border-neutral-800 text-emerald-400 hover:bg-emerald-400 hover:text-black hover:border-emerald-400 transition cursor-pointer"
                      title="Start program training session"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      )}

      {/* VIEW: CREATE CUSTOM WORKOUT */}
      {view === 'create' && (
        <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6 block max-w-2xl mx-auto text-left animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <button 
              id="back-list-btn"
              onClick={() => setView('list')} 
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-100 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Back to library
            </button>
            <h3 className="font-bold text-sm text-neutral-100">Workout Builder</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Workout Program Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Upper Body Chest Day, Morning Core Burn" 
                className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Training Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                >
                  <option value="Strength Training">Strength Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Functional Training">Functional Training</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Estimated Duration (mins)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 45)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Program Notes (optional)</label>
              <input 
                type="text" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tips on focus points or accessories" 
                className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
              />
            </div>
          </div>

          {/* EXERCISES LOGGER BLOCK */}
          <div className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-neutral-300">Add Exercises To Workout</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500">Exercise Name</label>
                <input 
                  type="text" 
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  placeholder="e.g. Bench Press, Leg Extensions" 
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500">Muscle Category</label>
                <select 
                  value={exCategory}
                  onChange={(e) => setExCategory(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 focus:outline-none focus:outline-none"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Legs">Legs</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500">Sets</label>
                <input 
                  type="number" 
                  value={exSets}
                  onChange={(e) => setExSets(parseInt(e.target.value) || 3)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 rounded-xl py-1 px-2 text-center text-xs text-neutral-100 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500">Reps</label>
                <input 
                  type="number" 
                  value={exReps}
                  onChange={(e) => setExReps(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 rounded-xl py-1 px-2 text-center text-xs text-neutral-100 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500">Weight (kg)</label>
                <input 
                  type="number" 
                  value={exWeight}
                  onChange={(e) => setExWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 rounded-xl py-1 px-2 text-center text-xs text-neutral-100 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500">Rest (s)</label>
                <input 
                  type="number" 
                  value={exRest}
                  onChange={(e) => setExRest(parseInt(e.target.value) || 60)}
                  className="w-full bg-[#0D0D0D] border border-neutral-800 rounded-xl py-1 px-2 text-center text-xs text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={addExerciseToDraft}
              className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-teal-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Exercise to Core Checklist
            </button>
          </div>

          {/* DISPLAY DRAFT EXERCISES CHECKS */}
          {draftExercises.length > 0 && (
            <div className="space-y-2 pointer-events-none">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Exercise Queue</span>
              {draftExercises.map((draft, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#0D0D0D] border border-neutral-800 p-2.5 rounded-xl text-left">
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-neutral-200">{draft.exercise_name}</p>
                    <p className="text-[10px] text-neutral-500">{draft.category} • {draft.sets} sets x {draft.reps} reps ({draft.weight}kg)</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeExerciseFromDraft(idx)} 
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer pointer-events-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* FINAL PROGRAM LAUNCH BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => { setView('list'); setDraftExercises([]); }}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-semibold rounded-xl transition"
            >
              Discard Builder
            </button>
            <button 
              type="button" 
              onClick={saveCustomWorkout}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              Save workout program
            </button>
          </div>

        </div>
      )}

      {/* VIEW: LIVE ACTIVE WORKOUT SESSION SCREEN */}
      {view === 'active' && activeWorkout && currentEx && (
        <div className="max-w-xl mx-auto bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden">
          
          {/* Cyber accents */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-neutral-800/60 pb-3">
            <div className="text-left">
              <span className="text-[10px] font-mono tracking-widest text-[#10B981] font-bold block uppercase">{activeWorkout.workout_type} Session</span>
              <h2 className="text-base font-extrabold text-neutral-100 truncate max-w-sm">{activeWorkout.workout_name}</h2>
            </div>
            <button 
              onClick={terminateWorkoutSession} 
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-400 text-neutral-400 hover:text-red-400 transition cursor-pointer"
              title="Quit session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ACTIVE GRAPHIC TIMER CARD */}
          <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-850 space-y-2 relative">
            <span className="text-[10px] text-neutral-500 font-semibold font-mono tracking-wider block uppercase">TOTAL DURATION ENERGETICS</span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 text-glow">
              {formatSecs(workoutSeconds)}
            </div>
            <p className="text-[10px] text-neutral-400">Rest phases and pacing metrics automatically recorded</p>
          </div>

          {/* ACTIVE EXERCISE VIEW CARD */}
          <div className="bg-[#000000] border border-emerald-950 rounded-2xl p-5 space-y-4 text-center shadow-lg shadow-emerald-950/10">
            <div>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-[10px] font-mono font-bold uppercase">
                {currentEx.category} TARGET
              </span>
              <h3 className="text-2xl font-black text-neutral-100 mt-2.5">{currentEx.exercise_name}</h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">Exercise {currentExerciseIndex + 1} of {activeExercises.length}</p>
            </div>

            {/* Sets & weights details */}
            <div className="grid grid-cols-2 gap-4 py-2 text-center max-w-xs mx-auto">
              <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold block">SET WORKLOAD</span>
                <span className="text-xl font-bold text-neutral-200 font-mono">
                  {currentSet} <span className="text-xs text-neutral-500 font-sans">/ {currentEx.sets}</span>
                </span>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold block">SAVED WEIGHT</span>
                <span className="text-xl font-bold text-neutral-200 font-mono">
                  {currentEx.weight} <span className="text-xs text-neutral-500 font-sans">kg</span>
                </span>
              </div>
            </div>

            {currentEx.notes && (
              <p className="text-xs text-emerald-400/80 bg-emerald-500/5 py-1 px-3 rounded-lg inline-block border border-emerald-500/10">
                💡 {currentEx.notes}
              </p>
            )}
          </div>

          {/* REST TIMER SECTION (OVERLAY OR SUB-WIDGET) */}
          {isResting && (
            <div className="p-5.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center animate-bounce duration-300">
              <div className="flex justify-center items-center gap-2 text-teal-400">
                <Volume2 className="w-5 h-5 text-teal-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">REST PHASE ACTIVATED</span>
              </div>
              <p className="text-3xl font-black font-mono text-teal-300 mt-1.5">{restSeconds}s</p>
              <button 
                onClick={() => setIsResting(false)} 
                className="mt-3 px-4 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-teal-500/20 text-teal-400 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Skip Rest & Train
              </button>
            </div>
          )}

          {/* BUTTON ACTIONS INACTIVE IF RESTING OR COMPLETED */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              onClick={handleSkipExercise}
              className="py-3 px-4 bg-neutral-800 border border-neutral-750 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <SkipForward className="w-4 h-4" /> Skip Exercise
            </button>

            <button 
              onClick={handleCompleteSet}
              className="sm:col-span-2 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition"
            >
              <Check className="w-4 h-4 text-black stroke-[3]" />
              {currentSet === currentEx.sets ? 'Finish Exercise Complete' : 'Log & Complete Set'}
            </button>
          </div>

          {/* FINISH WORKOUT BUTTON ACCESSIBLE AT ALL TIME */}
          <button 
            onClick={finishWorkoutSuccessfully}
            className="w-full mt-2 py-2 border border-dashed border-neutral-800 hover:border-red-400/40 text-neutral-500 hover:text-red-400 transition rounded-xl text-xs font-mono font-bold cursor-pointer"
          >
            🏁 END SESSION AND COMPILE ENERGY BURN NOW
          </button>

        </div>
      )}

    </div>
  );
}
