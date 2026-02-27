import React, { useState, useEffect } from 'react';
import { 
  Mic, Image as ImageIcon, Video, Layout, Settings, 
  History, LogOut, User as UserIcon, CreditCard, 
  ChevronRight, Play, Download, Sparkles, Plus,
  Menu, X, Check, AlertCircle, Trash2, Edit3,
  Monitor, Palette, Type, Sliders, BookOpen, Lightbulb, List, MessageSquare,
  Scissors, Sun, Contrast, Droplets, Wand2, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from './services/geminiService';
import { User, Generation, SiteSettings } from './types';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }: any) => {
  const variants: any = {
    primary: 'bg-accent text-white hover:opacity-90',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
    outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
    <input
      {...props}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
    />
  </div>
);

const TextArea = ({ label, ...props }: any) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
    <textarea
      {...props}
      rows={4}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
    />
  </div>
);

const AdPlaceholder = ({ format = 'horizontal' }: { format?: 'horizontal' | 'vertical' | 'rectangle' }) => {
  const styles = {
    horizontal: 'w-full h-[90px]',
    vertical: 'w-[300px] h-[600px]',
    rectangle: 'w-[300px] h-[250px]'
  };
  
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-lg flex flex-col items-center justify-center text-slate-500 my-4 ${styles[format]}`}>
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
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-300">
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

const LandingPage = ({ onLogin }: any) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings').then(res => res.json()).then(setSettings);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-accent/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Studio Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
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
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Introducing AI Creator Studio Pro 2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
          >
            {settings?.hero_headline || 'The All-in-One AI Creator OS'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Generate ultra-realistic voices, stunning images, and multi-scene videos in seconds. The professional toolkit for modern creators.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button onClick={onLogin} className="text-lg px-8 py-4 rounded-full shadow-xl shadow-accent/20 hover:scale-105 transition-transform">
              {settings?.hero_cta || 'Start Creating for Free'} <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4 rounded-full border-white/10 hover:bg-white/5">
              View Showcase
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24 w-full max-w-6xl relative z-10"
        >
          <div className="aspect-[16/9] rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-slate-950/50">
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
      <section id="features" className="py-32 px-6 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to go viral.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Stop juggling 10 different subscriptions. Studio Pro combines the best AI models into one seamless workflow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mic, title: 'AI Voice Engine', desc: 'Ultra-realistic ElevenLabs-style voices with emotion control and pacing adjustments.' },
              { icon: ImageIcon, title: 'Image Generator', desc: 'Grok-style high-fidelity images with style presets, from photorealistic to 3D cartoon.' },
              { icon: Video, title: 'Video Generator', desc: 'Multi-scene AI videos with automatic narration, subtitles, and smooth transitions.' },
              { icon: Layout, title: 'Thumbnail Maker', desc: 'Auto-generated YouTube thumbnails with bold overlays optimized for high CTR.' }
            ].map((f, i) => (
              <Card key={i} className="bg-slate-900/50 border-white/5 hover:border-accent/50 hover:bg-slate-900 transition-all duration-300 group">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                  <f.icon className="w-7 h-7 text-slate-300 group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-slate-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">From idea to published in minutes.</h2>
              <p className="text-xl text-slate-400 mb-12">Our Story Assistant guides you through the entire creative process. Just provide a topic, and we handle the rest.</p>
              
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Brainstorm & Outline', desc: 'Generate viral concepts and structured outlines tailored to your niche.' },
                  { step: '02', title: 'Generate Assets', desc: 'Create consistent characters, stunning scenes, and professional voiceovers.' },
                  { step: '03', title: 'Edit & Export', desc: 'Combine everything in our timeline editor, add text overlays, and export in 4K.' }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-2xl font-bold text-accent/50 font-mono">{s.step}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                      <p className="text-slate-400">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-accent/10 absolute -inset-4 blur-3xl" />
              <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-white/5">
                    <MessageSquare className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-medium">"Create a story about a cyberpunk detective"</p>
                      <p className="text-xs text-slate-400">User Prompt</p>
                    </div>
                  </div>
                  <div className="flex justify-center py-2">
                    <div className="w-px h-8 bg-gradient-to-b from-accent to-transparent" />
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-xl border border-accent/20">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-medium">Generating 5 Scene Outline...</p>
                      <p className="text-xs text-accent/70">AI Story Assistant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to scale your content?</h2>
          <p className="text-xl text-slate-400 mb-10">Join thousands of creators who are building their audience faster with Studio Pro.</p>
          <Button onClick={onLogin} className="text-lg px-10 py-5 rounded-full shadow-xl shadow-accent/20 hover:scale-105 transition-transform">
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="font-bold text-xl tracking-tight">Studio Pro</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Features</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Pricing</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact Us</a>
          </div>
          <p className="text-sm text-slate-600">© 2026 AI Creator Studio Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const AuthPage = ({ onAuth }: any) => {
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
      const res = await fetch(`/api/auth/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAuth(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400">{isLogin ? 'Sign in to your studio' : 'Start your 30 free credits today'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
          {error && <div className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
          <Button type="submit" className="w-full" loading={loading}>{isLogin ? 'Sign In' : 'Sign Up'}</Button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline text-sm">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};

const Dashboard = ({ user, onLogout, settings }: any) => {
  const [activeTab, setActiveTab] = useState('voice');
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tool States
  const [voiceText, setVoiceText] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState('English');
  const [voicePreset, setVoicePreset] = useState('Kore (Female, Professional)');
  const [voiceResult, setVoiceResult] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageResult, setImageResult] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoMode, setVideoMode] = useState('YouTube Automation');
  const [videoResult, setVideoResult] = useState<any[]>([]);
  const [thumbnailText, setThumbnailText] = useState('');
  const [thumbnailVisualPrompt, setThumbnailVisualPrompt] = useState('');
  const [thumbnailResult, setThumbnailResult] = useState('');
  const [videoScenes, setVideoScenes] = useState<any[]>([]);
  const [videoProgress, setVideoProgress] = useState('');
  const [thumbnailSuggestions, setThumbnailSuggestions] = useState<any[]>([]);

  // Story Assistant States
  const [storyInput, setStoryInput] = useState('');
  const [storyMode, setStoryMode] = useState<'brainstorm' | 'outline' | 'suggestions'>('brainstorm');
  const [storyResult, setStoryResult] = useState<any>(null);
  const [storyLoading, setStoryLoading] = useState(false);

  // Editor States
  const [editorScenes, setEditorScenes] = useState<any[]>([]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [textOverlay, setTextOverlay] = useState('');
  const [sceneTransitions, setSceneTransitions] = useState<string[]>([]);
  const [colorSettings, setColorSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100
  });

  const handleSendToEditor = (scenes: any[]) => {
    setEditorScenes(scenes);
    setSceneTransitions(new Array(scenes.length - 1).fill('fade'));
    setActiveTab('editor');
  };

  const handleApplyThumbnailSuggestion = (suggestion: any) => {
    setThumbnailText(suggestion.text);
    setThumbnailVisualPrompt(suggestion.visual_prompt);
    setActiveTab('thumbnail');
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const checkCredits = (required: number, requiresPremium: boolean = false) => {
    if (requiresPremium && user.subscription_tier === 'free') {
      setShowUpgradeModal(true);
      return false;
    }
    if (user.credits < required) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const handleUpgrade = async (plan: string) => {
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan })
      });
      if (res.ok) {
        const data = await res.json();
        user.subscription_tier = data.user.subscription_tier;
        user.credits = data.user.credits;
        setShowUpgradeModal(false);
        alert(`Successfully upgraded to ${plan} plan!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStoryAssistant = async () => {
    if (!checkCredits(2, true)) return;
    setStoryLoading(true);
    try {
      const result = await geminiService.storyAssistant(storyMode, storyInput);
      setStoryResult(result);
    } catch (err) {
      alert("Story assistant failed");
    } finally {
      setStoryLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!checkCredits(15, true)) return;
    setLoading(true);
    setVideoProgress('Writing Story...');
    try {
      const scenes = await geminiService.generateStory(videoPrompt, videoMode);
      setVideoScenes(scenes);
      
      const processedScenes = [];
      for (let i = 0; i < scenes.length; i++) {
        setVideoProgress(`Generating Scene ${i + 1}...`);
        
        let finalImagePrompt = scenes[i].scene_description;
        if (videoMode === '3D Grok Style') {
          finalImagePrompt += ", highly detailed 3D render, Grok aesthetic, futuristic, vibrant, cinematic lighting, Unreal Engine 5 style, 8k resolution";
        } else if (videoMode === 'Kids Cartoon') {
          finalImagePrompt += ", 3D kids cartoon style, Pixar style, bright colors, cute, soft lighting";
        } else if (videoMode === 'Tutorial Mode') {
          finalImagePrompt += ", clean UI mockup, screen recording style, professional, modern interface, clear typography, minimalist background";
        } else if (videoMode === 'Explainer Video Mode') {
          finalImagePrompt += ", flat vector illustration, corporate memphis style, clean lines, vibrant colors, infographic style, professional explainer video animation style";
        }

        const imageUrl = await geminiService.generateImage(finalImagePrompt);
        setVideoProgress(`Generating Voice for Scene ${i + 1}...`);
        const voiceUrl = await geminiService.generateVoice(scenes[i].narration);
        processedScenes.push({ ...scenes[i], imageUrl, voiceUrl });
      }
      
      setVideoProgress('Animating & Rendering...');
      // Simulate rendering delay
      await new Promise(r => setTimeout(r, 2000));
      
      setVideoResult(processedScenes);
      setVideoProgress('Suggesting Thumbnails...');
      
      try {
        const suggestions = await geminiService.suggestThumbnails(videoPrompt);
        setThumbnailSuggestions(suggestions);
      } catch (e) {
        console.error("Failed to suggest thumbnails", e);
      }

      setVideoProgress('');
      await trackGeneration('video', videoPrompt, 'video_placeholder_url', 15);
    } catch (err) {
      alert("Video generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!checkCredits(2)) return;
    setLoading(true);
    try {
      let bgImageSrc = '';
      if (thumbnailVisualPrompt) {
        bgImageSrc = await geminiService.generateImage(thumbnailVisualPrompt + ", YouTube thumbnail background, high quality, 16:9", "16:9");
      }

      // Simple canvas-based thumbnail generation
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d')!;
      
      if (bgImageSrc) {
        const img = new Image();
        img.src = bgImageSrc;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        ctx.drawImage(img, 0, 0, 1280, 720);
      } else {
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1280, 720);
      }
      
      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 80px Inter';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black';
      ctx.strokeText(thumbnailText, 640, 360);
      ctx.fillText(thumbnailText, 640, 360);
      
      const url = canvas.toDataURL('image/png');
      setThumbnailResult(url);
      await trackGeneration('thumbnail', thumbnailText, url, 2);
    } catch (err) {
      alert("Thumbnail generation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch('/api/generations/history', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setHistory(data);
  };

  const trackGeneration = async (type: string, prompt: string, url: string, credits: number) => {
    await fetch('/api/generations/track', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ type, prompt, result_url: url, credits_used: credits })
    });
    fetchHistory();
    // Update local user credits (simplified)
    user.credits -= credits;
  };

  const handleGenerateVoice = async () => {
    if (!checkCredits(3)) return;
    setLoading(true);
    try {
      // Extract the base voice name (Kore, Puck, etc.)
      const baseVoice = voicePreset.split(' ')[0];
      const style = voicePreset.split('(')[1].replace(')', '');
      
      const prompt = `Speak in ${voiceLanguage} with a ${style} voice: ${voiceText}`;
      const url = await geminiService.generateVoice(prompt, baseVoice);
      setVoiceResult(url);
      await trackGeneration('voice', voiceText, url, 3);
    } catch (err) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!checkCredits(4)) return;
    setLoading(true);
    try {
      const url = await geminiService.generateImage(imagePrompt);
      setImageResult(url);
      await trackGeneration('image', imagePrompt, url, 4);
    } catch (err) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'voice', icon: Mic, label: 'Voice Studio' },
    { id: 'image', icon: ImageIcon, label: 'Image Studio' },
    { id: 'video', icon: Video, label: 'Video Studio', isPremium: true },
    { id: 'story', icon: BookOpen, label: 'Story Assistant', isPremium: true },
    { id: 'editor', icon: Scissors, label: 'Video Editor' },
    { id: 'thumbnail', icon: Layout, label: 'Thumbnails' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
  ];

  if (user.is_admin) {
    menuItems.push({ id: 'admin', icon: Settings, label: 'Admin Panel' });
  }

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">
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

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-slate-950 border-r border-slate-800 transition-all duration-300
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {(sidebarOpen || mobileMenuOpen) && <span className="font-bold text-lg tracking-tight">Studio Pro</span>}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.isPremium && user.subscription_tier === 'free') {
                  setShowUpgradeModal(true);
                  return;
                }
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-accent text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {(sidebarOpen || mobileMenuOpen) && <span>{item.label}</span>}
              </div>
              {(sidebarOpen || mobileMenuOpen) && item.isPremium && user.subscription_tier === 'free' && (
                <span className="text-[9px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Credits</span>
              <span className="text-xs font-bold text-accent">{user.credits}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full" style={{ width: `${(user.credits / 30) * 100}%` }} />
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            {(sidebarOpen || mobileMenuOpen) && <span>Logout</span>}
          </button>
          {(sidebarOpen || mobileMenuOpen) && (
            <div className="mt-4">
              <AdPlaceholder format="rectangle" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-slate-400 hover:bg-slate-900 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="hidden lg:flex p-2 text-slate-400 hover:bg-slate-900 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold">{menuItems.find(m => m.id === activeTab)?.label}</h1>
              <p className="hidden sm:block text-xs lg:text-sm text-slate-400">Welcome back, {user.email.split('@')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Button variant="outline" className="hidden md:flex py-1.5 text-sm" onClick={() => setShowUpgradeModal(true)}>
              <Sparkles className="w-4 h-4" /> Upgrade
            </Button>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <UserIcon className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <div className="mb-6">
            <AdPlaceholder format="horizontal" />
          </div>
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'voice' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <TextArea 
                      label="Script" 
                      placeholder="Type or paste your script here..." 
                      value={voiceText}
                      onChange={(e: any) => setVoiceText(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Language</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                          value={voiceLanguage}
                          onChange={(e) => setVoiceLanguage(e.target.value)}
                        >
                          {[
                            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Korean', 
                            'Chinese (Mandarin)', 'Arabic', 'Hindi', 'Bengali', 'Turkish', 'Vietnamese', 'Polish', 'Ukrainian', 'Thai', 'Indonesian',
                            'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek', 'Czech', 'Romanian', 'Hungarian', 'Hebrew', 'Malay', 'Tagalog'
                          ].map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Voice Preset</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                          value={voicePreset}
                          onChange={(e) => setVoicePreset(e.target.value)}
                        >
                          {[
                            // Professional & Standard
                            'Kore (Female, Professional)', 'Puck (Male, Friendly)', 'Fenrir (Male, Deep)', 'Zephyr (Female, Soft)', 'Charon (Male, Authoritative)',
                            
                            // Emotional Tones
                            'Kore (Female, Happy)', 'Puck (Male, Sad)', 'Fenrir (Male, Angry)', 'Zephyr (Female, Excited)', 'Charon (Male, Calm)',
                            'Kore (Female, Cheerful)', 'Puck (Male, Energetic)', 'Fenrir (Male, Dramatic)', 'Zephyr (Female, Melancholic)', 'Charon (Male, Wise)',
                            'Kore (Female, Sarcastic)', 'Puck (Male, Nervous)', 'Fenrir (Male, Grumpy)', 'Zephyr (Female, Fearful)', 'Charon (Male, Disgusted)',
                            'Kore (Female, Empathetic)', 'Puck (Male, Apologetic)', 'Fenrir (Male, Aggressive)', 'Zephyr (Female, Hopeful)', 'Charon (Male, Bored)',
                            
                            // Accents & Regional
                            'Kore (Female, British Accent)', 'Puck (Male, Southern US Accent)', 'Fenrir (Male, Scottish Accent)', 'Zephyr (Female, Australian Accent)', 'Charon (Male, Irish Accent)',
                            'Kore (Female, French Accent)', 'Puck (Male, New York Accent)', 'Fenrir (Male, Russian Accent)', 'Zephyr (Female, Valley Girl)', 'Charon (Male, Transatlantic Accent)',
                            'Kore (Female, Spanish Accent)', 'Puck (Male, Italian Accent)', 'Fenrir (Male, German Accent)', 'Zephyr (Female, Japanese Accent)', 'Charon (Male, Indian Accent)',
                            
                            // Stylized & Character
                            'Kore (Female, Storyteller)', 'Puck (Male, Casual)', 'Fenrir (Male, Villainous)', 'Zephyr (Female, ASMR)', 'Charon (Male, Documentary)',
                            'Kore (Female, Robotic)', 'Puck (Male, Cartoonish)', 'Fenrir (Male, Heroic)', 'Zephyr (Female, Ethereal)', 'Charon (Male, Cinematic)',
                            'Kore (Female, Seductive)', 'Puck (Male, Pirate)', 'Fenrir (Male, Booming)', 'Zephyr (Female, Childlike)', 'Charon (Male, Raspy)',
                            'Kore (Female, News Anchor)', 'Puck (Male, Radio Host)', 'Fenrir (Male, Monster)', 'Zephyr (Female, Fairy)', 'Charon (Male, Ghostly)'
                          ].map(voice => (
                            <option key={voice} value={voice}>{voice}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateVoice} loading={loading} disabled={!voiceText}>
                        Generate Voice (3 Credits)
                      </Button>
                    </div>
                  </Card>

                  {voiceResult && (
                    <Card className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Generated Audio</p>
                          <p className="text-xs text-slate-500">Ready to download</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <audio src={voiceResult} controls className="h-8" />
                        <Button variant="outline" onClick={() => {
                          const a = document.createElement('a');
                          a.href = voiceResult;
                          a.download = 'voice.wav';
                          a.click();
                        }}><Download className="w-4 h-4" /></Button>
                      </div>
                    </Card>
                  )}
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4">Tips</h3>
                    <ul className="text-sm text-slate-400 space-y-2">
                      <li>• Use punctuation for natural pauses.</li>
                      <li>• Keep scripts under 500 characters for best quality.</li>
                      <li>• Try different voices for different moods.</li>
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <TextArea 
                      label="Prompt" 
                      placeholder="A futuristic city with neon lights and flying cars..." 
                      value={imagePrompt}
                      onChange={(e: any) => setImagePrompt(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Style</label>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                          <option>Realistic</option>
                          <option>Anime</option>
                          <option>Pixar 3D</option>
                          <option>Hyper-real</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Aspect Ratio</label>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                          <option>1:1</option>
                          <option>16:9</option>
                          <option>9:16</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateImage} loading={loading} disabled={!imagePrompt}>
                        Generate Image (4 Credits)
                      </Button>
                    </div>
                  </Card>

                  {imageResult && (
                    <Card className="p-2 overflow-hidden">
                      <img src={imageResult} alt="Generated" className="w-full rounded-lg" />
                      <div className="p-4 flex justify-between items-center">
                        <p className="text-sm text-slate-400 truncate max-w-xs">{imagePrompt}</p>
                        <Button variant="outline" onClick={() => {
                          const a = document.createElement('a');
                          a.href = imageResult;
                          a.download = 'image.png';
                          a.click();
                        }}><Download className="w-4 h-4" /> Download HD</Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Free', price: '$0', credits: '30', features: ['Standard Speed', 'Watermark', 'Basic Styles'] },
                    { name: 'Pro', price: '$29', credits: '2000', features: ['Fast Rendering', 'No Watermark', 'HD Export', 'All Styles'] },
                    { name: 'Agency', price: '$99', credits: 'Unlimited*', features: ['Commercial License', 'Priority Rendering', 'White-label', 'API Access'] }
                  ].map((plan, i) => (
                    <Card key={i} className={`relative ${i === 1 ? 'border-accent ring-1 ring-accent' : ''}`}>
                      {i === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Most Popular</div>}
                      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-slate-500 text-sm">/month</span>
                      </div>
                      <p className="text-sm font-medium text-accent mb-6">{plan.credits} Credits Included</p>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f, j) => (
                          <li key={j} className="text-sm text-slate-400 flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Button variant={i === 1 ? 'primary' : 'outline'} className="w-full">Upgrade Now</Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'video' && (
              <div className="space-y-8">
                <Card>
                  <TextArea 
                    label="Video Prompt" 
                    placeholder="A story about a robot who discovers a magic flower..." 
                    value={videoPrompt}
                    onChange={(e: any) => setVideoPrompt(e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Mode</label>
                      <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                        value={videoMode}
                        onChange={(e) => setVideoMode(e.target.value)}
                      >
                        <option value="YouTube Automation">YouTube Automation</option>
                        <option value="Kids Cartoon">Kids Cartoon</option>
                        <option value="3D Grok Style">3D Grok Style</option>
                        <option value="Tutorial Mode">Tutorial Mode</option>
                        <option value="Explainer Video Mode">Explainer Video Mode</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Duration</label>
                      <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                        <option>20 sec</option>
                        <option>45 sec</option>
                        <option>90 sec</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Ratio</label>
                      <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                        <option>16:9</option>
                        <option>9:16</option>
                        <option>1:1</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleGenerateVideo} loading={loading} disabled={!videoPrompt}>
                      Generate Video (15 Credits)
                    </Button>
                  </div>
                </Card>

                {videoProgress && (
                  <Card className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
                    <p className="text-lg font-medium">{videoProgress}</p>
                    <p className="text-sm text-slate-500">This may take a minute...</p>
                  </Card>
                )}

                {videoResult.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Generated Scenes</h3>
                      <Button onClick={() => handleSendToEditor(videoResult)}>
                        <Scissors className="w-4 h-4" /> Open in Editor
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videoResult.map((scene, i) => (
                        <Card key={i} className="p-0 overflow-hidden">
                          <img src={scene.imageUrl} alt={`Scene ${i+1}`} className="w-full aspect-video object-cover" />
                          <div className="p-4">
                            <p className="text-xs font-bold text-accent uppercase mb-1">Scene {i+1}</p>
                            <p className="text-sm text-slate-300 mb-4">{scene.narration}</p>
                            <audio src={scene.voiceUrl} controls className="w-full h-8" />
                          </div>
                        </Card>
                      ))}
                    </div>

                    {thumbnailSuggestions.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Layout className="w-5 h-5 text-accent" /> Suggested Thumbnails
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {thumbnailSuggestions.map((suggestion, i) => (
                            <Card key={i} className="hover:border-accent/50 transition-all cursor-pointer group" onClick={() => handleApplyThumbnailSuggestion(suggestion)}>
                              <div className="aspect-video bg-slate-800 rounded-lg mb-3 flex items-center justify-center p-4 text-center relative overflow-hidden">
                                <span className="text-sm font-bold z-10">{suggestion.text}</span>
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Visual Concept</p>
                              <p className="text-xs text-slate-400 line-clamp-2">{suggestion.visual_prompt}</p>
                              <div className="mt-3 flex justify-end">
                                <span className="text-[10px] text-accent font-bold flex items-center gap-1">
                                  Use This <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'story' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <div className="flex gap-2 mb-6 p-1 bg-slate-800 rounded-lg">
                      {[
                        { id: 'brainstorm', icon: Lightbulb, label: 'Brainstorm' },
                        { id: 'outline', icon: List, label: 'Outline' },
                        { id: 'suggestions', icon: MessageSquare, label: 'Suggestions' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setStoryMode(mode.id as any);
                            setStoryResult(null);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                            storyMode === mode.id ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <mode.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{mode.label}</span>
                        </button>
                      ))}
                    </div>

                    <TextArea 
                      label={
                        storyMode === 'brainstorm' ? 'Niche or Topic' :
                        storyMode === 'outline' ? 'Video Concept' : 'Story Concept'
                      }
                      placeholder={
                        storyMode === 'brainstorm' ? 'e.g. Tech reviews, Cooking for beginners...' :
                        storyMode === 'outline' ? 'e.g. A day in the life of a software engineer...' : 'e.g. A robot who discovers a magic flower...'
                      }
                      value={storyInput}
                      onChange={(e: any) => setStoryInput(e.target.value)}
                    />

                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleStoryAssistant} loading={storyLoading} disabled={!storyInput}>
                        Generate {storyMode.charAt(0).toUpperCase() + storyMode.slice(1)}
                      </Button>
                    </div>
                  </Card>

                  {storyResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card>
                        {storyMode === 'brainstorm' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-accent" /> Video Ideas
                            </h3>
                            <div className="grid gap-4">
                              {storyResult.map((idea: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-accent/30 transition-all">
                                  <h4 className="font-bold text-accent mb-1">{idea.title}</h4>
                                  <p className="text-sm text-slate-300">{idea.concept}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {storyMode === 'outline' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <List className="w-5 h-5 text-accent" /> Plot Outline
                            </h3>
                            <div className="space-y-4">
                              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Introduction</h4>
                                <p className="text-sm text-slate-200">{storyResult.introduction}</p>
                              </div>
                              <div className="grid gap-4">
                                {storyResult.acts.map((act: string, i: number) => (
                                  <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Act {i + 1}</h4>
                                    <p className="text-sm text-slate-200">{act}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Conclusion</h4>
                                <p className="text-sm text-slate-200">{storyResult.conclusion}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {storyMode === 'suggestions' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-accent" /> Narrative Suggestions
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-500 uppercase">Scene Transitions</h4>
                                <div className="space-y-2">
                                  {storyResult.transitions.map((t: string, i: number) => (
                                    <div key={i} className="flex gap-2 text-sm text-slate-300">
                                      <span className="text-accent">•</span> {t}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-500 uppercase">Character Development</h4>
                                <div className="space-y-2">
                                  {storyResult.character_development.map((c: string, i: number) => (
                                    <div key={i} className="flex gap-2 text-sm text-slate-300">
                                      <span className="text-accent">•</span> {c}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4">How it works</h3>
                    <div className="space-y-4 text-sm text-slate-400">
                      <div>
                        <p className="text-slate-200 font-medium mb-1">Brainstorm</p>
                        <p>Get 5 creative ideas for your next video based on your niche.</p>
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium mb-1">Outline</p>
                        <p>Transform a concept into a structured plot with intro, acts, and outro.</p>
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium mb-1">Suggestions</p>
                        <p>Enhance your story with professional transition and character tips.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Preview Area */}
                <div className="lg:col-span-3 space-y-6">
                  {editorScenes.length > 0 ? (
                    <>
                      <Card className="p-0 overflow-hidden relative">
                        <div 
                          className="w-full aspect-video bg-black flex items-center justify-center relative"
                          style={{
                            filter: `brightness(${colorSettings.brightness}%) contrast(${colorSettings.contrast}%) saturate(${colorSettings.saturation}%)`
                          }}
                        >
                          <img 
                            src={editorScenes[selectedSceneIndex].imageUrl} 
                            alt="Preview" 
                            className="max-h-full object-contain"
                          />
                          {textOverlay && (
                            <div className="absolute bottom-10 left-0 w-full text-center">
                              <span className="bg-black/60 text-white px-4 py-2 rounded text-2xl font-bold shadow-lg">
                                {textOverlay}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedSceneIndex(Math.max(0, selectedSceneIndex - 1))}
                              disabled={selectedSceneIndex === 0}
                            >Prev</Button>
                            <span className="text-sm font-medium">Scene {selectedSceneIndex + 1} of {editorScenes.length}</span>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedSceneIndex(Math.min(editorScenes.length - 1, selectedSceneIndex + 1))}
                              disabled={selectedSceneIndex === editorScenes.length - 1}
                            >Next</Button>
                          </div>
                          <Button variant="primary">
                            <Wand2 className="w-4 h-4" /> Export Final Video
                          </Button>
                        </div>
                      </Card>

                      {/* Timeline */}
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {editorScenes.map((scene, i) => (
                          <div 
                            key={i}
                            onClick={() => setSelectedSceneIndex(i)}
                            className={`flex-shrink-0 w-40 aspect-video rounded-lg border-2 cursor-pointer transition-all overflow-hidden relative ${
                              selectedSceneIndex === i ? 'border-accent scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={scene.imageUrl} className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 left-1 bg-black/50 px-1 rounded text-[10px]">S{i+1}</div>
                            {i < editorScenes.length - 1 && (
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-slate-800 rounded-full p-1 border border-slate-700 hover:scale-110 transition-transform cursor-pointer">
                                <select 
                                  className="bg-transparent text-[8px] uppercase font-bold text-white appearance-none cursor-pointer outline-none text-center w-4"
                                  value={sceneTransitions[i] || 'fade'}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newTransitions = [...sceneTransitions];
                                    newTransitions[i] = e.target.value;
                                    setSceneTransitions(newTransitions);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="fade" className="text-black">F</option>
                                  <option value="slide" className="text-black">S</option>
                                  <option value="zoom" className="text-black">Z</option>
                                  <option value="cut" className="text-black">C</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Card className="flex flex-col items-center justify-center py-32 text-slate-500">
                      <Scissors className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-lg">No video selected for editing</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab('video')}>
                        Go to Video Studio
                      </Button>
                    </Card>
                  )}
                </div>

                {/* Controls Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <div className="flex items-center gap-2 mb-4">
                      <Type className="w-4 h-4 text-accent" />
                      <h3 className="font-bold text-sm">Text Overlay</h3>
                    </div>
                    <Input 
                      placeholder="Add text to scene..." 
                      value={textOverlay}
                      onChange={(e: any) => setTextOverlay(e.target.value)}
                    />
                  </Card>

                  <Card>
                    <div className="flex items-center gap-2 mb-4">
                      <Wand2 className="w-4 h-4 text-accent" />
                      <h3 className="font-bold text-sm">Transition to Next Scene</h3>
                    </div>
                    <select 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      value={sceneTransitions[selectedSceneIndex] || 'fade'}
                      onChange={(e) => {
                        const newTransitions = [...sceneTransitions];
                        newTransitions[selectedSceneIndex] = e.target.value;
                        setSceneTransitions(newTransitions);
                      }}
                      disabled={selectedSceneIndex === editorScenes.length - 1}
                    >
                      <option value="fade">Cross Fade</option>
                      <option value="slide">Slide Left</option>
                      <option value="zoom">Zoom Blur</option>
                      <option value="cut">Hard Cut</option>
                    </select>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-4 h-4 text-accent" />
                      <h3 className="font-bold text-sm">Color Correction</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                          <span>Brightness</span>
                          <span>{colorSettings.brightness}%</span>
                        </div>
                        <input 
                          type="range" min="50" max="150" 
                          value={colorSettings.brightness}
                          onChange={(e) => setColorSettings({...colorSettings, brightness: parseInt(e.target.value)})}
                          className="w-full accent-accent" 
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                          <span>Contrast</span>
                          <span>{colorSettings.contrast}%</span>
                        </div>
                        <input 
                          type="range" min="50" max="150" 
                          value={colorSettings.contrast}
                          onChange={(e) => setColorSettings({...colorSettings, contrast: parseInt(e.target.value)})}
                          className="w-full accent-accent" 
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                          <span>Saturation</span>
                          <span>{colorSettings.saturation}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="200" 
                          value={colorSettings.saturation}
                          onChange={(e) => setColorSettings({...colorSettings, saturation: parseInt(e.target.value)})}
                          className="w-full accent-accent" 
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'thumbnail' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <Input 
                      label="Thumbnail Text" 
                      placeholder="HOW TO MAKE MONEY WITH AI" 
                      value={thumbnailText}
                      onChange={(e: any) => setThumbnailText(e.target.value)}
                    />
                    <div className="mt-4">
                      <TextArea 
                        label="Visual Prompt (Background)" 
                        placeholder="A futuristic city with neon lights..." 
                        value={thumbnailVisualPrompt}
                        onChange={(e: any) => setThumbnailVisualPrompt(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Background Style</label>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                          <option>Gradient Dark</option>
                          <option>Neon City</option>
                          <option>Abstract Blue</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Overlay Effect</label>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                          <option>Bold Stroke</option>
                          <option>Soft Shadow</option>
                          <option>Glow</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateThumbnail} loading={loading} disabled={!thumbnailText}>
                        Generate Thumbnail (2 Credits)
                      </Button>
                    </div>
                  </Card>

                  {thumbnailResult && (
                    <Card className="p-2 overflow-hidden">
                      <img src={thumbnailResult} alt="Thumbnail" className="w-full rounded-lg" />
                      <div className="p-4 flex justify-end">
                        <Button variant="outline" onClick={() => {
                          const a = document.createElement('a');
                          a.href = thumbnailResult;
                          a.download = 'thumbnail.png';
                          a.click();
                        }}><Download className="w-4 h-4" /> Download PNG</Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {history.map((item) => (
                  <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {item.type === 'voice' ? <Mic className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{item.type} Generation</p>
                        <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <span className="text-xs font-medium text-slate-500">{item.credits_used} Credits</span>
                      <Button variant="outline" size="sm" onClick={() => window.open(item.result_url, '_blank')}>View</Button>
                    </div>
                  </Card>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-20 text-slate-500">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No generations yet. Start creating!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admin' && (
              <AdminPanel settings={settings} />
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowUpgradeModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                <p className="text-slate-400">You've run out of free credits. Upgrade to unlock unlimited potential.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-accent rounded-xl bg-accent/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-bold mb-1">Pro Plan</h3>
                  <p className="text-3xl font-bold mb-4">$19<span className="text-sm text-slate-400 font-normal">/mo</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-accent" /> 500 Credits / month
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-accent" /> Priority Generation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-accent" /> No Watermarks
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => handleUpgrade('pro')}>Upgrade Now</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminPanel = ({ settings: initialSettings }: any) => {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      alert("Settings saved!");
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-accent" />
            <h3 className="font-bold">Theme Customizer</h3>
          </div>
          <div className="space-y-4">
            <Input 
              label="Primary Color" 
              type="color" 
              value={settings.primary_color} 
              onChange={(e: any) => setSettings({ ...settings, primary_color: e.target.value })} 
            />
            <Input 
              label="Accent Color" 
              type="color" 
              value={settings.accent_color} 
              onChange={(e: any) => setSettings({ ...settings, accent_color: e.target.value })} 
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Default Theme</label>
              <div className="flex gap-2">
                <Button 
                  variant={settings.theme === 'dark' ? 'primary' : 'outline'} 
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className="flex-1"
                >Dark</Button>
                <Button 
                  variant={settings.theme === 'light' ? 'primary' : 'outline'} 
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className="flex-1"
                >Light</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5 text-accent" />
            <h3 className="font-bold">Homepage Builder</h3>
          </div>
          <div className="space-y-4">
            <Input 
              label="Hero Headline" 
              value={settings.hero_headline} 
              onChange={(e: any) => setSettings({ ...settings, hero_headline: e.target.value })} 
            />
            <Input 
              label="Hero CTA Text" 
              value={settings.hero_cta} 
              onChange={(e: any) => setSettings({ ...settings, hero_cta: e.target.value })} 
            />
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-5 h-5 text-accent" />
            <h3 className="font-bold">Feature Toggles</h3>
          </div>
          <div className="space-y-3">
            {['Voice', 'Image', 'Video', 'Thumbnail', 'Story Builder'].map((f) => (
              <div key={f} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <span className="text-sm text-slate-300">{f}</span>
                <div className="w-10 h-5 bg-emerald-500/20 border border-emerald-500/50 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-accent" />
            <h3 className="font-bold">User Management</h3>
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {users.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="text-sm font-bold">{u.email}</p>
                  <p className="text-xs text-slate-400">Credits: {u.credits}</p>
                </div>
                {u.is_admin ? (
                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded uppercase font-bold">Admin</span>
                ) : (
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase font-bold">User</span>
                )}
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No users found.</p>
            )}
          </div>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading}>Save All Changes</Button>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (res.ok) return res.json();
        throw new Error();
      }).then(data => {
        setUser(data);
        setView('dashboard');
      }).catch(() => {
        localStorage.removeItem('token');
        setView('landing');
      });
    }

    fetch('/api/admin/settings').then(res => res.json()).then(data => {
      setSettings(data);
      // Apply theme colors
      document.documentElement.style.setProperty('--primary-color', data.primary_color);
      document.documentElement.style.setProperty('--accent-color', data.accent_color);
    });
  }, []);

  const handleAuth = (data: any) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('landing');
  };

  return (
    <div className={settings?.theme === 'light' ? 'light' : ''}>
      {view === 'landing' && <LandingPage onLogin={() => setView('auth')} />}
      {view === 'auth' && <AuthPage onAuth={handleAuth} />}
      {view === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} settings={settings} />}
      <CookieConsent />
    </div>
  );
}
