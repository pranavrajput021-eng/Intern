/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  supabaseService, 
  isLocalModeActive, 
  setLocalModeActive, 
  isUsingCustomKeys, 
  getSupabaseUrlValue,
  supabase
} from '../supabaseService';
import { 
  ShieldCheck, ShieldAlert, Users, Dumbbell, Send, Plus, 
  Activity, BellRing, Database, ChevronRight, CheckCircle2,
  Search, Lock, Unlock, Ban, Trash2, AlertTriangle, RotateCcw,
  History, Slack, Eye, Settings, Key, RefreshCw, Sliders, X,
  FileText, SlidersHorizontal, Check, ExternalLink, HelpCircle,
  UserCheck, Shield, AlertCircle, Upload
} from 'lucide-react';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

interface AdminPanelProps {
  onRefreshAlertsHub: () => void;
}

interface UserProfileSimulated {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  is_banned: boolean;
  avatar: string;
  bio: string;
  created_at: string;
  mfa_enabled: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  targetUser: string;
  action: string;
  details: string;
  beforeValue?: string;
  afterValue?: string;
}

// Generates beautiful stylized cyber vectors per role/scope - 0% external human photo reliance
export const getStandardAvatar = (role: string = 'user'): string => {
  let startCol = '%2300E38C'; // Emerald Green
  let endCol = '%2318D8FF';   // Cyan Blue
  if (role === 'admin') {
    startCol = '%23FFB800'; // Gold Warning
    endCol = '%23FF3E3E';   // Cyber Crimson
  } else if (role === 'moderator') {
    startCol = '%2318D8FF'; // Cyan Blue
    endCol = '%23B5179E';   // High-Contrast Purple
  }
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad-${role}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${startCol}"/><stop offset="100%" style="stop-color:${endCol}"/></linearGradient></defs><rect width="100" height="100" fill="url(%23grad-${role})"/><circle cx="50" cy="40" r="18" fill="%23050505"/><path d="M25 80 c0-15 10-22 25-22 s25 7 25 22" fill="%23050505"/></svg>`;
};

