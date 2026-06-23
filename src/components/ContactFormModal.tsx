/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabaseService } from '../supabaseService';
import { UserProfile } from '../types';
import { Mail, MessageSquare, Send, CheckCircle, Copy, Check, Terminal, Info, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactFormModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ user, isOpen, onClose }: ContactFormModalProps) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);

  const sqlCode = `-- Create contacts table in Supabase
create table public.contacts (
  id text not null primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.contacts enable row level security;

-- Create policy for public insert access
create policy "Allow public insert access" 
  on public.contacts 
  for insert 
  with check (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = user.name || name;
    const finalEmail = user.email || email;
    if (!finalName.trim() || !finalEmail.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg('Please supply coordinates for all required inputs.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await supabaseService.submitContactForm({
        name: finalName.trim(),
        email: finalEmail.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setIsSuccess(true);
      // Clean up fields other than pre-fills
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to dispatch contact feedback:', err);
      setErrorMsg(err.message || 'An error occurred while transmitting coordinates to Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-[#0a0a0a] border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative ambient elements matching user visual identity */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/5 blur-[80px] pointer-events-none" />

        {/* Top Header Row */}
        <div className="p-5 sm:p-6 border-b border-neutral-900/60 flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-neutral-100 uppercase tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              CONTACT FORM
            </h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-900 text-neutral-400 hover:text-neutral-100 transition duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Core Area: Simple container for live interactive form */}
        <div className="p-6 relative z-10 max-h-[calc(100vh-145px)] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5 text-center py-6"
              >
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto relative">
                  <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 blur-md animate-ping pointer-events-none" />
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-neutral-100 uppercase tracking-tight">Transmission Complete</h2>
                  <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    Coordinates received. Your query has been logged and synchronized inside the database. A notification was fired off in your notifications hub.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 hover:text-white rounded-xl text-xs font-bold font-mono tracking-tight transition cursor-pointer"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </motion.div>
            ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">SEND MESSAGES DIRECTLY TO ATHLETE CO. SUPPORT</span>
                  </div>

                  {/* Name and Email inputs side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 opacity-75">
                      <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider block">Full Name (Locked)</label>
                      <input 
                        type="text" 
                        readOnly
                        disabled
                        value={user.name || name}
                        className="w-full bg-[#050505] border border-neutral-900/60 rounded-xl px-3.5 py-2.5 text-xs text-neutral-400 cursor-not-allowed select-none"
                      />
                    </div>
                    <div className="space-y-1.5 opacity-75">
                      <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider block">Email Address (Locked)</label>
                      <input 
                        type="email" 
                        readOnly
                        disabled
                        value={user.email || email}
                        className="w-full bg-[#050505] border border-neutral-900/60 rounded-xl px-3.5 py-2.5 text-xs text-neutral-400 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Subject input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider block">Subject / Topic <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Bug Report, Feature Request, Custom Routine Question"
                      className="w-full bg-[#020202] border border-neutral-900 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
                    />
                  </div>

                  {/* Message body input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider block">Message Details <span className="text-red-500">*</span></label>
                    <textarea 
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter the biomechanical feedback details, system ideas, or connection issues here..."
                      className="w-full bg-[#020202] border border-neutral-900 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200 resize-none"
                    />
                  </div>

                  {/* Error view */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
                      <Info className="w-3.5 h-3.5" />
                      <span>Transmitted securely over SSL encryption</span>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/10 w-auto active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          TRANSMITTING...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          SUBMIT SUBMISSION
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
