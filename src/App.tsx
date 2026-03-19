import React, { useState, useEffect } from 'react';
import { 
  Mic, Image as ImageIcon, Video, Layout, Settings, 
  History, LogOut, User as UserIcon, CreditCard, 
  ChevronRight, Play, Download, Sparkles, Plus,
  Menu, X, Check, AlertCircle, Trash2, Edit3,
  Monitor, Palette, Type, Sliders, BookOpen, Lightbulb, List, MessageSquare,
  Scissors, Sun, Moon, Contrast, Droplets, Wand2, Users, Home, Volume2, Search,
  Info, Shield, FileText, Mail, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { get, set } from 'idb-keyval';
import { geminiService } from './services/geminiService';
import { User, Generation, SiteSettings } from './types';

import VideoStudio from './components/VideoStudio';
import { BackgroundRemover } from './components/BackgroundRemover';

// --- Components ---

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100 dark:bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-100 dark:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-gradient-to-br from-accent to-orange-600 text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] border border-slate-200 dark:border-white/10',
    secondary: 'bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
    outline: 'border border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
    danger: 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] border border-slate-200 dark:border-white/10',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-5 py-2.5 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
      </div>
    </motion.button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    whileHover={{ y: -4 }}
    className={`bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl p-6 hover:shadow-[0_12px_40px_0_rgba(249,115,22,0.1)] transition-shadow duration-300 relative overflow-hidden group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1.5 relative">
    {label && <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">{label}</label>}
    <div className="relative group">
      <input
        {...props}
        className="w-full bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group-hover:border-slate-300 dark:border-white/20"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50" />
    </div>
  </div>
);

const TextArea = ({ label, ...props }: any) => (
  <div className="space-y-1.5 relative">
    {label && <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">{label}</label>}
    <div className="relative group">
      <textarea
        {...props}
        rows={4}
        className="w-full bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group-hover:border-slate-300 dark:border-white/20"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50" />
    </div>
  </div>
);

const Select = ({ label, children, options, ...props }: any) => (
  <div className="space-y-1.5 relative">
    {label && <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">{label}</label>}
    <div className="relative group">
      <select
        {...props}
        className="w-full bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group-hover:border-slate-300 dark:border-white/20 appearance-none"
      >
        {options ? options.map((opt: any, i: number) => (
          typeof opt === 'string' ? 
            <option key={i} value={opt}>{opt}</option> :
            <option key={i} value={opt.value}>{opt.label}</option>
        )) : children}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 rotate-90" />
      </div>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50" />
    </div>
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, suffix = '' }: any) => (
  <div className="space-y-1.5 relative">
    {label && <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">{label}</label>}
    <div className="flex items-center gap-4">
      <div className="relative group flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-lg appearance-none cursor-pointer shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] accent-accent"
        />
      </div>
      <span className="text-sm font-mono bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg w-20 text-center shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        {value > 0 && min < 0 ? '+' : ''}{value}{suffix}
      </span>
    </div>
  </div>
);

const AdPlaceholder = ({ format = 'horizontal' }: { format?: 'horizontal' | 'vertical' | 'rectangle' }) => {
  const styles = {
    horizontal: 'w-full h-[90px]',
    vertical: 'w-[300px] h-[600px]',
    rectangle: 'w-[300px] h-[250px]'
  };
  
  return (
    <div className={`bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded-lg flex flex-col items-center justify-center text-slate-500 my-4 ${styles[format]}`}>
      <span className="text-xs uppercase tracking-widest font-bold mb-1">Advertisement</span>
      <span className="text-sm">Google AdSense Placeholder</span>
    </div>
  );
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        </p>
        <div className="flex gap-2 whitespace-nowrap">
          <Button variant="outline" onClick={() => setVisible(false)}>Decline</Button>
          <Button onClick={accept}>Accept All</Button>
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const LandingPage = ({ onLogin, onNavigate }: any) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings').then(res => res.json()).then(setSettings);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-accent/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Studio Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={onLogin} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block">
              Log in
            </button>
            <Button onClick={onLogin} className="px-6 py-2.5 rounded-full font-medium shadow-lg shadow-accent/20">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-from)_0%,_transparent_50%)] from-accent/20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-medium text-accent mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Introducing AI Creator Studio Pro 2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
          >
            {settings?.hero_headline || 'The All-in-One AI Creator OS'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Generate ultra-realistic voices, stunning images, and multi-scene videos in seconds. The professional toolkit for modern creators.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button onClick={onLogin} className="text-lg px-8 py-4 rounded-full shadow-xl shadow-accent/20 hover:scale-105 transition-transform">
              {settings?.hero_cta || 'Start Creating'} <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.4 }}
          className="mt-24 w-full max-w-6xl relative z-10"
        >
          <div className="aspect-[16/9] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
            {/* Mockup Header */}
            <div className="h-12 border-b border-slate-100 dark:border-white/5 flex items-center px-4 gap-2 bg-slate-50 dark:bg-slate-950/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Mockup Body */}
            <div className="flex-1 flex p-6 gap-6">
              <div className="w-64 space-y-4 hidden md:block">
                <div className="h-8 bg-white/5 rounded-lg w-full" />
                <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                <div className="h-8 bg-white/5 rounded-lg w-5/6" />
                <div className="h-8 bg-accent/20 rounded-lg w-full border border-accent/30" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="h-32 bg-white/5 rounded-xl w-full" />
                <div className="flex gap-6">
                  <div className="flex-1 h-64 bg-white/5 rounded-xl" />
                  <div className="w-1/3 h-64 bg-white/5 rounded-xl hidden lg:block" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to go viral.</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Stop juggling 10 different subscriptions. Studio Pro combines the best AI models into one seamless workflow.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mic, title: 'AI Voice Engine', desc: 'Ultra-realistic ElevenLabs-style voices with emotion control and pacing adjustments.' },
              { icon: ImageIcon, title: 'Image Generator', desc: 'Grok-style high-fidelity images with style presets, from photorealistic to 3D cartoon.' },
              { icon: Video, title: 'Video Generator', desc: 'Multi-scene AI videos with automatic narration, subtitles, and smooth transitions.' },
              { icon: Layout, title: 'Thumbnail Maker', desc: 'Auto-generated YouTube thumbnails with bold overlays optimized for high CTR.' }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-900/50 border-slate-100 dark:border-white/5 hover:border-accent/50 hover:bg-white dark:bg-slate-900 transition-all duration-300 group h-full">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                    <f.icon className="w-7 h-7 text-slate-600 dark:text-slate-300 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-white dark:bg-slate-900/30 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">From idea to published in minutes.</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Our AI tools guide you through the entire creative process. Just provide a topic, and we handle the rest.</p>
              
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Brainstorm & Outline', desc: 'Generate viral concepts and structured outlines tailored to your niche.' },
                  { step: '02', title: 'Generate Assets', desc: 'Create consistent characters, stunning scenes, and professional voiceovers.' },
                  { step: '03', title: 'Edit & Export', desc: 'Combine everything in our timeline editor, add text overlays, and export in 4K.' }
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.15 }}
                  >
                    <div className="text-2xl font-bold text-accent/50 font-mono">{s.step}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div className="aspect-square rounded-full bg-accent/10 absolute -inset-4 blur-3xl" />
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
                  >
                    <MessageSquare className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-medium">"Create a story about a cyberpunk detective"</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">User Prompt</p>
                    </div>
                  </motion.div>
                  <div className="flex justify-center py-2">
                    <motion.div 
                      className="w-px h-8 bg-gradient-to-b from-accent to-transparent" 
                      initial={{ height: 0 }}
                      whileInView={{ height: 32 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.6 }}
                    />
                  </div>
                  <motion.div 
                    className="flex items-center gap-4 p-4 bg-accent/10 rounded-xl border border-accent/20"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 1 }}
                  >
                    <Sparkles className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-medium">Generating 5 Scene Outline...</p>
                      <p className="text-xs text-accent/70">AI Scriptwriter</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to scale your content?</h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-10">Join thousands of creators who are building their audience faster with Studio Pro.</p>
          <Button onClick={onLogin} className="text-lg px-10 py-5 rounded-full shadow-xl shadow-accent/20 hover:scale-105 transition-transform">
            Get Started Today
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="font-bold text-xl tracking-tight">Studio Pro</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-600 dark:text-slate-300 transition-colors">About Us</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-600 dark:text-slate-300 transition-colors">Contact Us</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-600 dark:text-slate-300 transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-600 dark:text-slate-300 transition-colors">Terms of Service</button>
          </div>
          <p className="text-sm text-slate-600">© 2026 AI Creator Studio Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// End of Chunk 1

const AuthPage = ({ onAuth, onBack }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment } = await import('./firebase');
      
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
      }

      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      let userData;
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        let referredBy = null;
        const searchParams = new URLSearchParams(window.location.search);
        const refCode = searchParams.get('ref');
        
        if (refCode && refCode !== result.user.uid) {
          referredBy = refCode;
        }

        userData = {
          uid: result.user.uid,
          email: result.user.email,
          photoURL: result.user.photoURL || null,
          credits: referredBy ? 350 : 300, // Bonus 50 credits for signing up with referral
          subscription_tier: 'free',
          created_at: new Date().toISOString(),
          referral_code: result.user.uid, // Use UID as referral code
          referred_by: referredBy,
          referral_count: 0,
          total_referral_credits: 0
        };
        
        try {
          const { writeBatch } = await import('./firebase');
          const batch = writeBatch(db);
          batch.set(userRef, userData);
          
          if (referredBy) {
            const referrerRef = doc(db, 'users', referredBy);
            batch.update(referrerRef, {
              credits: increment(50),
              referral_count: increment(1),
              total_referral_credits: increment(50)
            });
          }
          await batch.commit();
        } catch (err) {
          console.error("Failed to create user or process referral:", err);
          // Fallback to just creating the user if referral fails
          userData.referred_by = null;
          userData.credits = 300;
          await setDoc(userRef, userData);
        }
      }

      onAuth({ user: userData });
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { signInWithPopup, auth, googleProvider, db, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment } = await import('./firebase');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let userData;
      if (!userSnap.exists()) {
        let referredBy = null;
        const searchParams = new URLSearchParams(window.location.search);
        const refCode = searchParams.get('ref');
        
        if (refCode && refCode !== user.uid) {
          referredBy = refCode;
        }

        // Create new user
        userData = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL || null,
          credits: referredBy ? 100 : 50, // Starting credits + bonus
          is_admin: false,
          subscription_tier: 'free',
          created_at: new Date().toISOString(),
          referral_code: user.uid, // Use UID as referral code for secure lookups
          referred_by: referredBy,
          referral_count: 0,
          total_referral_credits: 0
        };
        
        try {
          const { writeBatch } = await import('./firebase');
          const batch = writeBatch(db);
          batch.set(userRef, userData);
          
          if (referredBy) {
            const referrerRef = doc(db, 'users', referredBy);
            batch.update(referrerRef, {
              credits: increment(50),
              referral_count: increment(1),
              total_referral_credits: increment(50)
            });
          }
          await batch.commit();
        } catch (err) {
          console.error("Failed to create user or process referral:", err);
          // Fallback to just creating the user if referral fails
          userData.referred_by = null;
          userData.credits = 50;
          await setDoc(userRef, userData);
        }
      } else {
        userData = userSnap.data();
        // Update photoURL if missing
        if (!userData.photoURL && user.photoURL) {
          userData.photoURL = user.photoURL;
          await setDoc(userRef, { photoURL: user.photoURL }, { merge: true });
        }
      }

      onAuth({ user: userData });
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In. Please add it to your Firebase Console > Authentication > Settings > Authorized domains.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setError(err.message || 'An error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-from)_0%,_transparent_50%)] from-accent/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <button onClick={onBack} className="absolute top-8 left-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors z-20">
        <ChevronRight className="w-5 h-5 rotate-180" /> Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl shadow-black/50 border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 mx-auto mb-6"
            >
              <Sparkles className="w-6 h-6 text-slate-900 dark:text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 dark:text-slate-400">{isLogin ? 'Sign in to your studio' : 'Start your creative journey today'}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm flex items-center gap-2 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4" /> {error}
                </motion.div>
              )}
            </AnimatePresence>
            <Button type="submit" className="w-full py-3" loading={loading}>{isLogin ? 'Sign In' : 'Sign Up'}</Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-300 dark:border-slate-700"></div>
            <span className="px-4 text-slate-500 text-sm">or</span>
            <div className="flex-1 border-t border-slate-300 dark:border-slate-700"></div>
          </div>

          <Button variant="outline" onClick={handleGoogleLogin} className="w-full py-3 flex items-center justify-center gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline text-sm transition-all">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, onLogout, settings }: any) => {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState<Generation[]>([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackResponse, setFeedbackResponse] = useState('');
  const [feedbackTextResponse, setFeedbackTextResponse] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tool States
  const [voiceText, setVoiceText] = useState('');
  const [voiceMode, setVoiceMode] = useState<'standard' | 'clone'>('standard');
  const [voiceCloneFile, setVoiceCloneFile] = useState<File | null>(null);
  const [voiceCloneConsent, setVoiceCloneConsent] = useState(false);
  const [voiceCloneName, setVoiceCloneName] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState('English');
  const [voicePreset, setVoicePreset] = useState('Rachel (Female, American, Calm)');
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceEmotion, setVoiceEmotion] = useState('neutral');
  const [voiceNoiseReduction, setVoiceNoiseReduction] = useState(false);
  const [voiceEq, setVoiceEq] = useState('none');
  const [voiceResult, setVoiceResult] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [musicResult, setMusicResult] = useState('');
  const [scriptPrompt, setScriptPrompt] = useState('');
  const [scriptResult, setScriptResult] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('Photorealistic');
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');
  const [imageResult, setImageResult] = useState('');
  const [imageOverlayText, setImageOverlayText] = useState('');
  const [imageOverlayFont, setImageOverlayFont] = useState('Arial');
  const [imageOverlaySize, setImageOverlaySize] = useState(48);
  const [imageOverlayColor, setImageOverlayColor] = useState('#ffffff');
  const [imageOverlayPosition, setImageOverlayPosition] = useState('center');
  const [bgRemoverResult, setBgRemoverResult] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoMode, setVideoMode] = useState('Cinematic');
  const [videoResult, setVideoResult] = useState<string>('');
  const [thumbnailVisualPrompt, setThumbnailVisualPrompt] = useState('');
  const [thumbnailResult, setThumbnailResult] = useState('');
  const [thumbnailTopic, setThumbnailTopic] = useState('');
  const [isSuggestingThumbnails, setIsSuggestingThumbnails] = useState(false);
  const [videoScenes, setVideoScenes] = useState<any[]>([]);
  const [videoProgress, setVideoProgress] = useState('');
  const [thumbnailSuggestions, setThumbnailSuggestions] = useState<any[]>([]);

  const handleApplyThumbnailSuggestion = (suggestion: any) => {
    setThumbnailVisualPrompt(suggestion.visual_prompt);
    setActiveTab('thumbnail');
  };

  const handleSuggestThumbnails = async () => {
    if (!thumbnailTopic) return;
    if (!checkCredits(1)) return;
    setIsSuggestingThumbnails(true);
    try {
      const suggestions = await geminiService.suggestThumbnails(thumbnailTopic);
      setThumbnailSuggestions(suggestions);
    } catch (err) {
      alert("Failed to get thumbnail suggestions");
    } finally {
      setIsSuggestingThumbnails(false);
    }
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradeMessage, setUpgradeMessage] = useState({ title: 'Upgrade to Pro', desc: 'You need more credits or a Pro subscription to use this feature.' });
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  const checkCredits = (required: number, requiresPremium: boolean = false) => {
    const currentCredits = user?.credits ?? 0;
    const currentTier = user?.subscription_tier || 'free';
    
    if (requiresPremium && currentTier === 'free') {
      setUpgradeMessage({
        title: 'Pro Feature Locked',
        desc: 'This feature is exclusive to Pro and Premium subscribers. Upgrade to unlock it!'
      });
      setShowUpgradeModal(true);
      return false;
    }
    if (currentCredits < required) {
      setUpgradeMessage({
        title: 'Out of Credits',
        desc: `You need ${required} credits for this action, but you only have ${currentCredits} left. Upgrade to get more!`
      });
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const handleUpgrade = (plan: string) => {
    setSelectedPlanForPayment(plan);
    setShowPaymentModal(true);
    setShowUpgradeModal(false);
  };

  const handleProcessPayment = async (provider: 'stripe' | 'razorpay') => {
    if (!selectedPlanForPayment || !user) return;
    
    try {
      setUpgradingPlan(selectedPlanForPayment);
      setShowPaymentModal(false);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { db, doc, updateDoc } = await import('./firebase');
      const userRef = doc(db, 'users', user.uid);
      const newCredits = selectedPlanForPayment === 'limited' ? 999999 : selectedPlanForPayment === 'pro' ? 500 : 50;
      
      await updateDoc(userRef, {
        subscription_tier: selectedPlanForPayment,
        credits: newCredits
      });
      
      const planName = selectedPlanForPayment === 'limited' ? 'PREMIUM' : selectedPlanForPayment === 'pro' ? 'PRO' : 'FREE';
      
      // Send email notification
      fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: `Subscription upgraded to ${planName}`,
          type: 'subscription_success',
          data: { plan: planName, credits: newCredits }
        })
      }).catch(console.error);

      alert(`🎉 Successfully upgraded to ${planName} plan via ${provider.toUpperCase()}!\n\n📧 A welcome purchase receipt and onboarding guide has been sent directly to your Gmail: ${user.email}`);
    } catch (e) {
      console.error(e);
      alert('Failed to process payment');
    } finally {
      setUpgradingPlan(null);
      setSelectedPlanForPayment(null);
    }
  };

  const videoTemplates = [
    { 
      title: 'Cinematic Trailer', 
      prompt: 'A cinematic trailer for a sci-fi movie, featuring a neon-lit cyberpunk city, flying cars, and a mysterious protagonist looking over the edge of a skyscraper.', 
      mode: 'Cinematic', 
      aspectRatio: '16:9',
      cameraMotion: 'Zoom In',
      multiScene: true,
      negativePrompt: 'cartoon, low quality, blurry',
      preview: 'https://picsum.photos/seed/cyberpunk/400/225' 
    },
    { 
      title: 'TikTok Recipe', 
      prompt: 'A fast-paced, top-down view of making a delicious chocolate cake. Close up shots of mixing batter, pouring chocolate, and slicing the final cake.', 
      mode: 'Short Film', 
      aspectRatio: '9:16',
      cameraMotion: 'None',
      multiScene: true,
      negativePrompt: 'messy, dark lighting, text',
      preview: 'https://picsum.photos/seed/cake/225/400' 
    },
    { 
      title: 'Instagram Product Promo', 
      prompt: 'A sleek, modern showcase of a new smartwatch floating in mid-air with dynamic lighting and water splashes.', 
      mode: 'Advertisement', 
      aspectRatio: '9:16',
      cameraMotion: 'Pan Right',
      multiScene: false,
      negativePrompt: 'people, messy background',
      preview: 'https://picsum.photos/seed/watch/225/400' 
    },
    { 
      title: 'Anime Action Scene', 
      prompt: 'An intense anime-style battle scene with glowing energy blasts, dynamic poses, and dramatic speed lines.', 
      mode: 'Anime', 
      aspectRatio: '16:9',
      cameraMotion: 'Zoom Out',
      multiScene: false,
      negativePrompt: 'realistic, 3d, slow paced',
      preview: 'https://picsum.photos/seed/anime/400/225' 
    },
  ];

  const thumbnailTemplates = [
    {
      title: 'Gaming Let\'s Play',
      text: 'I SURVIVED 100 DAYS!',
      visual_prompt: 'Minecraft landscape, epic sunset, shaders, high quality, 4k, vibrant colors',
      preview: 'https://picsum.photos/seed/gaming/400/225'
    },
    {
      title: 'Tech Review',
      text: 'DON\'T BUY THIS YET!',
      visual_prompt: 'Sleek smartphone floating in dark studio lighting, neon accents, highly detailed, 8k resolution',
      preview: 'https://picsum.photos/seed/tech/400/225'
    },
    {
      title: 'Vlog / Lifestyle',
      text: 'MY MORNING ROUTINE',
      visual_prompt: 'Aesthetic cozy bedroom, morning sunlight streaming through window, coffee cup on bedside table, soft focus',
      preview: 'https://picsum.photos/seed/vlog/400/225'
    },
    {
      title: 'Finance / Crypto',
      text: 'HUGE CRASH COMING?',
      visual_prompt: 'Stock market chart with dramatic red downward arrow, glowing neon numbers, dark background, cinematic lighting',
      preview: 'https://picsum.photos/seed/finance/400/225'
    }
  ];

  const handleGenerateVideo = async (settings: any = {}) => {
    if (!checkCredits(10, true)) return;
    setLoading(true);
    setVideoProgress('Generating your video... this may take a moment.');
    let finalPrompt = '';
    try {
      finalPrompt = `${videoPrompt}, ${videoMode} style`;
      if (settings.negativePrompt) {
        finalPrompt += `. Do not include: ${settings.negativePrompt}`;
      }
      if (settings.cameraMotion && settings.cameraMotion !== 'None') {
        finalPrompt += `. Camera motion: ${settings.cameraMotion}`;
      }
      if (settings.multiScene) {
        finalPrompt += `. Create a multi-scene sequence.`;
      }
      
      const videoUrl = await geminiService.generateSingleVideo(finalPrompt, settings.aspectRatio || '16:9', settings.duration || '5s');
      setVideoResult(videoUrl);
      await trackGeneration('video', finalPrompt, videoUrl, 10);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || JSON.stringify(err);
      if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('The caller does not have permission') || errMsg.includes('Requested entity was not found') || errMsg.includes('API key')) {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          await aistudio.openSelectKey();
          // Retry automatically after key selection
          try {
            setVideoProgress('Retrying video generation...');
            const retryVideoUrl = await geminiService.generateSingleVideo(finalPrompt, settings.aspectRatio || '16:9', settings.duration || '5s');
            setVideoResult(retryVideoUrl);
            await trackGeneration('video', finalPrompt, retryVideoUrl, 25);
          } catch (retryErr: any) {
            console.error(retryErr);
            alert(`Video generation failed after retry: ${retryErr.message || JSON.stringify(retryErr)}`);
          }
        }
      } else {
        alert(`Video generation failed: ${errMsg}`);
      }
    } finally {
      setLoading(false);
      setVideoProgress('');
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!checkCredits(2)) return;
    setLoading(true);
    try {
      if (!thumbnailVisualPrompt) {
        alert("Please enter a visual prompt for the thumbnail.");
        setLoading(false);
        return;
      }
      
      const bgImageSrc = await geminiService.generateImage(thumbnailVisualPrompt + ", YouTube thumbnail background, high quality, 16:9", "16:9");
      
      setThumbnailResult(bgImageSrc);
      await trackGeneration('thumbnail', thumbnailVisualPrompt, bgImageSrc, 2);
    } catch (err) {
      alert("Thumbnail generation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe: () => void;
    const initHistory = async () => {
      try {
        const { db, collection, query, where, orderBy, onSnapshot, deleteDoc, doc } = await import('./firebase');
        const q = query(
          collection(db, 'generations'),
          where('userId', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        unsubscribe = onSnapshot(q, async (snapshot) => {
          const rawGens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          
          const now = new Date().getTime();
          const validGens = [];

          for (const gen of rawGens) {
            const genTime = new Date(gen.created_at).getTime();
            const hoursDiff = (now - genTime) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
              // Delete from Firestore
              try {
                await deleteDoc(doc(db, 'generations', gen.id));
              } catch (e) {
                console.error("Failed to delete old generation", e);
              }
            } else {
              validGens.push(gen);
            }
          }

          // Load local large files if needed
          const gens = await Promise.all(validGens.map(async (gen) => {
            if (gen.result_url && gen.result_url.startsWith('local_')) {
              try {
                const localUrl = await get(gen.result_url);
                if (localUrl) {
                  return { ...gen, result_url: localUrl };
                }
              } catch (e) {
                console.error("Failed to load local image", e);
              }
            }
            return gen;
          }));
          
          setHistory(gens);
        }, (error) => {
          console.error("Error fetching history:", error);
        });
      } catch (e) {
        console.error("Failed to initialize history listener", e);
      }
    };
    initHistory();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user.uid]);

  const trackGeneration = async (type: "video" | "image" | "voice" | "thumbnail" | "script" | "music", prompt: string, url: string, credits: number) => {
    try {
      const { db, collection, addDoc, doc, setDoc } = await import('./firebase');
      
      let firestoreUrl = url;
      // If URL is a large base64 string, store it locally and save a reference
      if (url && url.length > 900000) {
        const localId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await set(localId, url);
        firestoreUrl = localId;
      }
      
      // Save generation to Firestore
      try {
        await addDoc(collection(db, 'generations'), {
          userId: user.uid,
          type,
          prompt,
          result_url: firestoreUrl,
          credits_used: credits,
          created_at: new Date().toISOString()
        });
      } catch (addError) {
        console.error("Failed to add generation doc:", addError);
        throw addError;
      }

      // Update user credits in Firestore
      try {
        const newCredits = (user.credits ?? 0) - credits;
        await import('./firebase').then(({ updateDoc }) => updateDoc(doc(db, 'users', user.uid), { credits: newCredits }));
        
        // Send low credit warning email
        if (newCredits <= 10 && (user.credits ?? 0) > 10) {
          fetch('/api/notifications/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              subject: 'Low Credit Warning',
              type: 'low_credits',
              data: { remainingCredits: newCredits }
            })
          }).catch(console.error);
        }
      } catch (updateError) {
        console.error("Failed to update user credits:", updateError);
        throw updateError;
      }
      
    } catch (e) {
      console.error("Failed to track generation", e);
      // Fallback for local state if Firestore fails
      const newGen: any = { id: Date.now().toString(), type, prompt, result_url: url, credits_used: credits, created_at: new Date().toISOString() };
      setHistory(prev => [newGen, ...prev]);
      user.credits = (user.credits ?? 0) - credits;
    }
  };

  const handleGenerateScript = async () => {
    if (!checkCredits(1)) return;
    setLoading(true);
    try {
      const result = await geminiService.generateText(`Write a detailed video script for the following topic: ${scriptPrompt}. Include scene descriptions, camera angles, and dialogue/voiceover.`);
      setScriptResult(result);
      await trackGeneration('script', scriptPrompt, 'text', 1);
    } catch (err) {
      alert("Script generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!checkCredits(3)) return;
    setLoading(true);
    try {
      const url = await geminiService.generateVoice(`Generate background music for: ${musicPrompt}`, 'Kore');
      setMusicResult(url);
      await trackGeneration('music', musicPrompt, url, 3);
    } catch (err) {
      alert("Music generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage) return;
    setIsSubmittingFeedback(true);
    try {
      const prompt = `A user is experiencing an issue or has a question about this AI creative studio app. Provide a helpful, concise solution or answer. User message: "${feedbackMessage}"`;
      const solutionText = await geminiService.generateText(prompt);
      setFeedbackTextResponse(solutionText);
      
      const audioUrl = await geminiService.generateVoice(solutionText, 'Kore');
      setFeedbackResponse(audioUrl);
    } catch (err) {
      alert("Failed to generate response");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!checkCredits(2)) return;
    setLoading(true);
    try {
      let prompt = '';
      let baseVoice = 'Kore';
      
      if (voiceMode === 'clone') {
        prompt = `Speak in ${voiceLanguage} using the custom cloned voice "${voiceCloneName}", with a pitch multiplier of ${voicePitch}x, a speed of ${voiceSpeed}x, and a ${voiceEmotion} emotional tone: ${voiceText}`;
        // In a real app, this would use the uploaded voiceCloneFile
        // For now, we simulate it with a standard voice
        baseVoice = 'Zephyr';
      } else {
        // Extract the base voice name (Rachel, Drew, etc.)
        const elevenLabsName = voicePreset.split(' ')[0];
        const style = voicePreset.split('(')[1]?.replace(')', '') || 'Professional';
        
        const voiceMap: Record<string, string> = {
          'Rachel': 'Kore', 'Drew': 'Puck', 'Clyde': 'Charon', 'Paul': 'Fenrir', 'Domi': 'Zephyr',
          'Fin': 'Puck', 'Bella': 'Kore', 'Antoni': 'Charon', 'Thomas': 'Fenrir', 'Charlie': 'Puck',
          'Emily': 'Zephyr', 'Elli': 'Kore', 'Callum': 'Charon', 'Patrick': 'Fenrir', 'Harry': 'Puck',
          'Liam': 'Charon', 'Dorothy': 'Zephyr', 'Josh': 'Fenrir', 'Arnold': 'Charon', 'Charlotte': 'Kore',
          'Matilda': 'Zephyr', 'Matthew': 'Puck', 'James': 'Charon', 'Joseph': 'Fenrir', 'Jeremy': 'Puck',
          'Michael': 'Charon', 'Ethan': 'Fenrir', 'Gigi': 'Zephyr', 'Freya': 'Kore', 'Grace': 'Zephyr',
          'Daniel': 'Puck', 'Serena': 'Kore', 'Adam': 'Charon', 'Nicole': 'Zephyr', 'Jessie': 'Puck',
          'Ryan': 'Fenrir', 'Sam': 'Charon', 'Glinda': 'Kore'
        };
        baseVoice = voiceMap[elevenLabsName] || 'Kore';
        prompt = `Speak in ${voiceLanguage} with a ${style} voice, with a pitch multiplier of ${voicePitch}x, a speed of ${voiceSpeed}x, and a ${voiceEmotion} emotional tone: ${voiceText}`;
      }
      
      const url = await geminiService.generateVoice(prompt, baseVoice, { noiseReduction: voiceNoiseReduction, eq: voiceEq });
      setVoiceResult(url);
      await trackGeneration('voice', voiceText, url, 2);
    } catch (err) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBackground = async (imageBase64: string, mimeType: string) => {
    if (!imageBase64) return;
    if (!checkCredits(2)) return;
    setLoading(true);
    try {
      const parts = imageBase64.split(',');
      const base64 = parts[1];
      
      const url = await geminiService.editImage(
        "Remove the background from this image, leaving only the main subject on a transparent background.",
        base64,
        mimeType
      );
      setBgRemoverResult(url);
      await trackGeneration('image', 'Background Removal', url, 2);
    } catch (err) {
      alert("Background removal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!checkCredits(5)) return;
    setLoading(true);
    try {
      let finalPrompt = imagePrompt;
      if (imageStyle !== 'None') {
        finalPrompt += `, ${imageStyle} style`;
      }
      const url = await geminiService.generateImage(finalPrompt, imageAspectRatio);
      setImageResult(url);
      await trackGeneration('image', finalPrompt, url, 5);
    } catch (err) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadImageWithText = async () => {
    if (!imageResult) return;
    
    if (!imageOverlayText) {
      handleDownload(imageResult, 'image.png');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageResult;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Draw text
    const scaleFactor = canvas.width / 400; // rough estimate based on preview width
    const fontSize = imageOverlaySize * scaleFactor;
    
    ctx.font = `bold ${fontSize}px ${imageOverlayFont}`;
    ctx.fillStyle = imageOverlayColor;
    ctx.textAlign = 'center';
    
    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4 * scaleFactor;
    ctx.shadowOffsetX = 2 * scaleFactor;
    ctx.shadowOffsetY = 2 * scaleFactor;

    let yPos = canvas.height / 2;
    if (imageOverlayPosition === 'top') {
      yPos = fontSize + 20 * scaleFactor;
      ctx.textBaseline = 'top';
    } else if (imageOverlayPosition === 'bottom') {
      yPos = canvas.height - 20 * scaleFactor;
      ctx.textBaseline = 'bottom';
    } else {
      ctx.textBaseline = 'middle';
    }

    ctx.fillText(imageOverlayText, canvas.width / 2, yPos);

    const dataUrl = canvas.toDataURL('image/png');
    handleDownload(dataUrl, 'image-with-text.png');
  };

  const menuGroups = [
    {
      label: 'Dashboard',
      items: [
        { id: 'home', icon: Home, label: 'Home' },
      ]
    },
    {
      label: 'Creation Tools',
      items: [
        { id: 'scriptwriter', icon: Type, label: 'AI Scriptwriter' },
        { id: 'voice', icon: Mic, label: 'Text to Voice', isPremium: true },
        { id: 'music', icon: Volume2, label: 'Background Music', isPremium: true },
        { id: 'image', icon: ImageIcon, label: 'Text to Image' },
        { id: 'video', icon: Video, label: 'Text to Video', isPremium: true },
        { id: 'thumbnail', icon: Layout, label: 'Thumbnails', isPremium: true },
        { id: 'bg-remover', icon: Scissors, label: 'Background Remover', isPremium: true },
      ]
    },
    {
      label: 'Account',
      items: [
        { id: 'billing', icon: CreditCard, label: 'Billing' },
        { id: 'referrals', icon: Users, label: 'Referrals' },
        { id: 'feedback', icon: MessageSquare, label: 'Feedback & Help' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'about', icon: Info, label: 'About Us' },
        { id: 'contact', icon: Mail, label: 'Contact Us' },
        { id: 'privacy', icon: Shield, label: 'Privacy Policy' },
        { id: 'terms', icon: FileText, label: 'Terms & Conditions' },
      ]
    }
  ];

  if (user.is_admin) {
    menuGroups.push({
      label: 'Admin',
      items: [
        { id: 'admin', icon: Settings, label: 'Admin Panel' }
      ]
    });
  }

// End of Chunk 2

  return (
    <div className="h-[100dvh] flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Global Background */}
      <div className="fixed inset-0 z-[-1] bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-[100dvh] z-50 flex flex-col lg:relative
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white dark:bg-slate-900/40 backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.5)]
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            {(sidebarOpen || mobileMenuOpen) && <span className="font-bold text-lg tracking-tight">Studio Pro</span>}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-500 dark:text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-4">
          {menuGroups.map((group, groupIndex) => (
            <div key={group.label} className="space-y-2">
              {(sidebarOpen || mobileMenuOpen) && (
                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const delay = (groupIndex * 3 + itemIndex) * 0.05;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24, delay }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (item.isPremium && user.subscription_tier === 'free') {
                          setShowUpgradeModal(true);
                          return;
                        }
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        activeTab === item.id ? 'bg-gradient-to-r from-accent to-orange-600 text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {(sidebarOpen || mobileMenuOpen) && <span>{item.label}</span>}
                      </div>
                      {(sidebarOpen || mobileMenuOpen) && item.isPremium && user.subscription_tier === 'free' && (
                        <span className="text-[9px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-4 shadow-inner">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Credits</span>
              <span className="text-xs font-bold text-accent">{user.subscription_tier === 'limited' ? 'Unlimited' : `${user.credits} / ${user.subscription_tier === 'pro' ? '500' : '50'}`}</span>
            </div>
            <div className="w-full bg-slate-50 dark:bg-slate-950/50 h-2 rounded-full overflow-hidden shadow-inner border border-slate-100 dark:border-white/5">
              <div 
                className={`h-full transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] ${user.credits < 10 && user.subscription_tier !== 'limited' ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-accent to-orange-400'}`} 
                style={{ width: user.subscription_tier === 'limited' ? '100%' : `${Math.min(100, Math.max(0, (user.credits / (user.subscription_tier === 'pro' ? 500 : 50)) * 100))}%` }} 
              />
            </div>
          </div>

          {(sidebarOpen || mobileMenuOpen) && user.subscription_tier === 'free' && (
            <div className="mb-4 bg-gradient-to-br from-accent/10 to-orange-600/10 border border-accent/20 rounded-xl p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Get unlimited access to all AI tools and remove ads.</p>
                <Button className="w-full py-2 text-xs" onClick={() => setShowUpgradeModal(true)}>
                  View Plans
                </Button>
              </div>
            </div>
          )}

          {(sidebarOpen || mobileMenuOpen) && user.subscription_tier === 'free' && (
            <div className="mt-4">
              <AdPlaceholder format="rectangle" />
            </div>
          )}

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 mt-4"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
            {(sidebarOpen || mobileMenuOpen) && (
              <span className="flex-1 text-left whitespace-nowrap">Log Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative z-10">
        <header className="sticky top-0 z-30 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 lg:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-white dark:bg-slate-900 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="hidden lg:flex p-2 text-slate-500 dark:text-slate-400 hover:bg-white dark:bg-slate-900 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold">{menuGroups.flatMap(g => g.items).find(m => m.id === activeTab)?.label}</h1>
              <p className="hidden sm:block text-xs lg:text-sm text-slate-500 dark:text-slate-400">Welcome back, {(user.email || 'User').split('@')[0]}</p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="w-full bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  if (!val) return;
                  const found = menuGroups.flatMap(g => g.items).find(m => m.label.toLowerCase().includes(val));
                  if (found) setActiveTab(found.id);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <ThemeToggle />
            {user.subscription_tier === 'free' ? (
              <Button variant="outline" className="hidden md:flex py-1.5 text-sm" onClick={() => setShowUpgradeModal(true)}>
                <Sparkles className="w-4 h-4" /> Upgrade
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/20 to-orange-500/20 text-accent rounded-xl border border-accent/30 text-sm font-medium shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]">
                <Sparkles className="w-4 h-4 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                <span className="capitalize">{user.subscription_tier} Plan</span>
              </div>
            )}
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-slate-200 dark:border-white/10 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] object-cover cursor-pointer" onClick={() => setActiveTab('settings')} />
            ) : (
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] cursor-pointer" onClick={() => setActiveTab('settings')}>
                <span className="text-sm lg:text-base font-bold text-slate-500 dark:text-slate-400">{user.email.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {user.subscription_tier === 'free' && (
            <div className="mb-6">
              <AdPlaceholder format="horizontal" />
            </div>
          )}
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-accent/20 to-slate-900/80 backdrop-blur-xl border border-accent/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_8px_32px_0_rgba(249,115,22,0.15)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(249,115,22,0.2),transparent_50%)] pointer-events-none" />
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Sparkles className="w-40 h-40 text-accent drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Welcome back to Studio Pro</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mb-6">You have {user.credits} credits remaining. What would you like to create today?</p>
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={() => setActiveTab('voice')}><Mic className="w-4 h-4" /> Generate Voice</Button>
                      <Button onClick={() => setActiveTab('image')} variant="secondary"><ImageIcon className="w-4 h-4" /> Text to Image</Button>
                      <Button onClick={() => setActiveTab('video')} variant="secondary"><Video className="w-4 h-4" /> Text to Video</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Quick Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { id: 'voice', icon: Mic, title: 'Text to Voice', desc: 'Text to speech with emotion' },
                      { id: 'image', icon: ImageIcon, title: 'Text to Image', desc: 'Generate high-quality images' },
                      { id: 'video', icon: Video, title: 'Text to Video', desc: 'Create AI videos from text' },
                      { id: 'scriptwriter', icon: Type, title: 'AI Scriptwriter', desc: 'Brainstorm and outline' },
                      { id: 'bg-remover', icon: Scissors, title: 'Background Remover', desc: 'Remove image backgrounds' }
                    ].map(tool => (
                      <Card key={tool.id} className="hover:border-accent/50 transition-colors cursor-pointer group" onClick={() => setActiveTab(tool.id)}>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold mb-1">{tool.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{tool.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {history && history.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Recent Activity</h3>
                      <button onClick={() => setActiveTab('history')} className="text-sm text-accent hover:text-orange-400 transition-colors">View All</button>
                    </div>
                    <div className="space-y-3">
                      {history.slice(0, 3).map((item, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 gap-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.1)] cursor-pointer"
                          onClick={() => setActiveTab('history')}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                                {item.type}
                              </span>
                              <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{item.prompt}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 whitespace-nowrap">-{item.credits_used} Credits</span>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${voiceMode === 'standard' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      onClick={() => setVoiceMode('standard')}
                    >
                      Standard Voices
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${voiceMode === 'clone' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      onClick={() => {
                        if (user.subscription_tier === 'free') {
                          setUpgradeMessage({ title: 'Pro Feature', desc: 'Voice Cloning is only available on Pro and Premium plans.' });
                          setShowUpgradeModal(true);
                        } else {
                          setVoiceMode('clone');
                        }
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-accent" />
                      Voice Cloning
                    </button>
                  </div>

                  <Card>
                    <TextArea 
                      label="Script" 
                      placeholder="Type or paste your script here..." 
                      value={voiceText}
                      onChange={(e: any) => setVoiceText(e.target.value)}
                    />
                    
                    {voiceMode === 'clone' ? (
                      <div className="mt-6 space-y-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Create Custom Voice</h4>
                          <p className="text-sm text-slate-500 mb-4">Upload a clean, 30-60 second audio sample of the voice you want to clone. No background noise.</p>
                          
                          <div className="space-y-4">
                            <Input 
                              label="Voice Name" 
                              placeholder="e.g., My Podcast Voice" 
                              value={voiceCloneName}
                              onChange={(e: any) => setVoiceCloneName(e.target.value)}
                            />
                            
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                              <input 
                                type="file" 
                                accept="audio/*" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setVoiceCloneFile(e.target.files[0]);
                                  }
                                }}
                              />
                              <Mic className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {voiceCloneFile ? voiceCloneFile.name : 'Click or drag audio file here'}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">MP3, WAV up to 10MB</p>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                              <h5 className="text-sm font-bold text-amber-800 dark:text-amber-500 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Ethical Usage Policy
                              </h5>
                              <p className="text-xs text-amber-700 dark:text-amber-400/80 mb-3">
                                You may only clone voices you have explicit permission to use. Cloning celebrity voices, public figures, or unauthorized individuals is strictly prohibited and will result in account termination.
                              </p>
                              <label className="flex items-start gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="mt-1 rounded text-accent focus:ring-accent"
                                  checked={voiceCloneConsent}
                                  onChange={(e) => setVoiceCloneConsent(e.target.checked)}
                                />
                                <span className="text-xs text-slate-700 dark:text-slate-300">
                                  I confirm that I have the legal right and explicit consent to clone this voice, and I will not use it for deceptive or malicious purposes.
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Select 
                          label="Language"
                          value={voiceLanguage}
                          onChange={(e: any) => setVoiceLanguage(e.target.value)}
                          options={[
                            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Korean', 
                            'Chinese (Mandarin)', 'Arabic', 'Hindi', 'Bengali', 'Turkish', 'Vietnamese', 'Polish', 'Ukrainian', 'Thai', 'Indonesian',
                            'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek', 'Czech', 'Romanian', 'Hungarian', 'Hebrew', 'Malay', 'Tagalog'
                          ]}
                        />
                        <Select 
                          label="Voice Preset"
                          value={voicePreset}
                          onChange={(e: any) => setVoicePreset(e.target.value)}
                          options={[
                            'Rachel (Female, American, Calm)',
                            'Drew (Male, American, News)',
                            'Clyde (Male, American, War veteran)',
                            'Paul (Male, American, Ground reporter)',
                            'Domi (Female, American, Strong)',
                            'Fin (Male, Irish, Sailor)',
                            'Bella (Female, American, Soft)',
                            'Antoni (Male, American, Well-rounded)',
                            'Thomas (Male, American, Calm)',
                            'Charlie (Male, Australian, Casual)',
                            'Emily (Female, American, Calm)',
                            'Elli (Female, American, Youthful)',
                            'Callum (Male, American, Intense)',
                            'Patrick (Male, American, Shouty)',
                            'Harry (Male, American, Anxious)',
                            'Liam (Male, American, Neutral)',
                            'Dorothy (Female, British, Pleasant)',
                            'Josh (Male, American, Deep)',
                            'Arnold (Male, American, Crisp)',
                            'Charlotte (Female, English, Seductive)',
                            'Matilda (Female, American, Warm)',
                            'Matthew (Male, British, Calm)',
                            'James (Male, Australian, Calm)',
                            'Joseph (Male, British, News)',
                            'Jeremy (Male, American, Excited)',
                            'Michael (Male, American, Old)',
                            'Ethan (Male, American, Whisper)',
                            'Gigi (Female, American, Childish)',
                            'Freya (Female, American, Overexcited)',
                            'Grace (Female, American, Southern)',
                            'Daniel (Male, British, News)',
                            'Serena (Female, American, Pleasant)',
                            'Adam (Male, American, Deep)',
                            'Nicole (Female, American, Whisper)',
                            'Jessie (Male, American, Raspy)',
                            'Ryan (Male, American, Soldier)',
                            'Sam (Male, American, Raspy)',
                            'Glinda (Female, American, Witch)'
                          ]}
                        />
                      </div>
                    )}
                    <div className="mt-4">
                      <Select 
                        label="Pitch"
                        value={voicePitch}
                        onChange={(e: any) => setVoicePitch(parseFloat(e.target.value))}
                        options={[
                          { value: 0.1, label: '0.1x (Extremely Low)' },
                          { value: 0.5, label: '0.5x (Low)' },
                          { value: 0.75, label: '0.75x' },
                          { value: 1.0, label: '1.0x (Normal)' },
                          { value: 1.25, label: '1.25x' },
                          { value: 1.5, label: '1.5x (High)' },
                          { value: 2.0, label: '2.0x (Very High)' }
                        ]}
                      />
                    </div>
                    <div className="mt-4">
                      <Select 
                        label="Speed"
                        value={voiceSpeed}
                        onChange={(e: any) => setVoiceSpeed(parseFloat(e.target.value))}
                        options={[
                          { value: 0.1, label: '0.1x (Extremely Slow)' },
                          { value: 0.5, label: '0.5x (Slow)' },
                          { value: 0.75, label: '0.75x' },
                          { value: 1.0, label: '1.0x (Normal)' },
                          { value: 1.25, label: '1.25x' },
                          { value: 1.5, label: '1.5x (Fast)' },
                          { value: 2.0, label: '2.0x (Very Fast)' }
                        ]}
                      />
                    </div>
                    <div className="mt-4">
                      <Select 
                        label="Emotion"
                        value={voiceEmotion}
                        onChange={(e: any) => setVoiceEmotion(e.target.value)}
                        options={[
                          { value: 'neutral', label: 'Neutral' },
                          { value: 'happy', label: 'Happy' },
                          { value: 'sad', label: 'Sad' },
                          { value: 'angry', label: 'Angry' },
                          { value: 'calm', label: 'Calm' }
                        ]}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Audio Quality</label>
                        <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-3 hover:border-slate-300 dark:border-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-600 text-accent focus:ring-accent bg-white dark:bg-slate-900"
                            checked={voiceNoiseReduction}
                            onChange={(e) => setVoiceNoiseReduction(e.target.checked)}
                          />
                          <span className="text-sm text-slate-200">Noise Reduction</span>
                        </label>
                      </div>
                      <Select 
                        label="Equalizer (EQ)"
                        value={voiceEq}
                        onChange={(e: any) => setVoiceEq(e.target.value)}
                        options={[
                          { value: 'none', label: 'Flat (None)' },
                          { value: 'bass-boost', label: 'Bass Boost' },
                          { value: 'treble-boost', label: 'Treble Boost' },
                          { value: 'vocal-presence', label: 'Vocal Presence' },
                          { value: 'radio', label: 'Radio Effect' }
                        ]}
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleGenerateVoice} 
                        loading={loading} 
                        disabled={!voiceText || (voiceMode === 'clone' && (!voiceCloneFile || !voiceCloneConsent || !voiceCloneName))}
                      >
                        <Play className="w-4 h-4" /> Generate Voice (3 Credits)
                      </Button>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-accent" /> Preview</h3>
                    {voiceResult ? (
                      <div className="space-y-4">
                        <audio controls src={voiceResult} className="w-full" />
                        <Button variant="outline" className="w-full" onClick={() => handleDownload(voiceResult, 'audio.wav')}>
                          <Download className="w-4 h-4" /> Download Audio
                        </Button>
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                        Generated audio will appear here
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'scriptwriter' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <TextArea 
                      label="Script Topic" 
                      placeholder="What should the video be about? (e.g., A 60-second TikTok about the history of coffee)" 
                      value={scriptPrompt}
                      onChange={(e: any) => setScriptPrompt(e.target.value)}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateScript} loading={loading} disabled={!scriptPrompt}>
                        <Type className="w-4 h-4" /> Generate Script (2 Credits)
                      </Button>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-accent" /> Result</h3>
                    {scriptResult ? (
                      <div className="space-y-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                          {scriptResult}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                        Generated script will appear here
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'music' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <TextArea 
                      label="Music Description" 
                      placeholder="Describe the background music... (e.g., Upbeat lo-fi hip hop for a vlog, tense orchestral music for a thriller)" 
                      value={musicPrompt}
                      onChange={(e: any) => setMusicPrompt(e.target.value)}
                    />
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateMusic} loading={loading} disabled={!musicPrompt}>
                        <Mic className="w-4 h-4" /> Generate Music (3 Credits)
                      </Button>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-accent" /> Preview</h3>
                    {musicResult ? (
                      <div className="space-y-4">
                        <audio controls src={musicResult} className="w-full" />
                        <Button variant="outline" className="w-full" onClick={() => handleDownload(musicResult, 'music.wav')}>
                          <Download className="w-4 h-4" /> Download Music
                        </Button>
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                        Generated music will appear here
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <TextArea 
                      label="Image Prompt" 
                      placeholder="Describe the image you want to generate in detail..." 
                      value={imagePrompt}
                      onChange={(e: any) => setImagePrompt(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Select 
                        label="Style"
                        value={imageStyle}
                        onChange={(e: any) => setImageStyle(e.target.value)}
                        options={['None', 'Photorealistic', 'Cinematic', 'Anime', '3D Render', 'Digital Art', 'Cyberpunk', 'Watercolor']}
                      />
                      <Select 
                        label="Aspect Ratio"
                        value={imageAspectRatio}
                        onChange={(e: any) => setImageAspectRatio(e.target.value)}
                        options={['1:1', '16:9', '9:16', '4:3', '3:4']}
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateImage} loading={loading} disabled={!imagePrompt}>
                        <ImageIcon className="w-4 h-4" /> Generate Image (4 Credits)
                      </Button>
                    </div>
                  </Card>
                  {imageResult && (
                    <Card>
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Type className="w-5 h-5 text-accent" /> Text Overlay</h3>
                      <div className="space-y-4">
                        <Input
                          label="Text"
                          placeholder="Enter text to overlay on the image..."
                          value={imageOverlayText}
                          onChange={(e: any) => setImageOverlayText(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            label="Font"
                            value={imageOverlayFont}
                            onChange={(e: any) => setImageOverlayFont(e.target.value)}
                            options={['Arial', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Verdana']}
                          />
                          <Select
                            label="Position"
                            value={imageOverlayPosition}
                            onChange={(e: any) => setImageOverlayPosition(e.target.value)}
                            options={[
                              { value: 'top', label: 'Top' },
                              { value: 'center', label: 'Center' },
                              { value: 'bottom', label: 'Bottom' }
                            ]}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Slider
                            label="Size"
                            min="12"
                            max="120"
                            step="1"
                            value={imageOverlaySize}
                            onChange={(e: any) => setImageOverlaySize(parseInt(e.target.value))}
                            suffix="px"
                          />
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={imageOverlayColor}
                                onChange={(e) => setImageOverlayColor(e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10"
                              />
                              <span className="text-sm text-slate-600 dark:text-slate-300">{imageOverlayColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-accent" /> Result</h3>
                    {imageResult ? (
                      <div className="space-y-4">
                        <div className="relative w-full rounded-lg overflow-hidden">
                          <img src={imageResult} alt="Generated" className="w-full" />
                          {imageOverlayText && (
                            <div 
                              className={`absolute inset-0 flex justify-center pointer-events-none p-4 ${
                                imageOverlayPosition === 'top' ? 'items-start' : 
                                imageOverlayPosition === 'bottom' ? 'items-end' : 'items-center'
                              }`}
                            >
                              <span 
                                className="text-center break-words max-w-full leading-tight"
                                style={{ 
                                  fontFamily: imageOverlayFont, 
                                  fontSize: `${imageOverlaySize}px`, 
                                  color: imageOverlayColor,
                                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                                }}
                              >
                                {imageOverlayText}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleDownloadImageWithText}>
                          <Download className="w-4 h-4" /> Download Image
                        </Button>
                      </div>
                    ) : (
                      <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                        Generated image will appear here
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'bg-remover' && (
              <BackgroundRemover 
                user={user} 
                onRemoveBg={handleRemoveBackground} 
                loading={loading} 
                resultImage={bgRemoverResult} 
              />
            )}

            {activeTab === 'video' && (
              <VideoStudio 
                user={user} 
                onGenerate={handleGenerateVideo} 
                loading={loading} 
                videoPrompt={videoPrompt}
                setVideoPrompt={setVideoPrompt}
                videoMode={videoMode}
                setVideoMode={setVideoMode}
                videoResult={videoResult}
                videoProgress={videoProgress}
                videoTemplates={videoTemplates}
              />
            )}

            {activeTab === 'thumbnail' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Layout className="w-5 h-5 text-accent" /> Custom Thumbnail</h3>
                      <div className="mt-4">
                        <TextArea 
                          label="Visual Prompt" 
                          placeholder="Describe the thumbnail image..." 
                          value={thumbnailVisualPrompt}
                          onChange={(e: any) => setThumbnailVisualPrompt(e.target.value)}
                        />
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Button onClick={handleGenerateThumbnail} loading={loading} disabled={!thumbnailVisualPrompt}>
                          <Layout className="w-4 h-4" /> Generate Thumbnail (2 Credits)
                        </Button>
                      </div>
                    </Card>

                    <Card>
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> AI Suggestions</h3>
                      <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                          <Input 
                            placeholder="What is your video about? e.g., 'How to bake a chocolate cake'" 
                            value={thumbnailTopic}
                            onChange={(e: any) => setThumbnailTopic(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSuggestThumbnails} loading={isSuggestingThumbnails} disabled={!thumbnailTopic}>
                          Get Ideas (1 Credit)
                        </Button>
                      </div>

                      {thumbnailSuggestions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {thumbnailSuggestions.map((suggestion, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl p-4 hover:border-accent/30 transition-colors cursor-pointer" onClick={() => handleApplyThumbnailSuggestion(suggestion)}>
                              <div className="font-bold text-sm mb-2 text-slate-900 dark:text-white">"{suggestion.text}"</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{suggestion.visual_prompt}</div>
                              <div className="mt-3 text-xs text-accent font-medium">Click to apply</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Layout className="w-5 h-5 text-accent" /> Result</h3>
                      {thumbnailResult ? (
                        <div className="space-y-4">
                          <img src={thumbnailResult} alt="Generated Thumbnail" className="w-full rounded-lg border border-slate-300 dark:border-slate-700" />
                          <Button variant="outline" className="w-full" onClick={() => handleDownload(thumbnailResult, 'thumbnail.png')}>
                            <Download className="w-4 h-4" /> Download Thumbnail
                          </Button>
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                          Generated thumbnail will appear here
                        </div>
                      )}
                    </Card>
                  </div>
                </div>

                <Card>
                  <h3 className="font-bold mb-6 flex items-center gap-2"><Layout className="w-5 h-5 text-accent" /> Quick Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {thumbnailTemplates.map((template, idx) => (
                      <div 
                        key={idx} 
                        className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer hover:border-accent/50 transition-all"
                        onClick={() => handleApplyThumbnailSuggestion(template)}
                      >
                        <div className="aspect-video relative">
                          <img src={template.preview} alt={template.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-black text-xl text-center px-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                              {template.text}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900/80 backdrop-blur-sm">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{template.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{template.visual_prompt}</p>
                        </div>
                        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Button variant="outline" className="bg-slate-50 dark:bg-slate-950/80 border-accent text-accent hover:bg-accent hover:text-white">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h3 className="font-bold text-xl">Generation History</h3>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span>All data is automatically deleted after 24 hours</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {history?.map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 gap-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.1)]"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{item.prompt}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 whitespace-nowrap">-{item.credits_used} Credits</span>
                        <Button variant="outline" className="py-1 px-3 text-xs whitespace-nowrap" onClick={() => handleDownload(item.result_url, `result-${item.type}-${item.id}`)}>
                          Download Result
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {(!history || history.length === 0) && (
                    <div className="text-center py-12 text-slate-500">
                      No generations yet. Start creating!
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'feedback' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-accent" />
                    Feedback & Help
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Having issues or questions? Send us a message and our AI assistant will provide a solution in voice.
                  </p>
                  <div className="space-y-4">
                    <TextArea
                      placeholder="Describe your issue or ask a question..."
                      value={feedbackMessage}
                      onChange={(e: any) => setFeedbackMessage(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleFeedbackSubmit} loading={isSubmittingFeedback} disabled={!feedbackMessage}>
                        <Play className="w-4 h-4" /> Get Voice Solution
                      </Button>
                    </div>
                  </div>
                </Card>

                {feedbackResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="border-accent/30 bg-accent/5">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-accent" />
                        AI Voice Solution
                      </h3>
                      <div className="space-y-4">
                        <audio controls src={feedbackResponse} className="w-full" autoPlay />
                        {feedbackTextResponse && (
                          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {feedbackTextResponse}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-accent" />
                    Account Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6">
                      <div className="flex items-center gap-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-accent" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-accent">
                            <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">{user.email.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold mb-1">Email Address</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={onLogout}>
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold mb-1 text-red-400">Delete Account</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="danger" size="sm">Delete</Button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Sliders className="w-6 h-6 text-accent" />
                    Preferences
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6">
                      <div>
                        <h4 className="font-bold mb-1">Email Notifications</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your generations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold mb-1">Dark Mode</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark/light theme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent opacity-50 cursor-not-allowed"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-xl mb-1">Current Plan: <span className="text-accent capitalize">{user.subscription_tier === 'free' ? 'Free' : user.subscription_tier === 'limited' ? 'Premium' : user.subscription_tier}</span></h3>
                      <p className="text-slate-500 dark:text-slate-400">You have {user.credits} credits remaining.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowCreditModal(true)}>Get More Credits</Button>
                      {user.subscription_tier !== 'free' && (
                        <Button variant="outline">Manage Subscription</Button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-accent h-full" style={{ width: user.subscription_tier === 'limited' ? '100%' : `${Math.min(100, (user.credits / (user.subscription_tier === 'pro' ? 500 : 50)) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 text-right">Credits reset on the 1st of every month.</p>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-slate-300 dark:border-slate-700">
                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Perfect for trying out the tools.</p>
                    <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> 10 Credits / day</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> Limited AI Tools</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> Standard Speed</li>
                      <li className="flex items-center gap-2 text-slate-500"><X className="w-5 h-5" /> Watermark on Content</li>
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={user.subscription_tier === 'free' ? 'secondary' : 'outline'}
                      disabled={user.subscription_tier === 'free'}
                    >
                      {user.subscription_tier === 'free' ? 'Current Plan' : 'Downgrade'}
                    </Button>
                  </Card>
                  <Card className="border-accent relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Popular</div>
                    <h3 className="text-2xl font-bold mb-2">Pro</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">For serious content creators.</p>
                    <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> 500 Credits / month</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> Access to all AI tools</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> Faster generation speed</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-accent" /> No watermark</li>
                    </ul>
                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade('pro')}
                      disabled={user.subscription_tier === 'pro' || user.subscription_tier === 'limited' || upgradingPlan !== null}
                      variant={user.subscription_tier === 'pro' ? 'secondary' : 'primary'}
                    >
                      {upgradingPlan === 'pro' ? 'Processing...' : user.subscription_tier === 'pro' ? 'Current Plan' : user.subscription_tier === 'limited' ? 'Downgrade' : 'Upgrade to Pro'}
                    </Button>
                  </Card>
                  <Card className="border-purple-500 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Premium</div>
                    <h3 className="text-2xl font-bold mb-2">Premium</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Exclusive access and unlimited power.</p>
                    <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-purple-500" /> Unlimited Credits</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-purple-500" /> Priority AI processing</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-purple-500" /> Premium templates access</li>
                      <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 text-purple-500" /> API access</li>
                    </ul>
                    <Button 
                      className="w-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0" 
                      onClick={() => handleUpgrade('limited')}
                      disabled={user.subscription_tier === 'limited' || upgradingPlan !== null}
                    >
                      {upgradingPlan === 'limited' ? 'Processing...' : user.subscription_tier === 'limited' ? 'Current Plan' : 'Upgrade to Premium'}
                    </Button>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-accent" />
                    Referral Program
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Invite your friends to Studio Pro and earn free credits! For every friend who signs up using your unique referral link, you'll receive 50 bonus credits, and they'll get 50 bonus credits to start.
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8">
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Your Unique Referral Link</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-slate-800 dark:text-slate-200 break-all flex items-center">
                        {`${window.location.origin}?ref=${user.referral_code || user.uid.substring(0, 8).toUpperCase()}`}
                      </div>
                      <Button 
                        onClick={() => {
                          const link = `${window.location.origin}?ref=${user.referral_code || user.uid.substring(0, 8).toUpperCase()}`;
                          navigator.clipboard.writeText(link);
                          alert('Referral link copied to clipboard!');
                        }}
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copy Link
                      </Button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div className="text-3xl font-bold mb-1">{user.referral_count || 0}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Friends Referred</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                        <Sparkles className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="text-3xl font-bold mb-1 text-green-500">{user.total_referral_credits || 0}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Credits Earned</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'admin' && user.is_admin && (
              <AdminPanel />
            )}

            {activeTab === 'about' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-accent" /> About Us
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Studio Pro is an AI-powered content creation suite designed to help creators, marketers, and businesses scale their content production. Our mission is to democratize high-quality content creation through advanced artificial intelligence.</p>
                </Card>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" /> Contact Us
                  </h3>
                  <form className="space-y-4 max-w-md" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); setActiveTab('home'); }}>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
                      <input className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
                      <input type="email" className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Message</label>
                      <textarea className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all min-h-[120px]" required></textarea>
                    </div>
                    <Button type="submit">Send Message</Button>
                  </form>
                </Card>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" /> Privacy Policy
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">We take your privacy seriously. We only collect the information necessary to provide our services. Your generated content remains yours, and we do not use it to train our models without explicit consent. Please read our full policy for details on data handling and security measures.</p>
                </Card>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" /> Terms and Conditions
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">By using Studio Pro, you agree to our terms of service. You are responsible for the content you generate and must ensure it complies with local laws and regulations. We reserve the right to suspend accounts that violate our acceptable use policy.</p>
                </Card>
              </div>
            )}
          </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Credit Purchase Modal */}
      <AnimatePresence>
        {showCreditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreditModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-2xl w-full relative shadow-[0_16px_64px_rgba(0,0,0,0.5)] z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
              <button onClick={() => setShowCreditModal(false)} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white z-10">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-3xl font-bold mb-2">Buy More Credits</h2>
                <p className="text-slate-500 dark:text-slate-400">Top up your account to keep creating amazing content.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { amount: 500, price: 5, popular: false },
                  { amount: 1000, price: 10, popular: true },
                  { amount: 5000, price: 40, popular: false },
                ].map((pkg, i) => (
                  <div key={i} className={`relative p-6 rounded-2xl border ${pkg.popular ? 'border-accent bg-accent/5 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'} flex flex-col items-center text-center`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className="text-3xl font-bold mb-1">{pkg.amount}</div>
                    <div className="text-sm text-slate-500 mb-6">Credits</div>
                    <div className="text-2xl font-bold mb-6">${pkg.price}</div>
                    <Button 
                      className="w-full mt-auto" 
                      variant={pkg.popular ? 'primary' : 'outline'}
                      onClick={async () => {
                        try {
                          const { db, doc, updateDoc } = await import('./firebase');
                          const userRef = doc(db, 'users', user.uid);
                          await updateDoc(userRef, {
                            credits: user.credits + pkg.amount
                          });
                          setShowCreditModal(false);
                          alert(`Successfully purchased ${pkg.amount} credits!`);
                        } catch (e) {
                          console.error(e);
                          alert('Failed to purchase credits');
                        }
                      }}
                    >
                      Buy Now
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white z-10">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{upgradeMessage.title}</h2>
                <p className="text-slate-500 dark:text-slate-400">{upgradeMessage.desc}</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-accent" /> Access to Video Generation
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-accent" /> {user.subscription_tier === 'free' ? '500' : 'Unlimited'} Credits per month
                </div>
              </div>
              {user.subscription_tier === 'limited' ? (
                <Button className="w-full py-3 text-lg relative z-10" onClick={() => handleUpgrade('limited')} disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full py-3 text-lg relative z-10" 
                  onClick={() => handleUpgrade(user.subscription_tier === 'pro' ? 'limited' : 'pro')}
                  disabled={upgradingPlan !== null}
                >
                  {upgradingPlan !== null ? 'Processing...' : user.subscription_tier === 'pro' ? 'Upgrade to Premium - $19/mo' : 'Upgrade to Pro - $9/mo'}
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white z-10">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Select Payment Method</h2>
                <p className="text-slate-500 dark:text-slate-400">Choose how you want to pay for your {selectedPlanForPayment === 'limited' ? 'Premium' : 'Pro'} plan.</p>
              </div>
              <div className="space-y-4 mb-8 relative z-10">
                <button
                  onClick={() => handleProcessPayment('stripe')}
                  disabled={upgradingPlan !== null}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-accent dark:hover:border-accent transition-colors bg-white/50 dark:bg-slate-800/50 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#635BFF]/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#635BFF]" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Stripe</div>
                      <div className="text-xs text-slate-500">Credit Card, Apple Pay, Google Pay</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleProcessPayment('razorpay')}
                  disabled={upgradingPlan !== null}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-accent dark:hover:border-accent transition-colors bg-white/50 dark:bg-slate-800/50 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#02042B]/10 dark:bg-[#02042B]/30 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#02042B] dark:text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Razorpay</div>
                      <div className="text-xs text-slate-500">UPI, NetBanking, Cards (India)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              {upgradingPlan !== null && (
                <div className="text-center text-sm text-accent animate-pulse relative z-10">
                  Processing payment securely...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { db, collection, getDocs, doc, getDoc, query, orderBy } = await import('./firebase');
        
        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList = usersSnap.docs.map(doc => doc.data() as User);
        setUsers(usersList);

        // Fetch generations
        const gensQuery = query(collection(db, 'generations'), orderBy('created_at', 'desc'));
        const gensSnap = await getDocs(gensQuery);
        
        const now = new Date().getTime();
        const validGens = [];
        
        for (const docSnap of gensSnap.docs) {
          const gen = { id: docSnap.id, ...docSnap.data() } as Generation;
          const genTime = new Date(gen.created_at).getTime();
          const hoursDiff = (now - genTime) / (1000 * 60 * 60);
          
          if (hoursDiff <= 24) {
            validGens.push(gen);
          }
        }
        setGenerations(validGens);

        // Fetch settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings);
        } else {
          // Default settings if none exist
          setSettings({
            primary_color: '#0f172a',
            accent_color: '#3b82f6',
            hero_headline: 'Create viral content in minutes with AI.',
            hero_cta: 'Start Creating for Free',
            theme: 'dark'
          });
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const { db, doc, setDoc } = await import('./firebase');
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('Settings saved');
    } catch (err) {
      console.error("Error saving settings:", err);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="text-xl font-bold mb-6">Site Settings</h3>
        {settings && (
          <div className="space-y-4">
            <Input label="Hero Headline" value={settings.hero_headline} onChange={(e: any) => setSettings({...settings, hero_headline: e.target.value})} />
            <Input label="Hero CTA" value={settings.hero_cta} onChange={(e: any) => setSettings({...settings, hero_cta: e.target.value})} />
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        )}
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Users</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">Note: User passwords are encrypted by Firebase and are not visible or accessible to administrators for security reasons. You can manage user access and credits here.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Tier</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.uid} className="border-b border-slate-200 dark:border-slate-800/50">
                  <td className="py-3">{u.email}</td>
                  <td className="py-3 capitalize">{u.subscription_tier}</td>
                  <td className="py-3">{u.credits}</td>
                  <td className="py-3 text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-6">All Generations (Last 24 Hours)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-medium">User ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Prompt</th>
                <th className="pb-3 font-medium">Result</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {generations.map(g => (
                <tr key={g.id} className="border-b border-slate-200 dark:border-slate-800/50">
                  <td className="py-3 truncate max-w-[100px]" title={g.userId}>{g.userId.substring(0, 8)}...</td>
                  <td className="py-3 capitalize">{g.type}</td>
                  <td className="py-3 truncate max-w-[200px]" title={g.prompt}>{g.prompt}</td>
                  <td className="py-3">
                    {g.result_url && (
                      <a href={g.result_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">View</a>
                    )}
                  </td>
                  <td className="py-3 text-slate-500">{new Date(g.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    let userUnsubscribe: (() => void) | undefined;
    
    const initAuth = async () => {
      try {
        const { auth, onAuthStateChanged, db, doc, onSnapshot } = await import('./firebase');
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (userUnsubscribe) {
            userUnsubscribe();
            userUnsubscribe = undefined;
          }
          
          if (firebaseUser) {
            try {
              const userRef = doc(db, 'users', firebaseUser.uid);
              userUnsubscribe = onSnapshot(userRef, async (userSnap) => {
                if (userSnap.exists()) {
                  setUser(userSnap.data() as User);
                } else {
                  // Create user if it doesn't exist (e.g., from a previous failed login attempt)
                  const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    credits: 50,
                    is_admin: false,
                    subscription_tier: 'free',
                    created_at: new Date().toISOString()
                  };
                  await import('./firebase').then(({ setDoc }) => setDoc(userRef, userData));
                  setUser(userData as User);
                }
                setLoading(false);
              });
            } catch (err) {
              console.error("Error fetching user data:", err);
              setUser(null);
              setLoading(false);
            }
          } else {
            setUser(null);
            setLoading(false);
          }
        });

        return () => {
          unsubscribe();
          if (userUnsubscribe) userUnsubscribe();
        };
      } catch (err) {
        console.error("Firebase initialization failed:", err);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  const renderStaticPage = () => {
    let content = null;
    let title = "";
    switch (activePage) {
      case 'about':
        title = "About Us";
        content = <p className="text-[var(--text)] leading-relaxed">Studio Pro is an AI-powered content creation suite designed to help creators, marketers, and businesses scale their content production. Our mission is to democratize high-quality content creation through advanced artificial intelligence.</p>;
        break;
      case 'contact':
        title = "Contact Us";
        content = (
          <form className="space-y-4 max-w-md" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); setActivePage('home'); }}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--muted)]">Name</label>
              <input className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--muted)]">Email</label>
              <input type="email" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--muted)]">Message</label>
              <textarea className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition-all min-h-[120px]" required></textarea>
            </div>
            <button type="submit" className="bg-[var(--orange)] hover:bg-[var(--orange-bright)] text-white px-6 py-3 rounded-xl font-medium transition-colors">Send Message</button>
          </form>
        );
        break;
      case 'privacy':
        title = "Privacy Policy";
        content = <p className="text-[var(--text)] leading-relaxed">We take your privacy seriously. We only collect the information necessary to provide our services. Your generated content remains yours, and we do not use it to train our models without explicit consent. Please read our full policy for details on data handling and security measures.</p>;
        break;
      case 'terms':
        title = "Terms and Conditions";
        content = <p className="text-[var(--text)] leading-relaxed">By using Studio Pro, you agree to our terms of service. You are responsible for the content you generate and must ensure it complies with local laws and regulations. We reserve the right to suspend accounts that violate our acceptable use policy.</p>;
        break;
    }

    return (
      <div className="min-h-screen bg-[var(--black)] text-[var(--text)] p-8 relative z-10 font-sans">
        <button onClick={() => setActivePage('home')} className="text-[var(--muted)] hover:text-[var(--orange-bright)] flex items-center gap-2 mb-8 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Home
        </button>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 font-display text-[var(--white)]">{title}</h1>
          <div className="p-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[0_8px_32px_0_rgba(255,107,0,0.05)]">
            {content}
          </div>
        </div>
      </div>
    );
  };

  if (activePage !== 'home') {
    return renderStaticPage();
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={async () => { 
          console.log("Logout button clicked");
          try {
            const { auth, signOut } = await import('./firebase');
            await signOut(auth);
            console.log("Firebase signOut successful");
            setUser(null); 
          } catch (error) {
            console.error("Logout error:", error);
            alert("Failed to logout. Please try again.");
          }
        }} />
      ) : showAuth ? (
        <AuthPage onAuth={(data: any) => {
          setUser(data.user);
          setShowAuth(false);
        }} onBack={() => setShowAuth(false)} />
      ) : (
        <LandingPage onLogin={() => setShowAuth(true)} onNavigate={setActivePage} />
      )}
      <CookieConsent />
    </>
  );
}