const SUPABASE_INIT_SQL = `-- 1. Create Users profile table
CREATE TABLE IF NOT EXISTS public."Users" (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  gender TEXT,
  height NUMERIC,
  weight NUMERIC,
  fitness_goal TEXT,
  fitness_level TEXT,
  workout_frequency TEXT,
  avatar TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  is_banned BOOLEAN DEFAULT false,
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Users
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users" ON public."Users"
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own record" ON public."Users"
  FOR UPDATE USING (auth.uid() = id);

-- 2. Create Workouts table
CREATE TABLE IF NOT EXISTS public."Workouts" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  workout_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Exercises table
CREATE TABLE IF NOT EXISTS public."Exercises" (
  id TEXT PRIMARY KEY,
  workout_id TEXT REFERENCES public."Workouts"(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  category TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC NOT NULL,
  rest_time INTEGER,
  notes TEXT
);

-- 4. Create Goals table
CREATE TABLE IF NOT EXISTS public."Goals" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  estimated_completion TIMESTAMP WITH TIME ZONE
);

-- 5. Create WeightLogs table
CREATE TABLE IF NOT EXISTS public."WeightLogs" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL,
  date DATE NOT NULL
);

-- 6. Create MeasurementLogs table
CREATE TABLE IF NOT EXISTS public."MeasurementLogs" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  chest NUMERIC,
  waist NUMERIC,
  hips NUMERIC,
  arms NUMERIC,
  thighs NUMERIC,
  date DATE NOT NULL
);

-- 7. Create NutritionLogs table
CREATE TABLE IF NOT EXISTS public."NutritionLogs" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity TEXT,
  calories INTEGER NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fats NUMERIC NOT NULL,
  date DATE NOT NULL
);

-- 8. Create WaterLogs table
CREATE TABLE IF NOT EXISTS public."WaterLogs" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  date DATE NOT NULL
);

-- 9. Create StepLogs table
CREATE TABLE IF NOT EXISTS public."StepLogs" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  steps INTEGER NOT NULL,
  distance NUMERIC NOT NULL,
  date DATE NOT NULL
);

-- 10. Create Achievements table
CREATE TABLE IF NOT EXISTS public."Achievements" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Create Notifications table
CREATE TABLE IF NOT EXISTS public."Notifications" (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public."Users"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  read BOOLEAN DEFAULT false
);

-- 12. Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

// Initial Mock Users
const INITIAL_USERS: UserProfileSimulated[] = [
  { 
    id: 'usr-1', 
    name: 'Alexander Wright', 
    email: 'alex@athlete.com', 
    role: 'admin', 
    is_banned: false, 
    avatar: getStandardAvatar('admin'), 
    bio: 'Elite powerlifter training for nationals.', 
    created_at: '2026-05-01', 
    mfa_enabled: true 
  },
  { 
    id: 'usr-2', 
    name: 'Sarah Jenkins', 
    email: 'sarah.j@fitness.co', 
    role: 'moderator', 
    is_banned: false, 
    avatar: getStandardAvatar('moderator'), 
    bio: 'Certified trainer and athletic nutritionist.', 
    created_at: '2026-05-15', 
    mfa_enabled: false 
  },
  { 
    id: 'usr-3', 
    name: 'Marcus Aurelius', 
    email: 'stoic.gains@philosophy.org', 
    role: 'user', 
    is_banned: false, 
    avatar: getStandardAvatar('user'), 
    bio: 'Seeking mental focus and physiological durability.', 
    created_at: '2026-06-10', 
    mfa_enabled: false 
  },
  { 
    id: 'usr-4', 
    name: 'Diana Prince', 
    email: 'diana@amazon.com', 
    role: 'user', 
    is_banned: false, 
    avatar: getStandardAvatar('user'), 
    bio: 'Functional high-threshold stamina developer.', 
    created_at: '2026-06-18', 
    mfa_enabled: false 
  },
  { 
    id: 'usr-5', 
    name: 'Loki Laufeyson', 
    email: 'mischief.maker@asgard.gov', 
    role: 'user', 
    is_banned: true, 
    avatar: getStandardAvatar('user'), 
    bio: 'Flagged for duplicating high-intensity training records.', 
    created_at: '2026-06-20', 
    mfa_enabled: false 
  },
  { 
    id: 'usr-6', 
    name: 'Bruce Wayne', 
    email: 'bruce@waynecorp.com', 
    role: 'admin', 
    is_banned: false, 
    avatar: getStandardAvatar('admin'), 
    bio: 'Night shift cardiovascular training & stress remediation.', 
    created_at: '2026-06-22', 
    mfa_enabled: true 
  }
];

// Mock signups per day data
const SIGNUPS_TREND = [
  { day: '06-15', count: 4, active: 12 },
  { day: '06-16', count: 2, active: 14 },
  { day: '06-17', count: 6, active: 18 },
  { day: '06-18', count: 8, active: 22 },
  { day: '06-19', count: 5, active: 20 },
  { day: '06-20', count: 12, active: 31 },
  { day: '06-21', count: 9, active: 36 },
  { day: '06-22', count: 15, active: 45 },
  { day: '06-23', count: 11, active: 42 },
  { day: '06-24', count: 14, active: 50 },
  { day: '06-25', count: 18, active: 58 },
  { day: '06-26', count: 22, active: 65 },
  { day: '06-27', count: 20, active: 71 },
  { day: '06-28', count: 25, active: 82 },
];

export default function AdminPanel({ onRefreshAlertsHub }: AdminPanelProps) {
  // Theme Detection (light vs dark)
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains('light'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Tabs for sub-modules
  const [adminTab, setAdminTab] = useState<'users' | 'security' | 'auth_simulator' | 'analytics_hub' | 'supabase_db'>('users');

  // Supabase connection status states
  const [dbTestState, setDbTestState] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [dbTestMessage, setDbTestMessage] = useState<string>('');
  const [showAnonKey, setShowAnonKey] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);
  const [isLocalMode, setIsLocalMode] = useState<boolean>(isLocalModeActive());

  const testSupabaseConnection = async () => {
    setDbTestState('testing');
    setDbTestMessage('Initiating API handshake with Supabase REST Endpoint...');
    try {
      if (!supabase) {
        throw new Error('Supabase Client is not initialized. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
      }
      
      const startTime = performance.now();
      const { data, error, count } = await supabase
        .from('Users')
        .select('id', { count: 'exact', head: true });
        
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (error) {
        throw error;
      }

      setDbTestState('success');
      setDbTestMessage(`Successfully connected to Supabase! Latency: ${latency}ms. Connection status is active. Successfully verified the "Users" schema relation with ${count ?? 0} registered user rows.`);
      
      setLocalModeActive(false);
      setIsLocalMode(false);
    } catch (err: any) {
      console.error('Supabase connectivity test failed:', err);
      setDbTestState('failed');
      const errorMessage = err?.message || String(err);
      
      let friendlyHint = "Check that your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct and that you've run the table initialization script.";
      if (errorMessage.toLowerCase().includes('relation') || errorMessage.toLowerCase().includes('does not exist')) {
        friendlyHint = 'Database server responded, but the "Users" table is missing. Run the SQL initialization script below in your Supabase SQL Editor to generate the schema.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch') || errorMessage.toLowerCase().includes('invalid url')) {
        friendlyHint = 'Could not contact the database server. Ensure your Supabase project is active, your domain is correct, and network CORS policies allow requests from this domain.';
      } else if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('invalid api key') || errorMessage.toLowerCase().includes('jwt')) {
        friendlyHint = 'API Key handshake failed. Please check that your VITE_SUPABASE_ANON_KEY is a valid, unexpired Anonymous key.';
      }

      setDbTestMessage(`Error: ${errorMessage}. Hint: ${friendlyHint}`);
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_INIT_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  // Core States
  const [users, setUsers] = useState<UserProfileSimulated[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchRealUsers = async () => {
    setLoadingUsers(true);
    try {
      const allUsers = await supabaseService.getAllUsers();
      
      // Map only fetched real users from database/local storage
      const mapped: UserProfileSimulated[] = allUsers.map((u: any) => {
        const emailLower = (u.email || '').toLowerCase();
        const role: 'user' | 'moderator' | 'admin' = (emailLower === 'pranav456@gmail.com' || emailLower === 'pranavrajput021@gmail.com') ? 'admin' : (u.role || 'user');
        
        return {
          id: u.id,
          name: u.name || 'Anonymous Athlete',
          email: u.email || '',
          role,
          is_banned: !!u.is_banned,
          avatar: u.avatar || getStandardAvatar(role),
          bio: u.bio || 'No athletic biography provided.',
          created_at: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          mfa_enabled: !!u.mfa_enabled
        };
      });

      setUsers(mapped);
      localStorage.setItem('admin_users', JSON.stringify(mapped));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchRealUsers();
  }, []);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('admin_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), actor: 'System Auto-Daemon', targetUser: 'Loki Laufeyson', action: 'AUTO_BAN', details: 'Auto-banned for training metric velocity anomaly detection.', beforeValue: 'Active', afterValue: 'Banned' },
      { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), actor: 'alex@athlete.com', targetUser: 'Sarah Jenkins', action: 'PROMOTE_ROLE', details: 'Promoted from User to Moderator.', beforeValue: 'user', afterValue: 'moderator' },
      { id: 'log-3', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), actor: 'bruce@waynecorp.com', targetUser: 'Bruce Wayne', action: 'MFA_ENABLE', details: 'Multi-factor authentication registered and verified.', beforeValue: 'Disabled', afterValue: 'Enabled' }
    ];
  });

  // Six Non-Negotiables States
  const [rlsEnabled, setRlsEnabled] = useState(true);
  const [logActionsEnabled, setLogActionsEnabled] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [rateLimitThreshold, setRateLimitThreshold] = useState(60);
  const [undoWindowActive, setUndoWindowActive] = useState(true);
  const [backupActive, setBackupActive] = useState(true);
  const [lastBackupTime, setLastBackupTime] = useState<string>('Yesterday at 04:00 AM');

  // Search & Filters
  const [searchEmail, setSearchEmail] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDate, setSearchDate] = useState('');

  // Selected User for Editing Drawer
  const [selectedUser, setSelectedUser] = useState<UserProfileSimulated | null>(null);
  
  // Undo Queue State
  const [undoAction, setUndoAction] = useState<{
    timer: number;
    actionType: string;
    description: string;
    rollbackData: any;
    targetId: string;
  } | null>(null);

  // Countdown timer for Undo
  const [undoCountdown, setUndoCountdown] = useState(5);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Supabase Auth Simulator State
  const [simEmail, setSimEmail] = useState('');
  const [simName, setSimName] = useState('');
  const [simRole, setSimRole] = useState<'user' | 'moderator' | 'admin'>('user');
  const [simMethod, setSimMethod] = useState<'magic_link' | 'oauth_google' | 'oauth_github' | 'standard_signup'>('standard_signup');
  const [simLog, setSimLog] = useState<string[]>([]);

  // Three Clicks Wizard Tutorial
  const [wizardStep, setWizardStep] = useState<number>(0); // 0 = not started, 1 = find user, 2 = promote user, 3 = audit and alert
  const [wizardHighlight, setWizardHighlight] = useState<string | null>(null);

  // Live Simulated Slack Alert animation trigger
  const [slackAlert, setSlackAlert] = useState<{
    visible: boolean;
    role: string;
    userEmail: string;
  } | null>(null);

  // Save to LocalStorage helper
  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Insert custom Audit Log helper
  const addAuditLog = (action: string, targetUser: string, details: string, before?: string, after?: string) => {
    if (!logActionsEnabled) return;
    const newLog: AuditLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor: 'admin@athlete.com (Current Admin)',
      targetUser,
      action,
      details,
      beforeValue: before,
      afterValue: after
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 5-Second Undo Handler
  const triggerUndoableAction = (
    actionType: string, 
    description: string, 
    targetId: string, 
    applyChange: () => void, 
    rollbackChange: (data: any) => void,
    dataToSave: any
  ) => {
    if (!undoWindowActive) {
      applyChange();
      return;
    }

    // If there is an existing undo action, execute it first immediately
    if (undoAction) {
      clearTimeout(undoTimerRef.current!);
      setUndoAction(null);
    }

    // Apply the change visually immediately
    applyChange();

    // Store rollback information
    setUndoAction({
      timer: 5,
      actionType,
      description,
      rollbackData: dataToSave,
      targetId
    });
    setUndoCountdown(5);

    // Start 5-second countdown
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    
    let timeRemaining = 5;
    undoTimerRef.current = setInterval(() => {
      timeRemaining -= 1;
      setUndoCountdown(timeRemaining);
      if (timeRemaining <= 0) {
        clearInterval(undoTimerRef.current!);
        setUndoAction(null);
      }
    }, 1000);
  };

  // Undo triggers rollback
  const handleUndoRollback = async () => {
    if (!undoAction) return;
    clearInterval(undoTimerRef.current!);
    
    const { targetId, rollbackData, actionType } = undoAction;

    // Perform rollback on user list
    setUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        return { ...u, ...rollbackData };
      }
      return u;
    }));

    if (selectedUser?.id === targetId) {
      setSelectedUser(prev => prev ? { ...prev, ...rollbackData } : null);
    }

    try {
      if (actionType === 'UNBAN_USER' || actionType === 'BAN_USER') {
        await supabaseService.updateUserBanned(targetId, !!rollbackData.is_banned);
      } else if (actionType === 'ROLE_CHANGE') {
        await supabaseService.updateUserRole(targetId, rollbackData.role);
      } else if (actionType === 'EDIT_PROFILE') {
        await supabaseService.updateUserProfileByAdmin(targetId, rollbackData);
      }
    } catch (e) {
      console.error('Failed to revert DB changes during undo:', e);
    }

    // Record rollback in audit log
    addAuditLog('UNDO_ACTION', rollbackData.name || targetId, `Undid previous ${actionType} action. State restored.`);

    setUndoAction(null);
  };

  // Toggle Ban/Unban with Undo Support
  const handleToggleBan = (userProfile: UserProfileSimulated) => {
    const originalBannedState = userProfile.is_banned;
    
    const apply = async () => {
      setUsers(prev => prev.map(u => {
        if (u.id === userProfile.id) {
          return { ...u, is_banned: !originalBannedState };
        }
        return u;
      }));
      // Auto-update selected profile drawer if open
      if (selectedUser?.id === userProfile.id) {
        setSelectedUser(prev => prev ? { ...prev, is_banned: !originalBannedState } : null);
      }
      
      try {
        await supabaseService.updateUserBanned(userProfile.id, !originalBannedState);
      } catch (e) {
        console.error('Failed to apply ban toggle in DB:', e);
      }
      
      addAuditLog(
        originalBannedState ? 'UNBAN_USER' : 'BAN_USER', 
        userProfile.name, 
        originalBannedState ? 'Account unbanned, permissions restored.' : 'Suspended for terminal code violations.',
        originalBannedState ? 'Banned' : 'Active',
        originalBannedState ? 'Active' : 'Banned'
      );
    };

    const rollback = (prevData: any) => {
      // Handled globally in handleUndoRollback
    };

    triggerUndoableAction(
      userProfile.is_banned ? 'UNBAN_USER' : 'BAN_USER',
      `Banned state of ${userProfile.name} toggled`,
      userProfile.id,
      apply,
      rollback,
      { is_banned: originalBannedState }
    );
  };

  // Modify user role with confirmation modal & Undo support
  const handleRoleChange = (userProfile: UserProfileSimulated, newRole: 'user' | 'moderator' | 'admin') => {
    const originalRole = userProfile.role;
    if (originalRole === newRole) return;

    const action = () => {
      const apply = async () => {
        setUsers(prev => prev.map(u => {
          if (u.id === userProfile.id) {
            return { ...u, role: newRole };
          }
          return u;
        }));
        
        if (selectedUser?.id === userProfile.id) {
          setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
        }

        try {
          await supabaseService.updateUserRole(userProfile.id, newRole);
        } catch (e) {
          console.error('Failed to update role in DB:', e);
        }

        addAuditLog(
          'PROMOTE_ROLE', 
          userProfile.name, 
          `Role upgraded to ${newRole.toUpperCase()}.`,
          originalRole,
          newRole
        );

        // SLACK ALERT INTEGRATION DISPATCH (If upgraded to admin or moderator)
        if (newRole === 'admin') {
          setSlackAlert({
            visible: true,
            role: 'admin',
            userEmail: userProfile.email
          });
          setTimeout(() => setSlackAlert(null), 6000);
        }
      };

      const rollback = () => {};

      triggerUndoableAction(
        'ROLE_CHANGE',
        `Role of ${userProfile.name} modified to ${newRole}`,
        userProfile.id,
        apply,
        rollback,
        { role: originalRole }
      );
    };

    setConfirmModal({
      isOpen: true,
      title: 'Confirm Role Promotion',
      message: `Are you absolutely certain you want to change ${userProfile.name}'s role from ${originalRole.toUpperCase()} to ${newRole.toUpperCase()}? This modifies the active permissions scope immediately.`,
      onConfirm: () => {
        action();
        setConfirmModal(null);
        if (wizardStep === 2) {
          setWizardStep(3);
          setWizardHighlight('audit');
        }
      }
    });
  };

  // User Profile Data Editor
  const handleEditProfile = async (updatedProfile: Partial<UserProfileSimulated>) => {
    if (!selectedUser) return;
    const beforeState = { ...selectedUser };

    setUsers(prev => prev.map(u => {
      if (u.id === selectedUser.id) {
        return { ...u, ...updatedProfile };
      }
      return u;
    }));

    setSelectedUser(prev => prev ? { ...prev, ...updatedProfile } : null);

    try {
      await supabaseService.updateUserProfileByAdmin(selectedUser.id, updatedProfile);
    } catch (e) {
      console.error('Failed to edit profile in DB:', e);
    }

    addAuditLog('EDIT_PROFILE', selectedUser.name, 'Admin modified profile metadata.', beforeState.name, updatedProfile.name);
  };

  // Supabase Auth Simulator Process
  const triggerAuthSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simEmail) return;

    const emailInput = simEmail.trim().toLowerCase();
    const nameInput = simName.trim() || emailInput.split('@')[0];
    
    setSimLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Supabase Auth triggered: Method=${simMethod.toUpperCase()}`]);

    setTimeout(() => {
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === emailInput);
      
      if (existingUser) {
        setSimLog(prev => [
          ...prev, 
          `[AUTH SUCCESS] User ${emailInput} authenticated! Matching auth.uid (${existingUser.id}) resolved.`,
          `[RLS EVALUATION] Policy applied. SELECT allowed on row with owner_id = ${existingUser.id}`
        ]);
        addAuditLog('SIM_AUTH_SIGNIN', existingUser.name, `Simulated sign-in via ${simMethod.toUpperCase()}`);
      } else {
        // Create new account & link 1:1 profiles.id
        const newUid = 'usr-' + Math.random().toString(36).substring(2, 9);
        const newUser: UserProfileSimulated = {
          id: newUid,
          name: nameInput,
          email: emailInput,
          role: simRole,
          is_banned: false,
          avatar: getStandardAvatar(simRole),
          bio: 'Simulated user via Auth sandbox.',
          created_at: new Date().toISOString().split('T')[0],
          mfa_enabled: false
        };

        setUsers(prev => [...prev, newUser]);
        
        setSimLog(prev => [
          ...prev,
          `[AUTH REGISTERED] Created entry in auth.users (ID: ${newUid})`,
          `[TRIGGER FIRED] Trigger function "handle_new_user" executed on database.`,
          `[PROFILE MATCH] Inserted 1:1 linked row into public.profiles (profiles.id MATCHES auth.uid)`,
          `[RLS POLICY] Row protected. Row Owner ID matched ${newUid}.`
        ]);

        addAuditLog('SIM_AUTH_SIGNUP', nameInput, `Simulated signup via ${simMethod.toUpperCase()}`, 'None', 'Created Profile');
      }
      setSimEmail('');
      setSimName('');
    }, 1200);
  };

  // Wizard Tutorial Controls
  const startWizard = () => {
    setWizardStep(1);
    setAdminTab('users');
    setSearchEmail('');
    setFilterRole('all');
    setFilterStatus('all');
    setWizardHighlight('search');
  };

  const handleWizardFindClick = () => {
    setSearchEmail('stoic.gains');
    setWizardHighlight('row');
  };

  const handleWizardOpenRow = () => {
    const stoicUser = users.find(u => u.email.includes('stoic.gains'));
    if (stoicUser) {
      setSelectedUser(stoicUser);
      setWizardStep(2);
      setWizardHighlight('role-btn');
    }
  };

  // Backups Control Actions
  const triggerManualBackup = () => {
    setLastBackupTime('Processing Snapshot...');
    setTimeout(() => {
      const now = new Date();
      setLastBackupTime(`Completed manual capture at ${now.toLocaleTimeString()} today.`);
      addAuditLog('DB_SNAPSHOT_BACKUP', 'Entire Schema', 'Manual encrypted backup volume generated and cataloged.', 'v1.4.1', `v1.4.2-snapshot-${now.getDate()}`);
    }, 1500);
  };

  // Filters Calculation (Search & Selectors)
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesEmail = u.email.toLowerCase().includes(searchEmail.toLowerCase()) || 
                           u.name.toLowerCase().includes(searchEmail.toLowerCase());
      const matchesRole = filterRole === 'all' ? true : u.role === filterRole;
      const matchesStatus = filterStatus === 'all' ? true : 
                            filterStatus === 'banned' ? u.is_banned : !u.is_banned;
      const matchesDate = searchDate ? u.created_at === searchDate : true;
      return matchesEmail && matchesRole && matchesStatus && matchesDate;
    });
  }, [users, searchEmail, filterRole, filterStatus, searchDate]);

  return (
    <div id="admin-panel-layout" className={`space-y-6 text-left transition-colors duration-200 ${isLight ? 'text-slate-800' : 'text-neutral-100'}`}>
      
      {/* 1. SLACK WEBHOOK TRIGGER ALERT BANNER (REAL-TIME NOTIFICATION VISUALIZER) */}
      <AnimatePresence>
        {slackAlert && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-start gap-3 border-l-4 border-l-emerald-500 text-white font-sans"
          >
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
              <Slack className="w-5 h-5 animate-bounce" />
            </div>
            <div className="grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">SLACK WEBHOOK ALERT FIRED</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 font-bold font-mono text-neutral-400">role = Admin</span>
              </div>
              <p className="text-xs font-medium leading-normal text-slate-100">
                🚨 System Escalation Warning: Role upgraded to <strong className="text-emerald-300">ADMIN</strong> for <span className="font-mono underline text-slate-200">{slackAlert.userEmail}</span>. Slack payload dispatched.
              </p>
              <div className="mt-2 bg-black/40 rounded p-1.5 border border-zinc-800 text-[9px] font-mono text-zinc-400 select-all truncate">
                {"payload: { text: 'Elevated admin credentials dispatched to " + slackAlert.userEmail + "' }"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. UNDO ACTION NOTIFICATION ROW */}
      <AnimatePresence>
        {undoAction && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full border p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 transition-colors duration-200 ${
              isLight 
                ? 'bg-white border-emerald-200 text-slate-800 shadow-emerald-900/10' 
                : 'bg-[#0a0a0d] border-emerald-500/25 text-white shadow-black/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-emerald-500/20 flex items-center justify-center bg-emerald-500/10 relative text-emerald-400">
                <RotateCcw className="w-4 h-4 animate-spin-reverse" />
                <span className="absolute text-[8px] font-black font-mono">{undoCountdown}s</span>
              </div>
              <div>
                <p className="text-xs font-bold font-mono text-emerald-400">DESTRUCTIVE ACTION ENTRAPPED</p>
                <p className="text-[11px] text-neutral-400 line-clamp-1">{undoAction.description}</p>
              </div>
            </div>
            <button 
              onClick={handleUndoRollback}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
              Undo Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CONFIRM ACTION MODAL */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-md w-full border p-5 rounded-3xl shadow-2xl transition-colors duration-200 ${
                isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-850'
              }`}
            >
              <div className="flex gap-3 mb-4">
                <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0 border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-neutral-100'}`}>{confirmModal.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1.5">{confirmModal.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className={`px-4 py-2 border rounded-xl transition font-semibold cursor-pointer ${
                    isLight 
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                      : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl transition font-extrabold cursor-pointer"
                >
                  Apply & Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. ADMIN WIZARD WALKTHROUGH STEPPERS */}
      <div className={`p-4 border rounded-3xl relative overflow-hidden backdrop-blur-md transition-colors duration-200 ${
        isLight 
          ? 'bg-slate-50/50 border-emerald-100/50 text-slate-800 shadow-sm' 
          : 'bg-emerald-950/10 border-emerald-500/10'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/25">
              <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className={`text-sm font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-neutral-100'}`}>
                ADMIN TUTORIAL: THREE CLICKS WE CONQUER BEFORE SHIPPING
              </h3>
              <p className="text-xs text-neutral-400">Interactive live walkthrough representing necessary, non-negotiable admin tasks.</p>
            </div>
          </div>
          {wizardStep === 0 ? (
            <button 
              onClick={startWizard}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              Start Interactive Walkthrough
            </button>
          ) : (
            <button 
              onClick={() => setWizardStep(0)}
              className={`px-3 py-1.5 border rounded-xl text-xs font-mono transition cursor-pointer ${
                isLight ? 'border-slate-200 hover:bg-slate-100' : 'border-neutral-850 hover:bg-neutral-900'
              }`}
            >
              Reset Walkthrough
            </button>
          )}
        </div>

        {/* Wizard Steps Visualization */}
        {wizardStep > 0 && (
          <div className="mt-4 pt-4 border-t border-emerald-500/5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className={`p-3 rounded-2xl border transition duration-200 ${
              wizardStep === 1 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-neutral-950/20 border-neutral-900 opacity-60'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold font-mono">CLICK 1: FIND ACCOUNT</span>
                {wizardStep > 1 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold leading-snug">Locate and verify account details prior to altering any configurations.</p>
              {wizardStep === 1 && (
                <button 
                  onClick={handleWizardFindClick}
                  className="mt-2.5 w-full py-1.5 bg-emerald-500 text-black font-extrabold text-[10px] rounded-lg cursor-pointer"
                >
                  Find 'Marcus Stoic Gains' automatically
                </button>
              )}
            </div>

            {/* Step 2 */}
            <div className={`p-3 rounded-2xl border transition duration-200 ${
              wizardStep === 2 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-neutral-950/20 border-neutral-900 opacity-60'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold font-mono">CLICK 2: UPDATE ROLE</span>
                {wizardStep > 2 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold leading-snug">Promote user with custom popup modal verification before committing change.</p>
              {wizardStep === 2 && (
                <p className="text-[10px] text-neutral-400 mt-2 italic font-mono">Open Marcus's row in the list and click "MODERATOR"</p>
              )}
            </div>

            {/* Step 3 */}
            <div className={`p-3 rounded-2xl border transition duration-200 ${
              wizardStep === 3 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-neutral-950/20 border-neutral-900 opacity-60'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold font-mono">CLICK 3: VERIFY INTEGRATIONS</span>
              </div>
              <p className="text-xs font-semibold leading-snug">Confirm log is written & see high-level integrations fire Slack webhook warning.</p>
              {wizardStep === 3 && (
                <button 
                  onClick={() => {
                    setAdminTab('security');
                    setWizardStep(0);
                    setWizardHighlight(null);
                  }}
                  className="mt-2.5 w-full py-1.5 bg-emerald-500 text-black font-extrabold text-[10px] rounded-lg cursor-pointer"
                >
                  Verify Audit Log & Slack Webhook!
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. NAVIGATION MODULES SWITCHER */}
      <div className="flex flex-wrap gap-1 bg-[#09090b]/40 p-1 rounded-2xl border border-neutral-850 max-w-2xl text-xs font-mono">
        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-250 cursor-pointer ${
            adminTab === 'users' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Users className="w-4 h-4" /> User Base & Roles
        </button>
        <button
          onClick={() => setAdminTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-250 cursor-pointer ${
            adminTab === 'security' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Security & Logs
        </button>
        <button
          onClick={() => setAdminTab('auth_simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-250 cursor-pointer ${
            adminTab === 'auth_simulator' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Key className="w-4 h-4" /> Auth Sandbox
        </button>
        <button
          onClick={() => setAdminTab('analytics_hub')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-250 cursor-pointer ${
            adminTab === 'analytics_hub' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Activity className="w-4 h-4" /> Concurrency & Trends
        </button>
        <button
          onClick={() => setAdminTab('supabase_db')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-250 cursor-pointer ${
            adminTab === 'supabase_db' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Database className="w-4 h-4" /> Supabase Connection
        </button>
      </div>

      {/* 6. CURRENT MODULE SCREEN */}
      {adminTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* USER BASE TABLE & FILTERS */}
          <div className={`lg:col-span-2 space-y-4 p-5 rounded-3xl border transition-colors duration-200 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-emerald-400" /> ATHLETE PROFILE MATRIX ({filteredUsers.length})
              </h3>
              
              {/* Reset filter utility if active */}
              {(searchEmail || filterRole !== 'all' || filterStatus !== 'all' || searchDate) && (
                <button 
                  onClick={() => {
                    setSearchEmail('');
                    setFilterRole('all');
                    setFilterStatus('all');
                    setSearchDate('');
                  }}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>

            {/* Matrix Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
              
              {/* Search Email/Name */}
              <div className={`relative flex items-center border rounded-xl px-2.5 transition-all ${
                wizardHighlight === 'search' ? 'border-2 border-emerald-400 shadow-md shadow-emerald-400/10' : 'border-neutral-800'
              } ${isLight ? 'bg-slate-50' : 'bg-[#060608]'}`}>
                <Search className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                <input 
                  type="text"
                  placeholder="Filter by email or name..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="grow bg-transparent border-none py-2 text-xs focus:outline-none placeholder-neutral-600 font-sans"
                />
                {searchEmail && (
                  <button onClick={() => setSearchEmail('')} className="text-neutral-500 hover:text-white shrink-0 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Role Filtering */}
              <div className={`flex items-center border rounded-xl px-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060608] border-neutral-800'}`}>
                <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono mr-1">Role:</span>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="grow bg-transparent py-2 border-none text-xs focus:outline-none select-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status Filtering */}
              <div className={`flex items-center border rounded-xl px-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060608] border-neutral-800'}`}>
                <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono mr-1">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="grow bg-transparent py-2 border-none text-xs focus:outline-none select-none cursor-pointer"
                >
                  <option value="all">All Profiles</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              {/* Date Filtering */}
              <div className={`flex items-center border rounded-xl px-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#060608] border-neutral-800'}`}>
                <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono mr-1">Date:</span>
                <input 
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="grow bg-transparent py-2 border-none text-xs focus:outline-none select-none cursor-pointer font-mono"
                />
              </div>

            </div>

            {/* Matrix Data Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    <th className="py-3 px-2 font-mono">Athlete Identity</th>
                    <th className="py-3 px-2 font-mono">System Role</th>
                    <th className="py-3 px-2 font-mono">Account Status</th>
                    <th className="py-3 px-2 font-mono text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/65 text-xs">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-neutral-400 font-mono">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                          <span>SYNCHRONIZING SECURE SUPABASE PROFILE REGISTRY...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-500 font-mono">
                        No athlete accounts found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(userProfile => {
                      const isSelected = selectedUser?.id === userProfile.id;
                      const isWizardTarget = wizardStep === 1 && userProfile.email.includes('stoic.gains');
                      
                      return (
                        <tr 
                          key={userProfile.id}
                          className={`hover:bg-neutral-900/20 transition group ${
                            isSelected ? 'bg-emerald-500/5' : ''
                          } ${
                            isWizardTarget && wizardHighlight === 'row' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black animate-pulse' : ''
                          }`}
                        >
                          <td className="py-3 px-2 flex items-center gap-2.5">
                            <img 
                              src={userProfile.avatar} 
                              alt={userProfile.name}
                              className="w-8.5 h-8.5 rounded-full border border-neutral-800 shrink-0 object-cover"
                            />
                            <div className="min-w-0">
                              <p className={`font-semibold truncate leading-tight ${isLight ? 'text-slate-800' : 'text-neutral-100'}`}>{userProfile.name}</p>
                              <p className="text-[10.5px] text-neutral-500 font-mono truncate">{userProfile.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border uppercase ${
                              userProfile.role === 'admin' 
                                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                                : userProfile.role === 'moderator'
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                              <Shield className="w-3 h-3" /> {userProfile.role}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-mono">
                            {userProfile.is_banned ? (
                              <span className="text-red-400 bg-red-400/10 border border-red-500/20 px-2 py-0.5 rounded font-bold text-[10px]">BANNED</span>
                            ) : (
                              <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold text-[10px]">ACTIVE</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex justify-end gap-1.5">
                              {isWizardTarget && wizardHighlight === 'row' ? (
                                <button
                                  onClick={handleWizardOpenRow}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-extrabold rounded-lg flex items-center gap-1 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                                >
                                  Open Account <ChevronRight className="w-3 h-3 text-black" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setSelectedUser(userProfile)}
                                  className={`px-3 py-1 border rounded-lg text-[10.5px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                                    isLight 
                                      ? 'border-slate-200 text-slate-700 hover:bg-slate-50' 
                                      : 'border-neutral-850 text-neutral-300 hover:text-white hover:bg-neutral-900'
                                  }`}
                                >
                                  Manage <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHOSEN ATHLETE CONSOLE / SIDE PANEL */}
          <div className="space-y-4">
            {selectedUser ? (
              <div className={`p-5 rounded-3xl border text-xs text-left transition-colors duration-200 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
              }`}>
                <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                    <span className="font-extrabold uppercase font-mono tracking-wider">ATHLETE DRAWER</span>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="p-1 hover:bg-neutral-900/50 rounded-lg text-neutral-500 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Identity */}
                <div className="flex flex-col items-center text-center py-4 border-b border-neutral-900/40">
                  <div className="relative group cursor-pointer mb-2">
                    <img 
                      src={selectedUser.avatar || getStandardAvatar(selectedUser.role)} 
                      alt={selectedUser.name}
                      className="w-16 h-16 rounded-full border-2 border-emerald-500/20 group-hover:border-emerald-400 shadow-lg object-cover transition"
                    />
                    <label className="absolute inset-0 rounded-full bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-[9px] font-mono font-bold text-emerald-400">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span>UPLOAD</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.result) {
                                handleEditProfile({ avatar: reader.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <label className="text-[10px] font-mono bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-emerald-400 px-2.5 py-1 rounded-md border border-neutral-800 cursor-pointer flex items-center gap-1.5 transition">
                      <Upload className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>Upload File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.result) {
                                handleEditProfile({ avatar: reader.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => handleEditProfile({ avatar: getStandardAvatar(selectedUser.role) })}
                      className="text-[10px] font-mono bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-rose-400 px-2.5 py-1 rounded-md border border-neutral-800 transition cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>

                  <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-neutral-100'}`}>{selectedUser.name}</h4>
                  <p className="text-[10.5px] text-neutral-500 font-mono mb-1">{selectedUser.email}</p>
                  <p className="text-[10px] text-neutral-400 italic max-w-xs leading-relaxed">
                    "{selectedUser.bio || 'No status message registered.'}"
                  </p>
                </div>

                {/* Edit Profile metadata form */}
                <div className="space-y-3 pt-4">
                  <div>
                    <label className="text-neutral-500 font-bold font-mono text-[9px] uppercase">Alter Display Name</label>
                    <input 
                      type="text" 
                      value={selectedUser.name}
                      onChange={(e) => handleEditProfile({ name: e.target.value })}
                      className="w-full mt-1 bg-black/40 border border-neutral-850 focus:border-emerald-500 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-500 font-bold font-mono text-[9px] uppercase">Alter Bio Message</label>
                    <textarea 
                      value={selectedUser.bio}
                      onChange={(e) => handleEditProfile({ bio: e.target.value })}
                      className="w-full mt-1 min-h-12 bg-black/40 border border-neutral-850 focus:border-emerald-500 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                    />
                  </div>

                  {/* Promotion Panel */}
                  <div className={`p-3 rounded-2xl border ${
                    wizardStep === 2 && wizardHighlight === 'role-btn' ? 'border-2 border-emerald-400 shadow-md shadow-emerald-400/10' : 'border-neutral-850 bg-black/10'
                  }`}>
                    <label className="text-neutral-400 font-bold font-mono text-[9.5px] uppercase block mb-2">
                      Access Role Allocation
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] font-bold">
                      <button
                        onClick={() => handleRoleChange(selectedUser, 'user')}
                        className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                          selectedUser.role === 'user' 
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                            : 'border-neutral-850 text-neutral-400 hover:bg-neutral-900'
                        }`}
                      >
                        USER
                      </button>
                      <button
                        onClick={() => handleRoleChange(selectedUser, 'moderator')}
                        className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                          selectedUser.role === 'moderator' 
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                            : 'border-neutral-850 text-neutral-400 hover:bg-neutral-900'
                        }`}
                      >
                        MODERATOR
                      </button>
                      <button
                        onClick={() => handleRoleChange(selectedUser, 'admin')}
                        className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                          selectedUser.role === 'admin' 
                            ? 'bg-red-500/10 border-red-500 text-red-400' 
                            : 'border-neutral-850 text-neutral-400 hover:bg-neutral-900'
                        }`}
                      >
                        ADMIN
                      </button>
                    </div>
                  </div>

                  {/* Actions & Ban State */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleBan(selectedUser)}
                      className={`w-full py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer ${
                        selectedUser.is_banned 
                          ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                          : 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25'
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      {selectedUser.is_banned ? 'Unban Account Status' : 'Ban Account status'}
                    </button>
                  </div>
                </div>

                {/* Audit Context */}
                <div className="mt-4 pt-4 border-t border-neutral-900/60 flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>ID: {selectedUser.id}</span>
                  <span>Joined: {selectedUser.created_at}</span>
                </div>
              </div>
            ) : (
              <div className={`p-8 rounded-3xl border border-dashed text-center text-neutral-500 font-mono transition-colors duration-200 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950/20 border-neutral-850'
              }`}>
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-neutral-600 animate-pulse" />
                <p className="text-xs">Select an athlete row in the matrix to configure metadata, alter scopes, or apply strict bans.</p>
              </div>
            )}

            {/* QUICK BRANDING STATS */}
            <div className={`p-4 rounded-3xl border text-xs space-y-3 transition-colors duration-200 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950/40 border-neutral-850'
            }`}>
              <h4 className="font-extrabold uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1">
                <Database className="w-4 h-4" /> DB SCOPING SCHEMA
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Database utilizes <strong>Supabase Auth</strong> integration linked 1:1 using primary key mappings:
              </p>
              <div className="bg-black/30 rounded-xl p-2.5 border border-neutral-900 text-[10.5px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">auth.users.id</span>
                  <span className="text-emerald-400">UUID (Primary Key)</span>
                </div>
                <div className="text-center text-neutral-600">║ (Linked 1:1)</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">public.profiles.id</span>
                  <span className="text-emerald-400">UUID (Foreign key references auth.users)</span>
                </div>
              </div>
              <div className="text-[10px] text-neutral-500 italic">
                Each authenticated session maps precisely to one public profiles profile record.
              </div>
            </div>

          </div>

        </div>
      )}

      {adminTab === 'security' && (
        <div className="space-y-6">
          
          {/* SIX NON-NEGOTIABLES CONFIG ROOM */}
          <div className={`p-5 rounded-3xl border transition-colors duration-200 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-1.5 border-b border-neutral-900 pb-3.5 mb-4">
              <Sliders className="w-4.5 h-4.5 text-emerald-400" /> SIX PRODUCTION NON-NEGOTIABLES CHECKLIST
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Checklist 1: RLS */}
              <div className="p-4 bg-black/20 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">1. ENABLE TABLE RLS</span>
                    <input 
                      type="checkbox" 
                      checked={rlsEnabled}
                      onChange={(e) => {
                        setRlsEnabled(e.target.checked);
                        addAuditLog('TOGGLE_CONFIG', 'Security config', `Row Level Security (RLS) ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`);
                      }}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-800 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs font-semibold leading-normal">
                    Turn Row Level Security ON. Restricts data scoping so anonymous tokens cannot read adjacent database columns.
                  </p>
                </div>
                {rlsEnabled && (
                  <div className="mt-3 bg-black/40 rounded-lg p-2 border border-zinc-900 text-[9px] font-mono text-zinc-400 max-h-24 overflow-y-auto">
                    {"-- Active SQL Policy:\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \"Users read own row\" ON public.profiles FOR SELECT USING (auth.uid() = id);"}
                  </div>
                )}
              </div>

              {/* Checklist 2: Action Log */}
              <div className="p-4 bg-black/20 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">2. LOG ACTIONS MANDATE</span>
                    <input 
                      type="checkbox" 
                      checked={logActionsEnabled}
                      onChange={(e) => {
                        setLogActionsEnabled(e.target.checked);
                        // Trigger log event directly
                        const prevVal = logActionsEnabled;
                        setTimeout(() => {
                          if (e.target.checked) {
                            addAuditLog('TOGGLE_CONFIG', 'Audit Configuration', 'Audit Action log capture enabled.', 'Disabled', 'Enabled');
                          }
                        }, 200);
                      }}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-800 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs font-semibold leading-normal">
                    Mandatory audit logging. Captures every role alteration, block state, and delete transaction with timestamp tracking.
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-neutral-500 font-mono flex justify-between">
                  <span>Status: {logActionsEnabled ? '🟢 RECORDING' : '🔴 MUTED'}</span>
                  <span>Logs Saved: {auditLogs.length}</span>
                </div>
              </div>

              {/* Checklist 3: MFA */}
              <div className="p-4 bg-black/20 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">3. ADMIN MFA ASSURANCE</span>
                    <input 
                      type="checkbox" 
                      checked={mfaEnforced}
                      onChange={(e) => {
                        setMfaEnforced(e.target.checked);
                        addAuditLog('TOGGLE_CONFIG', 'MFA Configuration', `Multi-Factor Auth (MFA) enforcement toggled to ${e.target.checked ? 'ENFORCED' : 'OPTIONAL'}.`);
                      }}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-800 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs font-semibold leading-normal">
                    Enforce mandatory Time-based One-Time Passwords (TOTP) for any session targeting role='admin'. No developer exemptions.
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-neutral-500 flex justify-between font-mono">
                  <span>Enforcement: {mfaEnforced ? 'STRICT' : 'OPTIONAL'}</span>
                  <span>Admins Verified: 2/2</span>
                </div>
              </div>

              {/* Checklist 4: Rate-limiting */}
              <div className="p-4 bg-black/20 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">4. ENDPOINT RATE-LIMIT</span>
                    <input 
                      type="checkbox" 
                      checked={rateLimitEnabled}
                      onChange={(e) => {
                        setRateLimitEnabled(e.target.checked);
                        addAuditLog('TOGGLE_CONFIG', 'API Rate Limiting', `Rate limits ${e.target.checked ? 'ACTIVATED' : 'BYPASSED'}.`);
                      }}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-800 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs font-semibold leading-normal">
                    Throttles admin API gateways by IP ranges to prevent malicious credential harvesting or run-away server loops.
                  </p>
                </div>
                {rateLimitEnabled && (
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">Threshold:</span>
                    <select 
                      value={rateLimitThreshold} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRateLimitThreshold(val);
                        addAuditLog('UPDATE_CONFIG', 'API Rate limit', `Rate limit changed to ${val} req/min.`);
                      }}
                      className="bg-black border border-neutral-800 text-[10.5px] rounded py-0.5 px-1.5 focus:outline-none"
                    >
                      <option value={30}>30 req / min</option>
                      <option value={60}>60 req / min</option>
                      <option value={120}>120 req / min</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Checklist 5: confirmations + Undo */}
              <div className="p-4 bg-black/20 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">5. UNDO SAFETY CAPTURE</span>
                    <input 
                      type="checkbox" 
                      checked={undoWindowActive}
                      onChange={(e) => {
                        setUndoWindowActive(e.target.checked);
                        addAuditLog('TOGGLE_CONFIG', 'UI Safeguards', `5-Second Undo protective window toggled to ${e.target.checked ? 'ACTIVE' : 'INACTIVE'}.`);
                      }}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-800 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs font-semibold leading-normal">
                    Constructs an immediate 5-second roll-back stage during critical ban or promotion actions, protecting user records.
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-neutral-500 font-mono flex justify-between">
                  <span>Buffer window: 5.0s</span>
                  <span>Undo State: {undoWindowActive ? 'ACTIVE' : 'BYPASSED'}</span>
                </div>
              </div>

              {/* Checklist 6: Snapshots Backups */}
              <div className="p-4 bg-black/20 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">6. COMPRESSION SNAPSHOTS</span>
                    <input 
                      type="checkbox" 
                      checked={backupActive}
                      onChange={(e) => {
                        setBackupActive(e.target.checked);
                        addAuditLog('TOGGLE_CONFIG', 'Database backup configuration', `Daily backups auto-capture scheduled to ${e.target.checked ? 'ACTIVE' : 'PAUSED'}.`);
                      }}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-800 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs font-semibold leading-normal">
                    Automated weekly snapshot dumps with verified restoration recovery paths tested securely inside sandboxed clones.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-1">
                  <span className="text-[9px] text-neutral-500 font-mono truncate max-w-[120px]">{lastBackupTime}</span>
                  <button 
                    onClick={triggerManualBackup}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-[9.5px] font-bold rounded text-neutral-300 transition cursor-pointer"
                  >
                    Snapshot Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* AUDIT LOG EVENTS VIEW */}
          <div className={`p-5 rounded-3xl border transition-colors duration-200 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-900 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-sm font-extrabold font-mono tracking-wider">LIVE ADMINISTRATIVE AUDIT EVENT STREAM</h3>
              </div>
              <button
                onClick={() => {
                  setAuditLogs([]);
                  localStorage.removeItem('admin_audit_logs');
                }}
                className="text-[10px] text-red-400 hover:underline cursor-pointer flex items-center gap-1 font-mono font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Audit Logs
              </button>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 text-[9.5px] uppercase font-bold text-neutral-500 font-mono">
                    <th className="py-2.5 px-2">Timestamp</th>
                    <th className="py-2.5 px-2">Actor UID</th>
                    <th className="py-2.5 px-2">Event Scope</th>
                    <th className="py-2.5 px-2">Description / Transaction details</th>
                    <th className="py-2.5 px-2 text-right">State Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/40 font-mono text-[11px] text-neutral-300">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500">
                        No auditable actions captured. Make role upgrades or toggle bans to log transactions.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-neutral-900/10 transition">
                        <td className="py-2.5 px-2 text-neutral-500 text-[10px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})
                        </td>
                        <td className="py-2.5 px-2 text-emerald-400 truncate max-w-[120px] font-semibold">
                          {log.actor}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="bg-neutral-900 px-1.5 py-0.5 rounded text-[10px] font-bold border border-neutral-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-neutral-400 leading-normal max-w-sm">
                          {log.details}
                        </td>
                        <td className="py-2.5 px-2 text-right whitespace-nowrap">
                          {log.beforeValue && log.afterValue ? (
                            <span className="text-[10px]">
                              <span className="text-red-400">{log.beforeValue}</span>
                              <span className="text-neutral-500"> → </span>
                              <span className="text-emerald-400">{log.afterValue}</span>
                            </span>
                          ) : (
                            <span className="text-neutral-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {adminTab === 'auth_simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CONTROL SUITE - SUPABASE AUTH INJECTOR */}
          <div className={`p-5 rounded-3xl border transition-colors duration-200 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-1.5 border-b border-neutral-900 pb-3.5 mb-4 font-mono tracking-wider">
              <Key className="text-emerald-400 w-4.5 h-4.5" /> SUPABASE AUTH SANDBOX INJECTOR
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Construct mock signups and logins mimicking native Supabase processes. Observe how `auth.users` links seamlessly 1:1 with `public.profiles`.
            </p>

            <form onSubmit={triggerAuthSimulation} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold font-mono text-[9px] uppercase">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tony Stark"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full bg-[#030303] border border-neutral-850 focus:border-emerald-500 rounded-xl py-2 px-3 text-white placeholder-neutral-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold font-mono text-[9px] uppercase">Email Identity *</label>
                  <input 
                    type="email" 
                    placeholder="tony@stark.com"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    className="w-full bg-[#030303] border border-neutral-850 focus:border-emerald-500 rounded-xl py-2 px-3 text-white placeholder-neutral-700 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold font-mono text-[9px] uppercase">Pre-allocate Role</label>
                  <select 
                    value={simRole} 
                    onChange={(e) => setSimRole(e.target.value as any)}
                    className="w-full bg-[#030303] border border-neutral-850 focus:border-emerald-500 rounded-xl py-2 px-3 text-white focus:outline-none"
                  >
                    <option value="user">USER</option>
                    <option value="moderator">MODERATOR</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold font-mono text-[9px] uppercase">Auth Access Method</label>
                  <select 
                    value={simMethod} 
                    onChange={(e) => setSimMethod(e.target.value as any)}
                    className="w-full bg-[#030303] border border-neutral-850 focus:border-emerald-500 rounded-xl py-2 px-3 text-white focus:outline-none"
                  >
                    <option value="standard_signup">Standard Email + PW</option>
                    <option value="magic_link">Magic OTP Link Email</option>
                    <option value="oauth_google">OAuth 2.0 (Google)</option>
                    <option value="oauth_github">OAuth 2.0 (GitHub)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                Dispatch Simulated Auth Call
              </button>

            </form>
          </div>

          {/* SIMULATION TRACE LOG CONSOLE */}
          <div className="p-5 bg-[#030304] border border-neutral-850 rounded-3xl flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3.5 mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> DATABASE AUTH TRIGGERS LOGSTREAM
                </span>
                <button 
                  onClick={() => setSimLog([])}
                  className="text-[9.5px] text-neutral-500 hover:text-neutral-300 font-mono"
                >
                  Clear Console
                </button>
              </div>

              {/* Log stream viewport */}
              <div className="space-y-2 max-h-56 overflow-y-auto text-[11px] font-mono pr-1 text-left">
                {simLog.length === 0 ? (
                  <p className="text-neutral-600 italic">Auth pipeline listening... Trigger an Auth call to verify mapping events and RLS checks.</p>
                ) : (
                  simLog.map((log, i) => {
                    let col = 'text-neutral-450';
                    if (log.includes('[AUTH SUCCESS]') || log.includes('[PROFILE MATCH]')) col = 'text-emerald-400 font-bold';
                    if (log.includes('[TRIGGER FIRED]')) col = 'text-purple-400';
                    if (log.includes('[RLS')) col = 'text-blue-400';
                    return (
                      <p key={i} className={`leading-normal border-l border-zinc-800 pl-2 ${col}`}>
                        {log}
                      </p>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-900/65 text-[10.5px] leading-relaxed text-neutral-500 font-mono">
              <strong className="text-neutral-400 uppercase font-bold block mb-1">Row Isolation Logic:</strong>
              When RLS is active on public.profiles, each authenticated user's authorization header evaluates true only when:
              <span className="text-blue-400 font-bold block mt-1">"auth.uid() = profiles.id"</span>
            </div>
          </div>

        </div>
      )}

      {adminTab === 'analytics_hub' && (
        <div className="space-y-6">
          
          {/* STATS CONCURRENCY & DAILY SIGNUPS CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Area Chart: Daily Signup Velocity */}
            <div className={`lg:col-span-2 p-5 rounded-3xl border text-left transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
            }`}>
              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold text-emerald-400">METRICS ENGINE</span>
                <h3 className="text-sm font-extrabold uppercase tracking-tight">Daily Athlete Signups trend</h3>
              </div>
              <div className="h-60 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SIGNUPS_TREND} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.25} />
                    <XAxis dataKey="day" stroke="#737373" />
                    <YAxis stroke="#737373" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0a0a0d', 
                        borderColor: '#262626', 
                        borderRadius: '12px',
                        color: '#f5f5f5' 
                      }} 
                    />
                    <Area type="monotone" dataKey="count" name="Signups" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSignups)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: User Concurrency & Session Volumes */}
            <div className={`p-5 rounded-3xl border text-left transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
            }`}>
              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold text-emerald-400">CONCURRENCY ANALYZER</span>
                <h3 className="text-sm font-extrabold uppercase tracking-tight">Active sessions (24h)</h3>
              </div>
              <div className="h-60 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SIGNUPS_TREND.slice(-7)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.25} />
                    <XAxis dataKey="day" stroke="#737373" />
                    <YAxis stroke="#737373" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0a0a0d', 
                        borderColor: '#262626', 
                        borderRadius: '12px',
                        color: '#f5f5f5' 
                      }} 
                    />
                    <Bar dataKey="active" name="Active Sessions" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* ROLES & PERMISSIONS POLICIES SCHEMATIC TABLE */}
          <div className={`p-5 rounded-3xl border text-left transition-colors duration-200 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-1.5 border-b border-neutral-900 pb-3.5 mb-4">
              <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-400" /> SYSTEM LEVEL ACCESS CONTROL (RBAC MATRIX)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider">
                    <th className="py-2.5 px-3">Role Designation</th>
                    <th className="py-2.5 px-3">Read own data</th>
                    <th className="py-2.5 px-3">Write workouts</th>
                    <th className="py-2.5 px-3">Moderate social boards</th>
                    <th className="py-2.5 px-3">Alter metadata / Ban</th>
                    <th className="py-2.5 px-3 text-right">MFA Enforced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/40 text-neutral-300 leading-relaxed font-mono">
                  
                  {/* ADMIN */}
                  <tr>
                    <td className="py-3 px-3 font-bold text-red-400">ADMIN</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full scope</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full scope</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full scope</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full scope</td>
                    <td className="py-3 px-3 text-right text-red-400 font-bold">STRICT TOTP</td>
                  </tr>

                  {/* MODERATOR */}
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-400">MODERATOR</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full scope</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full scope</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">✓ Moderate posts</td>
                    <td className="py-3 px-3 text-neutral-600">✗ No access</td>
                    <td className="py-3 px-3 text-right text-neutral-500">OPTIONAL</td>
                  </tr>

                  {/* USER */}
                  <tr>
                    <td className="py-3 px-3 font-bold text-emerald-400">USER</td>
                    <td className="py-3 px-3 text-emerald-450 font-bold">✓ Own row select</td>
                    <td className="py-3 px-3 text-emerald-450 font-bold">✓ Own row insert</td>
                    <td className="py-3 px-3 text-neutral-600">✗ No access</td>
                    <td className="py-3 px-3 text-neutral-600">✗ No access</td>
                    <td className="py-3 px-3 text-right text-neutral-500">OPTIONAL</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {adminTab === 'supabase_db' && (
        <div className="space-y-6 animate-fadeIn">
          {/* CORE CONNECTION GATEWAY */}
          <div className={`p-6 rounded-3xl border transition-colors duration-200 text-left ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0d] border-neutral-850'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-5 mb-5">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Supabase Integration Engine</span>
                <h3 className="text-lg font-black tracking-tight uppercase">Database Connection & Control Terminal</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={testSupabaseConnection}
                  disabled={dbTestState === 'testing'}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-450 active:scale-95 text-black px-4 py-2 rounded-xl text-xs font-bold font-mono transition duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dbTestState === 'testing' ? 'animate-spin' : ''}`} />
                  Test Live Handshake
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Connectivity & Active Engine */}
              <div className="lg:col-span-1 space-y-4">
                
                {/* Engine Status Card */}
                <div className="p-5 bg-black/40 border border-neutral-850 rounded-2xl">
                  <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase mb-3 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Active Database Mode
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-semibold">Current Engine:</span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isLocalMode 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isLocalMode ? 'LOCAL SANDBOXED FALLBACK' : 'LIVE SUPABASE DATABASE'}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {isLocalMode 
                        ? 'The system has failed to reach your custom Supabase server (or no keys are set), meaning all records are stored in browser localStorage.' 
                        : 'System is successfully linked directly to the live cloud database. Changes persist instantly in your cloud project.'
                      }
                    </p>

                    <div className="pt-2 border-t border-neutral-900/60 flex gap-2">
                      <button
                        onClick={() => {
                          const target = !isLocalMode;
                          setLocalModeActive(target);
                          setIsLocalMode(target);
                        }}
                        className="w-full text-center py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-white font-mono text-[10.5px] border border-neutral-800 transition cursor-pointer"
                      >
                        Force Switch to {isLocalMode ? 'Live Engine' : 'Local Sandbox'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Configuration Specs */}
                <div className="p-5 bg-black/40 border border-neutral-850 rounded-2xl">
                  <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase mb-3">
                    Handshake Environment
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-neutral-500 block text-[10px] uppercase font-mono">Supabase URL endpoint</span>
                      <input 
                        type="text" 
                        readOnly 
                        value={getSupabaseUrlValue()} 
                        className="w-full bg-black/50 border border-neutral-900 text-neutral-300 rounded px-2.5 py-1.5 text-[11px] font-mono select-all focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 pt-2">
                      <span className="text-neutral-500 block text-[10px] uppercase font-mono">Integration Status</span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                        {isUsingCustomKeys() ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span>Custom Private Project Linked</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                            <span>Using Shared Demo Fallback</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Middle & Right Column: Diagnostics logs & SQL schema assist */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Diagnostics Log */}
                <div className="p-5 bg-black/40 border border-neutral-850 rounded-2xl">
                  <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase mb-2 flex items-center justify-between">
                    <span>Handshake Diagnostics terminal</span>
                    {dbTestState !== 'idle' && (
                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        dbTestState === 'testing' ? 'text-blue-400 animate-pulse' :
                        dbTestState === 'success' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        [{dbTestState}]
                      </span>
                    )}
                  </h4>
                  <div className="bg-black/50 border border-neutral-900 rounded-xl p-3 font-mono text-[11px] text-zinc-300 min-h-24 max-h-40 overflow-y-auto space-y-1 select-all">
                    {dbTestState === 'idle' ? (
                      <p className="text-neutral-500 italic">No handshake test run yet. Click "Test Live Handshake" to query your remote server.</p>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {dbTestMessage}
                      </div>
                    )}
                  </div>
                </div>

                {/* Integration Guide */}
                <div className="p-5 bg-black/40 border border-neutral-850 rounded-2xl space-y-3">
                  <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase">
                    Setup instructions: Linking your own database
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Follow these simple steps to hook your custom Supabase database to this terminal:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-neutral-400 space-y-2 leading-relaxed">
                    <li>Create a new free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Copy your <strong className="text-neutral-300">Project URL</strong> and <strong className="text-neutral-300 font-mono">anon</strong> public key from Project Settings → API.</li>
                    <li>Open <strong className="text-neutral-300">AI Studio Settings</strong> (gear icon) or the Secrets manager, and add these environment variables:
                      <div className="mt-1.5 ml-4 bg-black/50 border border-neutral-900 rounded p-2 text-[10.5px] font-mono text-zinc-300 space-y-1">
                        <div>VITE_SUPABASE_URL = <span className="text-emerald-400">your_project_url</span></div>
                        <div>VITE_SUPABASE_ANON_KEY = <span className="text-emerald-400">your_anon_key</span></div>
                      </div>
                    </li>
                    <li>Go to your Supabase project's <strong className="text-neutral-300">SQL Editor</strong>, paste the initialization script below, and run it to create your database tables instantly.</li>
                  </ol>
                </div>

              </div>

            </div>

            {/* SQL Table Schema Assist */}
            <div className="mt-6 border-t border-neutral-900 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase font-mono text-emerald-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> SQL Schema initialization script
                  </h4>
                  <p className="text-[11px] text-neutral-500">Run this SQL code in your Supabase SQL Editor to provision all table relationships with 100% type compatibility.</p>
                </div>
                <button
                  onClick={copySqlToClipboard}
                  className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-3 py-1.5 rounded-xl text-[10.5px] font-mono border border-neutral-800 transition active:scale-95 cursor-pointer"
                >
                  {sqlCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      Copy SQL script
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/60 rounded-xl border border-neutral-900 p-4 font-mono text-[10.5px] text-zinc-400 max-h-96 overflow-y-auto leading-relaxed select-all">
                <pre>{SUPABASE_INIT_SQL}</pre>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
