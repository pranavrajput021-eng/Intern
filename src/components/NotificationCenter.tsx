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
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'goal':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div id="notification-center-container" className="absolute right-0 top-14 w-80 sm:w-96 bg-neutral-950/95 border border-neutral-800 backdrop-blur-xl rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-3 duration-250">
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="font-semibold text-sm tracking-tight text-neutral-100">Notification Hub</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="mark-all-read-btn"
            onClick={markAllRead} 
            className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition"
            title="Mark all as read"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Read All</span>
          </button>
          <button 
            id="clear-notifications-btn"
            onClick={clearNotifications} 
            className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition"
            title="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button id="close-notifications-btn" onClick={onClose} className="p-1 text-neutral-500 hover:text-neutral-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <Bell className="w-8 h-8 mx-auto stroke-1 mb-2 text-neutral-600" />
            <p className="text-xs">No notifications yet</p>
            <p className="text-[10px] text-neutral-600 mt-1">Get active to unlock alerts!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-3.5 hover:bg-neutral-900/40 transition relative ${!notif.read ? 'bg-emerald-500/5 border-l-2 border-emerald-400' : ''}`}
            >
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-lg bg-neutral-800 border border-neutral-700/60 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-xs text-neutral-200">{notif.title}</p>
                    <span className="text-[9px] text-neutral-500 font-mono">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed break-words">{notif.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-neutral-950/80 border-t border-neutral-800 text-center">
        <p className="text-[10px] text-neutral-500 tracking-wide">FITNESS INTEL INTELLIGENCE SYSTEM</p>
      </div>
    </div>
  );
}
