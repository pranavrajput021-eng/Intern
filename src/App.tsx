/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseService, isLocalModeActive } from './supabaseService';
import { UserProfile, AppNotification } from './types';

// Page Views
import AuthScreen from './components/AuthScreen';
import DashboardView from './components/DashboardView';
import WorkoutManager from './components/WorkoutManager';
import AnalyticsView from './components/AnalyticsView';
import NutritionAndHydration from './components/NutritionAndHydration';
import GoalsView from './components/GoalsView';
import WorkoutHistory from './components/WorkoutHistory';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import NotificationCenter from './components/NotificationCenter';

// Icons
import { 
  LayoutDashboard, Dumbbell, Apple, TrendingUp, Trophy, 
  History, User, ShieldCheck, Bell, Sparkles, Menu, X, LogOut, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);

  // States for notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [refreshSignal, setRefreshSignal] = useState<number>(0);

  // Mobile sidebar drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Tab labels mapping for title updates
  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    workouts: 'Train & Log',
    nutrition: 'Nutrition Hub',
    analytics: 'Analytics',
    goals: 'Goals & Badges',
    history: 'History Ledger',
    profile: 'Profile Bio',
    admin: 'Admin Terminal',
  };

  // Dynamically update document title based on currently active tab/view
  useEffect(() => {
    const tabLabel = tabLabels[activeTab] || 'Platform';
    document.title = `Aesthetic Athlete Platform - ${tabLabel}`;
  }, [activeTab]);

  useEffect(() => {
    checkCurrentSession();
  }, []);

  const checkCurrentSession = async () => {
    setLoading(true);
    try {
      const activeUser = await supabaseService.getCurrentUser();
      if (activeUser && activeUser.fitness_goal) {
        setUser(activeUser);
      }
    } catch (err) {
      console.error('Session loading failed', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationsCount = async () => {
    const list = await supabaseService.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    if (user) {
      loadNotificationsCount();
      // Poll notifications gently every 20s
      const handle = setInterval(() => {
        loadNotificationsCount();
      }, 20000);
      return () => clearInterval(handle);
    }
  }, [user, refreshSignal]);

  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    setRefreshSignal(prev => prev + 1);
  };

  const handleLogout = async () => {
    await supabaseService.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setShowNotifications(false);
  };

  // Helper calculation
  const unreadBellCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div id="loading-page" className="min-h-screen bg-[#000000] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin mb-4" />
        <h3 className="text-sm font-bold text-neutral-300 font-mono animate-pulse">AESTHETIC ENGINE COMMENCING...</h3>
      </div>
    );
  }

  // If session expired or unauthenticated
  if (!user) {
    return <AuthScreen onAuthSuccess={handleUpdateUser} />;
  }

  // Define sidebar navigation configuration
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'workouts', label: 'Train & Log', icon: <Dumbbell className="w-5 h-5" /> },
    { key: 'nutrition', label: 'Nutrition Hub', icon: <Apple className="w-5 h-5" /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { key: 'goals', label: 'Goals & Badges', icon: <Trophy className="w-5 h-5" /> },
    { key: 'history', label: 'History Ledger', icon: <History className="w-5 h-5" /> },
    { key: 'profile', label: 'Profile Bio', icon: <User className="w-5 h-5" /> },
    { key: 'admin', label: 'Admin Terminal', icon: <ShieldCheck className="w-5 h-5" /> },
  ];
  return (
    <div id="main-frame-layout" className="min-h-screen bg-[#000000] text-neutral-100 flex font-sans relative overflow-x-hidden antialiased">
      
      {/* 1. SIDEBAR NAVIGATION FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-black border-r border-[#032215]/80 shrink-0 relative overflow-hidden">
        
        {/* Animated Cyber Bio-Matrix Background Glows (Motivating Energy Flow) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle vertical moving indicator streams represent biometric signals */}
          <motion.div
            animate={{
              y: ["0%", "100%"],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 left-4 w-[1px] h-32 bg-gradient-to-b from-transparent via-emerald-500/45 to-transparent"
          />
          <motion.div
            animate={{
              y: ["100%", "0%"],
              opacity: [0.1, 0.35, 0.1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
            className="absolute top-0 right-8 w-[1px] h-48 bg-gradient-to-b from-transparent via-emerald-800/30 to-transparent"
          />
          {/* Subtle slow spinning ambient focal point */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-550/15 blur-2xl"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0)_60%,rgba(6,78,59,0.06)_100%)]" />
        </div>

        <div className="space-y-6 p-5 z-10 relative">
          {/* Brand header */}
          <div className="flex items-center gap-3 border-b border-emerald-950/40 pb-5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-950 p-[1px] flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full bg-[#000000] rounded-xl flex items-center justify-center">
                <Dumbbell className="text-emerald-450 w-5 h-5 animate-pulse" />
              </div>
            </motion.div>
            <div>
              <span className="text-[10px] text-emerald-500 tracking-widest font-mono select-none block leading-none font-bold uppercase">AESTHETIC PORTAL</span>
              <strong className="text-sm font-black text-neutral-50 tracking-tight">ATHLETE CO.</strong>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="space-y-2 text-left">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  id={`nav-${item.key}`}
                  onClick={() => handleNavigate(item.key)}
                  className="w-full relative py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-tight flex items-center gap-3 cursor-pointer transition-all duration-300 group overflow-hidden select-none"
                >
                  {/* Sliding glow background behind active items */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveBackground"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-emerald-900/10 border border-emerald-900/60 rounded-xl -z-10 shadow-inner"
                    />
                  )}

                  {/* Laser indicator tag */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    />
                  )}

                  {/* Left dot dynamic feedback */}
                  <span className={`transition-all duration-300 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 scale-110' : 'bg-neutral-800 scale-75 group-hover:bg-emerald-600/60'}`} />

                  {/* Icon with spin/bounce effect */}
                  <div className={`transition-transform duration-300 ${isActive ? 'text-emerald-300 scale-110' : 'text-neutral-500 group-hover:text-emerald-400 group-hover:scale-105'}`}>
                    {item.icon}
                  </div>

                  {/* Label text */}
                  <span className={`transition-colors duration-300 ${isActive ? 'text-emerald-300 font-black' : 'text-neutral-400 group-hover:text-neutral-100'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer/Signout box with motivating stats / bio sync status */}
        <div className="p-4 border-t border-emerald-950/60 z-10 relative bg-black/60 backdrop-blur-sm">

          <div className="flex items-center gap-3 mb-3 p-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full border border-emerald-900 bg-[#000] flex items-center justify-center text-xs font-bold uppercase text-emerald-400"
            >
              {user.name.substring(0, 2)}
            </motion.div>
            <div className="min-w-0 text-left">
              <p className="font-semibold text-xs text-neutral-200 truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-neutral-550 truncate leading-none font-mono">{user.email}</p>
            </div>
          </div>
          <button 
            id="sidebar-logout"
            onClick={handleLogout} 
            className="w-full py-2 bg-neutral-950/50 hover:bg-neutral-950 border border-emerald-950 hover:border-red-950 hover:text-red-400 text-neutral-500 rounded-xl text-[10px] font-bold font-mono tracking-wider flex items-center gap-2 justify-center transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER WITH INNER BODY SCROLLER */}
      <div className="flex-1 flex flex-col min-w-0 relative pb-20 lg:pb-0">
        
        {/* TOP ROW RESPONSIVE HEADER */}
        <header className="h-16 bg-black/80 border-b border-emerald-950/60 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
          
          {/* Brand/Hamburger triggers */}
          <div className="flex items-center gap-3">
            <button 
              id="mobile-drawer-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-1.5 rounded-lg border border-emerald-950 hover:bg-[#022c22]/40 text-neutral-400 hover:text-neutral-100 lg:hidden transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <Dumbbell className="text-emerald-400 w-4 h-4 animate-pulse" />
              <strong className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                {navItems.find(item => item.key === activeTab)?.label.split(' ')[0] || 'ATHLETE'}
              </strong>
              {isLocalModeActive() && (
                <span className="text-amber-400 font-semibold bg-amber-950/30 border border-amber-900/50 px-1.5 py-0.5 rounded text-[8px] tracking-tight animate-pulse ml-1">
                  OFFLINE
                </span>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400 font-bold tracking-wider">AESTHETIC ATHLETE PLATFORM</span>
              <span className="text-neutral-700">/</span>
              <span className="text-emerald-400 font-extrabold uppercase bg-emerald-950/30 border border-emerald-900/50 px-2.5 py-0.5 rounded-lg tracking-widest">
                {navItems.find(item => item.key === activeTab)?.label || 'OVERVIEW'}
              </span>
              {isLocalModeActive() && (
                <span className="text-amber-450 font-semibold bg-amber-955/30 border border-amber-900/50 px-2.5 py-0.5 rounded-lg tracking-wider text-[10px] animate-pulse">
                  OFFLINE DEV SANDBOX
                </span>
              )}
            </div>
          </div>

          {/* User profile & Notifications Center Triggers */}
          <div className="flex items-center gap-4 relative">
            <div className="flex items-center gap-3 text-right">
              <span className="hidden sm:inline-block text-xs text-neutral-400 font-light">Athlete ID: <strong className="text-neutral-200 font-bold">{user.name.split(' ')[0]}</strong></span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                id="bell-dropdown-toggle"
                onClick={() => setShowNotifications(!showNotifications)} 
                className="p-2 rounded-xl border border-neutral-850 hover:bg-neutral-900/50 text-neutral-400 hover:text-neutral-100 transition cursor-pointer"
                title="Notifications Hub"
              >
                <Bell className="w-4 h-4 text-neutral-300" />
                {unreadBellCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] font-mono font-bold text-white flex items-center justify-center animate-bounce">
                    {unreadBellCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationCenter onClose={() => setShowNotifications(false)} />
              )}
            </div>

            <div 
              onClick={() => handleNavigate('profile')}
              className="w-8.5 h-8.5 rounded-full border border-emerald-500/20 bg-neutral-900 text-xs font-bold uppercase text-emerald-400 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition select-none"
            >
              {user.name.substring(0, 2)}
            </div>
          </div>

        </header>

        {/* INNER SCROLLING VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full relative">
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              user={user} 
              onNavigate={handleNavigate} 
              triggerRefreshSignal={refreshSignal}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutManager 
              onRefreshDashboard={() => setRefreshSignal(prev => prev + 1)}
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionAndHydration 
              user={user} 
              onRefreshDashboard={() => setRefreshSignal(prev => prev + 1)}
              triggerRefreshSignal={refreshSignal}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              user={user} 
              triggerRefreshSignal={refreshSignal}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView 
              onRefreshDashboard={() => setRefreshSignal(prev => prev + 1)}
              triggerRefreshSignal={refreshSignal}
            />
          )}

          {activeTab === 'history' && (
            <WorkoutHistory />
          )}

          {activeTab === 'profile' && (
            <ProfilePage 
              user={user} 
              onLogout={handleLogout} 
              onUpdateSuccess={handleUpdateUser} 
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel 
              onRefreshAlertsHub={() => setRefreshSignal(prev => prev + 1)}
            />
          )}

        </main>

      </div>

      {/* 3. BOTTOM TAB BAR FOR MOBILE COMPLIANCE */}
      <nav id="mobile-bottom-tabs" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-950/95 border-t border-neutral-900 backdrop-blur-xl z-40 flex justify-around items-center px-2">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.key}
            id={`bottom-nav-${item.key}`}
            onClick={() => handleNavigate(item.key)}
            className={`flex flex-col items-center justify-center px-2 py-1 select-none cursor-pointer transition ${
              activeTab === item.key ? 'text-emerald-400 scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold mt-0.5">{item.label.split(' ')[0]}</span>
          </button>
        ))}
        {/* Overflow "More" menu button triggering remaining tabs */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center px-2 py-1 select-none cursor-pointer text-neutral-500`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">More</span>
        </button>
      </nav>

      {/* MOBILE DRAWER PORTAL POPUP */}
      {mobileMenuOpen && (
        <div id="mobile-drawer-portal" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden flex justify-start animate-fade-in duration-200">
          <div className="w-72 bg-neutral-950 h-full border-r border-neutral-900 p-5 flex flex-col justify-between animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="text-emerald-400 w-5 h-5" />
                  <strong className="text-sm font-black text-neutral-100">ATHLETE SYSTEM</strong>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-left">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigate(item.key)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                      activeTab === item.key 
                        ? 'bg-emerald-500 text-black font-bold' 
                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/40'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-red-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
          {/* Overlay Click-Away */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

    </div>
  );
}
