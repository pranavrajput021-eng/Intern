/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { supabaseService } from '../supabaseService';
import { AppNotification } from '../types';
import { Bell, Check, Trash2, X, Info, Award, Trophy, Dumbbell, Droplets } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const list = await supabaseService.getNotifications();
    setNotifications(list);
  };

  const markAllRead = async () => {
    await supabaseService.markAllNotificationsRead();
    loadNotifications();
  };

  const clearNotifications = () => {
    try {
      localStorage.setItem('fitness_app_notifications', JSON.stringify([]));
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className={`w-4 h-4 ${isLightMode ? 'text-emerald-600' : 'text-emerald-400'}`} />;
      case 'water':
        return <Droplets className={`w-4 h-4 ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`} />;
      case 'goal':
        return <Trophy className={`w-4 h-4 ${isLightMode ? 'text-amber-600' : 'text-amber-400'}`} />;
      default:
        return <Info className={`w-4 h-4 ${isLightMode ? 'text-teal-600' : 'text-teal-400'}`} />;
    }
  };

  return (
    <div 
      id="notification-center-container" 
      className={`absolute right-0 top-14 w-80 sm:w-96 border backdrop-blur-xl rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-3 duration-250 ${
        isLightMode 
          ? 'bg-white border-slate-200 shadow-slate-350/35' 
          : 'bg-neutral-950/95 border-neutral-800 shadow-neutral-950/50'
      }`}
    >
      <div className={`p-4 border-b flex justify-between items-center ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/50 border-neutral-800'
      }`}>
        <div className="flex items-center gap-2">
          <Bell className={`w-4 h-4 animate-pulse ${isLightMode ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <h3 className={`font-semibold text-sm tracking-tight ${isLightMode ? 'text-slate-800' : 'text-neutral-100'}`}>Notification Hub</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="mark-all-read-btn"
            onClick={markAllRead} 
            className={`text-xs flex items-center gap-1 transition ${
              isLightMode ? 'text-slate-500 hover:text-emerald-700' : 'text-neutral-400 hover:text-emerald-400'
            }`}
            title="Mark all as read"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Read All</span>
          </button>
          <button 
            id="clear-notifications-btn"
            onClick={clearNotifications} 
            className={`text-xs flex items-center gap-1 transition ${
              isLightMode ? 'text-slate-500 hover:text-rose-600' : 'text-neutral-400 hover:text-red-400'
            }`}
            title="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            id="close-notifications-btn" 
            onClick={onClose} 
            className={`p-1 transition ${
              isLightMode ? 'text-slate-400 hover:text-slate-700' : 'text-neutral-500 hover:text-neutral-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`max-h-80 overflow-y-auto divide-y ${isLightMode ? 'divide-slate-100' : 'divide-neutral-800'}`}>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <Bell className={`w-8 h-8 mx-auto stroke-1 mb-2 ${isLightMode ? 'text-slate-300' : 'text-neutral-600'}`} />
            <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>No notifications yet</p>
            <p className={`text-[10px] mt-1 ${isLightMode ? 'text-slate-400' : 'text-neutral-600'}`}>Get active to unlock alerts!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-3.5 transition relative ${
                !notif.read 
                  ? (isLightMode 
                      ? 'bg-emerald-500/5 border-l-2 border-emerald-500 hover:bg-emerald-500/[0.08]' 
                      : 'bg-emerald-500/5 border-l-2 border-emerald-400 hover:bg-neutral-900/40')
                  : (isLightMode ? 'hover:bg-slate-50/80 bg-white' : 'hover:bg-neutral-900/40')
              }`}
            >
              <div className="flex gap-2.5 items-start">
                <div className={`p-1.5 rounded-lg shrink-0 border ${
                  isLightMode 
                    ? 'bg-slate-50 border-slate-200/75' 
                    : 'bg-neutral-800 border-neutral-700/60'
                }`}>
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold text-xs ${isLightMode ? 'text-slate-800' : 'text-neutral-200'}`}>{notif.title}</p>
                    <span className={`text-[9px] font-mono ${isLightMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed break-words ${isLightMode ? 'text-slate-650' : 'text-neutral-400'}`}>{notif.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`p-2.5 border-t text-center ${
        isLightMode ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-neutral-950/80 border-neutral-800 text-neutral-500'
      }`}>
        <p className="text-[10px] tracking-wide font-mono font-semibold">FITNESS INTEL INTELLIGENCE SYSTEM</p>
      </div>
    </div>
  );
}
