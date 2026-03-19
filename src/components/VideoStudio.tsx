import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ChevronDown } from 'lucide-react';

const Select = ({ label, value, onChange, options, title }: any) => (
  <div className="space-y-1.5" title={title}>
    {label && <label className="text-xs font-medium text-black dark:text-slate-400 uppercase ml-1 tracking-wider">{label}</label>}
    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] group-hover:bg-slate-800/50 cursor-pointer"
      >
        {options.map((opt: any) => (
          <option key={opt.value || opt} value={opt.value || opt} className="bg-slate-100 dark:bg-slate-900 text-black dark:text-slate-200">
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black dark:text-slate-400 group-hover:text-accent transition-colors">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-gradient-to-br from-accent to-orange-600 text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] border border-slate-200 dark:border-white/10',
    secondary: 'bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md text-black dark:text-slate-200 hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
    outline: 'border border-slate-300 dark:border-slate-600 text-black dark:text-slate-300 hover:bg-slate-800/50 backdrop-blur-sm shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
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
    className={`bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl p-6 hover:shadow-[0_12px_40px_0_rgba(249,115,22,0.1)] transition-shadow duration-300 relative overflow-hidden group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

const TextArea = ({ label, ...props }: any) => (
  <div className="space-y-1.5 relative">
    {label && <label className="text-sm font-medium text-black dark:text-slate-300 ml-1">{label}</label>}
    <div className="relative group">
      <textarea
        {...props}
        rows={4}
        className="w-full bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group-hover:border-white/20"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50" />
    </div>
  </div>
);

const VideoStudio = ({ 
  user,
  onGenerate, 
  loading, 
  videoPrompt, 
  setVideoPrompt, 
  videoMode, 
  setVideoMode, 
  videoResult,
  videoProgress,
  videoTemplates
}: any) => {
  const [negativePrompt, setNegativePrompt] = React.useState('');
  const [cameraMotion, setCameraMotion] = React.useState('None');
  const [multiScene, setMultiScene] = React.useState(false);
  const [aspectRatio, setAspectRatio] = React.useState('16:9');
  const [duration, setDuration] = React.useState('5s');

  const handleGenerateClick = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
      }
    }
    // Pass the advanced settings to the parent component
    onGenerate({ negativePrompt, cameraMotion, multiScene, aspectRatio, duration });
  };

  return (
    <div className="space-y-6">
      {videoTemplates && videoTemplates.length > 0 && (
        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center bg-accent/20 text-accent rounded-full text-xs">★</span>
            Video Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoTemplates.map((template: any, idx: number) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-shadow duration-300 group shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(249,115,22,0.2)]"
                onClick={() => {
                  setVideoPrompt(template.prompt);
                  setVideoMode(template.mode);
                  if (template.aspectRatio) setAspectRatio(template.aspectRatio);
                  if (template.cameraMotion) setCameraMotion(template.cameraMotion);
                  if (template.multiScene !== undefined) setMultiScene(template.multiScene);
                  if (template.negativePrompt !== undefined) setNegativePrompt(template.negativePrompt);
                }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={template.preview} 
                    alt={template.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                    <span className="text-sm font-bold text-white mb-1">{template.title}</span>
                    <span className="text-xs text-slate-300 line-clamp-2">{template.prompt}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <TextArea 
          label="Video Prompt" 
          placeholder="e.g., A cinematic shot of a futuristic city at night..."
          value={videoPrompt}
          onChange={(e: any) => setVideoPrompt(e.target.value)}
        />
        <div className="mt-4">
          <TextArea 
            label="Negative Prompt (Optional)" 
            placeholder="What should NOT be in the video..."
            value={negativePrompt}
            onChange={(e: any) => setNegativePrompt(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select
            label="Video Style"
            title="Select the visual style for your generated video"
            value={videoMode}
            onChange={(e: any) => setVideoMode(e.target.value)}
            options={[
              'Cinematic', 'Short Film', 'Advertisement', 'Music Video', 
              'Explainer Video', 'Hyper-realistic', 'Anime', 'Stop Motion', 
              'Claymation', 'Pixel Art', 'Low Poly', 'Sketch Animation'
            ]}
          />
          <Select
            label="Aspect Ratio"
            title="16:9 for YouTube/Desktop, 9:16 for TikTok/Reels/Shorts"
            value={aspectRatio}
            onChange={(e: any) => setAspectRatio(e.target.value)}
            options={['16:9', '9:16']}
          />
          <Select
            label="Duration"
            title="Select the length of the generated video"
            value={duration}
            onChange={(e: any) => setDuration(e.target.value)}
            options={[
              { label: '5 Seconds (Standard)', value: '5s' },
              { label: '12 Seconds (Extended)', value: '12s' }
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select
            label="Camera Motion"
            value={cameraMotion}
            onChange={(e: any) => setCameraMotion(e.target.value)}
            options={[
              'None', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Tilt Up', 'Tilt Down'
            ]}
          />
          <div className="space-y-1.5 flex flex-col justify-center">
             <label className="flex items-center gap-2 text-sm font-medium text-black dark:text-slate-300 cursor-pointer mt-4 p-3 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl hover:border-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group">
              <input 
                type="checkbox" 
                className="rounded border-slate-700 bg-slate-800 text-accent focus:ring-accent"
                checked={multiScene}
                onChange={(e) => setMultiScene(e.target.checked)}
              />
              Enable Multi-Scene Generation
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleGenerateClick} loading={loading} disabled={!videoPrompt}>
            Generate Video ({duration === '12s' ? '50' : '25'} Credits)
          </Button>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {videoProgress && !videoResult && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card>
              <div className="flex items-center gap-3 text-accent">
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                <span className="font-medium">{videoProgress}</span>
              </div>
            </Card>
          </motion.div>
        )}

        {videoResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card>
              <h3 className="font-bold mb-4">Your Generated Video</h3>
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-2xl shadow-black/50 mb-4">
                <video src={videoResult} controls className="w-full h-full object-cover" />
                {user?.subscription_tier === 'free' && (
                  <div className="absolute bottom-4 right-4 pointer-events-none opacity-50 bg-black/50 px-2 py-1 rounded text-white text-xs font-bold tracking-widest">
                    CREATED WITH AI STUDIO
                  </div>
                )}
              </div>
              <Button className="w-full" variant="outline" onClick={() => {
                const a = document.createElement('a');
                a.href = videoResult;
                a.download = 'generated-video.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}>
                <Download className="w-4 h-4 mr-2" /> Download Video
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoStudio;
