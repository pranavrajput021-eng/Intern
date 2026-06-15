/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseService } from '../supabaseService';
import { NutritionLog, WaterLog } from '../types';
import { 
  Flame, Droplets, Plus, Sparkles, Check, 
  ChevronRight, Apple, Trash2, PieChart, Info 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface NutritionAndHydrationProps {
  user: any;
  onRefreshDashboard: () => void;
  triggerRefreshSignal: number;
}

export default function NutritionAndHydration({ user, onRefreshDashboard, triggerRefreshSignal }: NutritionAndHydrationProps) {
  const [foodsLogged, setFoodsLogged] = useState<NutritionLog[]>([]);
  const [waterToday, setWaterToday] = useState<number>(0);
  
  // Custom Food Logger states
  const [foodName, setFoodName] = useState('');
  const [qty, setQty] = useState('');
  const [cals, setCals] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fats, setFats] = useState<string>('');
  
  const [showLogFoodForm, setShowLogFoodForm] = useState(false);

  useEffect(() => {
    loadNutritionAndWater();
  }, [triggerRefreshSignal]);

  const loadNutritionAndWater = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const foodList = await supabaseService.getNutritionLogs(todayStr);
    setFoodsLogged(foodList);

    const waterList = await supabaseService.getWaterLogs(todayStr);
    const sum = waterList.reduce((acc, curr) => acc + curr.amount, 0);
    setWaterToday(sum);
  };

  // Target estimations based on Goal split
  const isMuscleGain = user.fitness_goal === 'Muscle Gain' || user.fitness_goal === 'Strength Building';
  const isWeightLoss = user.fitness_goal === 'Weight Loss' || user.fitness_goal === 'Fat Loss';

  const calorieTarget = isMuscleGain ? 3000 : (isWeightLoss ? 1800 : 2500);
  const proteinTarget = isMuscleGain ? 170 : (isWeightLoss ? 130 : 145); // in grams
  const carbTarget = isMuscleGain ? 380 : (isWeightLoss ? 180 : 280);
  const fatTarget = isMuscleGain ? 85 : (isWeightLoss ? 55 : 75);

  const totalCalsConsumed = foodsLogged.reduce((sum, f) => sum + f.calories, 0);
  const totalProteinConsumed = foodsLogged.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbsConsumed = foodsLogged.reduce((sum, f) => sum + f.carbs, 0);
  const totalFatsConsumed = foodsLogged.reduce((sum, f) => sum + f.fats, 0);

  const remainingCals = Math.max(calorieTarget - totalCalsConsumed, 0);

  // Water helper variables
  const waterTarget = 3000; // in ml

  // Submit handers
  const handleSubmitFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName) return;

    await supabaseService.logFood({
      food_name: foodName,
      quantity: qty || '1 serving',
      calories: parseInt(cals) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0
    });

    setFoodName('');
    setQty('');
    setCals('');
    setProtein('');
    setCarbs('');
    setFats('');
    setShowLogFoodForm(false);
    
    await supabaseService.addNotification('summary', 'Nutrition Intake Logged', `Successfully added "${foodName}"! Remaining daily calories is now ${remainingCals} kcal.`);
    
    loadNutritionAndWater();
    onRefreshDashboard();
  };

  const addPresetWater = async (ml: number) => {
    await supabaseService.logWater(ml);
    loadNutritionAndWater();
    onRefreshDashboard();
  };

  const removeFoodItem = (id: string) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const localKey = `fitness_app_nutrition_logs`;
      const allLogs = JSON.parse(localStorage.getItem(localKey) || '[]');
      const filtered = allLogs.filter((item: any) => item.id !== id);
      localStorage.setItem(localKey, JSON.stringify(filtered));
      loadNutritionAndWater();
      onRefreshDashboard();
    } catch {
      // safe bypass
    }
  };

  const getMacrosChartData = () => {
    return [
      { name: 'Protein (g)', actual: totalProteinConsumed, target: proteinTarget },
      { name: 'Carbs (g)', actual: totalCarbsConsumed, target: carbTarget },
      { name: 'Fats (g)', actual: totalFatsConsumed, target: fatTarget }
    ];
  };

  return (
    <div id="nutrition-view-layout" className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. NUTRITION SUMMARY HERO BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CALORIES REMAINING CIRCLE INTERACTIVE WIDGET */}
        <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between text-left col-span-1 lg:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-neutral-100 mb-0.5">Macro & Calorie Balance</h3>
              <p className="text-xs text-neutral-400">Your metabolic ledger is calculated based on targeted athletic gains.</p>
            </div>
            <Flame className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Visual Balance Circle */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border-[6px] border-emerald-500/10 border-t-emerald-500 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono tracking-tight text-neutral-50">{remainingCals}</span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wide">kcal left</span>
              </div>
            </div>

            {/* Micro Parameters details */}
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs pb-1.5 border-b border-neutral-900">
                <span className="text-neutral-400">Rolling Intake Target</span>
                <span className="font-bold font-mono text-neutral-200">{calorieTarget} kcal</span>
              </div>
              <div className="flex justify-between text-xs pb-1.5 border-b border-neutral-900">
                <span className="text-neutral-400">Actually Consumed Today</span>
                <span className="font-bold font-mono text-emerald-400">{totalCalsConsumed} kcal</span>
              </div>
              <div className="flex justify-between text-xs pb-1.5 border-b border-neutral-900">
                <span className="text-neutral-400 font-semibold">Remaining Surplus/Deficit</span>
                <span className="font-bold font-mono text-blue-400">{remainingCals} kcal</span>
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-2">
            <span>CALORIC INTEGRITY: GAINS SPLIT</span>
            <span>PROTEIN PRIORITY MODE</span>
          </div>
        </div>

        {/* WATER TRACKER PANEL RING */}
        <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between text-left">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-neutral-100 mb-0.5">Hydration Intake</h3>
              <p className="text-xs text-neutral-400">Total water parsed today.</p>
            </div>
            <Droplets className="w-5 h-5 text-sky-400" />
          </div>

          <div className="flex flex-col items-center my-4">
            <div className="w-24 h-24 rounded-full border-4 border-sky-500/20 flex flex-col items-center justify-center">
              <p className="text-2xl font-extrabold text-white font-mono">{waterToday}ml</p>
              <span className="text-[9px] uppercase text-sky-400 tracking-wider">/ 3000ml</span>
            </div>
          </div>

          {/* Quick-add preset buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              id="preset-water-250ml"
              onClick={() => addPresetWater(250)}
              className="py-2 bg-neutral-900 border border-neutral-800 hover:border-sky-500 hover:bg-sky-500/5 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer transition active:scale-95"
            >
              +250ml Cup
            </button>
            <button 
              id="preset-water-500ml"
              onClick={() => addPresetWater(500)}
              className="py-2 bg-neutral-900 border border-neutral-800 hover:border-sky-500 hover:bg-sky-500/5 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer transition active:scale-95"
            >
              +500ml Shaker
            </button>
            <button 
              id="preset-water-750ml"
              onClick={() => addPresetWater(750)}
              className="py-2 bg-neutral-900 border border-neutral-800 hover:border-sky-500 hover:bg-sky-500/5 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer transition active:scale-95"
            >
              +750ml Bottle
            </button>
            <button 
              id="preset-water-1l"
              onClick={() => addPresetWater(1000)}
              className="py-2 bg-neutral-900 border border-neutral-800 hover:border-sky-500 hover:bg-sky-500/5 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer transition active:scale-95"
            >
              +1.0L Pitcher
            </button>
          </div>
        </div>

      </div>

      {/* 2. DIRECT FOOD DIARY LOG & DIARY SPREADSHEETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LOG FOOD FORM */}
        <div className="col-span-1 bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-5 backdrop-blur-md text-left">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase text-neutral-300">Log Macronutrients</h3>
            <button 
              id="new-food-form-open-btn"
              onClick={() => setShowLogFoodForm(!showLogFoodForm)}
              className="p-1 px-2.5 bg-neutral-900 border border-neutral-800 text-xs rounded-lg hover:border-emerald-500 text-teal-400 transition"
              type="button"
            >
              {showLogFoodForm ? 'Collapse' : 'Expand Form'}
            </button>
          </div>

          {showLogFoodForm ? (
            <form onSubmit={handleSubmitFood} className="space-y-3 px-1">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold block">Meal Description</label>
                <input 
                  type="text" 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Grilled Chicken Breast with Jasmine Rice" 
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold block">Estimated Quality / Quantity</label>
                <input 
                  type="text" 
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="e.g. 250g cooked weight" 
                  className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 font-bold block">Calories (kcal)</label>
                  <input 
                    type="number" 
                    value={cals}
                    onChange={(e) => setCals(e.target.value)}
                    placeholder="520" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-1.5 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 font-bold block">Protein (g)</label>
                  <input 
                    type="number" 
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="45" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-1.5 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 font-bold block">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="65" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-1.5 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 font-bold block">Fats (g)</label>
                  <input 
                    type="number" 
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    placeholder="12" 
                    className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-emerald-500 rounded-xl py-1.5 px-3 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-lg cursor-pointer transition mt-4"
              >
                Log Meal Entry
              </button>
            </form>
          ) : (
            <div className="py-10 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-3xl pointer-events-none">
              <Apple className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs">Macronutrients logs form closed.</p>
              <p className="text-[10px] text-neutral-600 mt-1">Expand form above to submit foods</p>
            </div>
          )}
        </div>

        {/* FOOD DIARY SPREADSHEETS */}
        <div className="col-span-1 lg:col-span-2 bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-5 backdrop-blur-md text-left flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm uppercase text-neutral-300 mb-4 flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-400" /> Today's Meal Diary
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2.5">
              {foodsLogged.length === 0 ? (
                <div className="py-12 text-center text-neutral-500">
                  <p className="text-xs">No food items recorded for today yet.</p>
                  <p className="text-[10px] text-neutral-600 mt-1">Construct entries to monitor macro balances.</p>
                </div>
              ) : (
                foodsLogged.map((food) => (
                  <div key={food.id} className="p-3 bg-[#0A0A0A] border border-neutral-850 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-neutral-200">{food.food_name}</p>
                      <p className="text-[10px] text-neutral-500">
                        {food.quantity || '1 serving'} • P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-400">{food.calories} kcal</span>
                      <button 
                        onClick={() => removeFoodItem(food.id)} 
                        className="p-1 text-neutral-600 hover:text-red-400 cursor-pointer transition hover:bg-neutral-900 rounded-md"
                        title="Delete food log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 grid grid-cols-4 gap-2 text-center font-mono text-[10px] text-neutral-400">
            <div className="p-1 bg-[#0A0A0A] rounded border border-neutral-850">
              <span className="font-bold text-emerald-400 block">{totalCalsConsumed}</span>
              <span>CALORIES</span>
            </div>
            <div className="p-1 bg-[#0A0A0A] rounded border border-neutral-850">
              <span className="font-bold text-pink-400 block">{totalProteinConsumed}g</span>
              <span>PROTEIN</span>
            </div>
            <div className="p-1 bg-[#0A0A0A] rounded border border-neutral-850">
              <span className="font-bold text-sky-400 block">{totalCarbsConsumed}g</span>
              <span>CARBS</span>
            </div>
            <div className="p-1 bg-[#0A0A0A] rounded border border-neutral-850">
              <span className="font-bold text-amber-500 block">{totalFatsConsumed}g</span>
              <span>FATS</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. VISUAL MACROS COMPARATIVE CHART */}
      <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h3 className="font-bold text-sm uppercase text-neutral-300">Macro Allocation Benchmark</h3>
            <p className="text-xs text-neutral-450 mt-1">Benchmarks you actually logged versus predefined goals.</p>
          </div>
          <PieChart className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getMacrosChartData()} layout="vertical">
              <XAxis type="number" stroke="#525252" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#525252" fontSize={11} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', borderColor: '#262626', borderRadius: '12px' }} />
              <Bar dataKey="actual" fill="#10B981" name="Logged Actual" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" fill="#1E293B" name="Target Objective" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
