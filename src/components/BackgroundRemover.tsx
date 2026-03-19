import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Download, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

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

export const BackgroundRemover = ({ user, onRemoveBg, loading, resultImage }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    if (selectedImage && file) {
      onRemoveBg(selectedImage, file.type);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Background Remover
            </h3>
            <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">
              2 Credits
            </span>
          </div>

          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${
              selectedImage ? 'border-accent/50 bg-accent/5' : 'border-slate-200 dark:border-white/10 hover:border-accent/50 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md'
            }`}
          >
            {selectedImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 group">
                <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <Button variant="outline" className="border-white/20 hover:bg-white/10">Change Image</Button>
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center py-12">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="w-16 h-16 bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center mb-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] group-hover:shadow-[0_8px_32px_0_rgba(249,115,22,0.2)] transition-all duration-300">
                  <Upload className="w-8 h-8 text-black dark:text-slate-400 group-hover:text-accent transition-colors" />
                </div>
                <p className="text-lg font-medium mb-2">Click to upload image</p>
                <p className="text-sm text-black dark:text-slate-400">PNG, JPG up to 10MB</p>
              </label>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleRemove} 
              disabled={!selectedImage || loading} 
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing Background...
                </>
              ) : (
                'Remove Background'
              )}
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-black dark:text-slate-400" />
            Result
          </h3>
          <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative flex items-center justify-center">
            {/* Checkerboard pattern for transparency */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
            
            {loading ? (
              <div className="flex flex-col items-center text-black dark:text-slate-400 relative z-10">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-accent" />
                <span className="text-sm">Processing image...</span>
              </div>
            ) : resultImage ? (
              <div className="relative w-full h-full z-10 flex items-center justify-center">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  src={resultImage} 
                  alt="Result" 
                  className="max-w-full max-h-full object-contain" 
                />
                {user?.subscription_tier === 'free' && (
                  <div className="absolute bottom-2 right-2 pointer-events-none opacity-50 bg-black/50 px-2 py-1 rounded text-white text-[10px] font-bold tracking-widest">
                    CREATED WITH AI STUDIO
                  </div>
                )}
              </div>
            ) : (
              <div className="text-black dark:text-slate-400 text-sm text-center px-4 relative z-10">
                Processed image will appear here
              </div>
            )}
          </div>
          {resultImage && (
            <Button className="w-full mt-4" variant="outline" onClick={() => {
              if (user?.subscription_tier === 'free') {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = resultImage;
                img.onload = () => {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);
                  const scaleFactor = canvas.width / 400;
                  ctx.font = `bold ${12 * scaleFactor}px Arial`;
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                  ctx.textAlign = 'right';
                  ctx.textBaseline = 'bottom';
                  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                  ctx.shadowBlur = 2 * scaleFactor;
                  ctx.shadowOffsetX = 1 * scaleFactor;
                  ctx.shadowOffsetY = 1 * scaleFactor;
                  ctx.fillText('CREATED WITH AI STUDIO', canvas.width - 10 * scaleFactor, canvas.height - 10 * scaleFactor);
                  const a = document.createElement('a');
                  a.href = canvas.toDataURL('image/png');
                  a.download = 'removed-bg.png';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                };
              } else {
                const a = document.createElement('a');
                a.href = resultImage;
                a.download = 'removed-bg.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            }}>
              <Download className="w-4 h-4 mr-2" /> Download PNG
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};
