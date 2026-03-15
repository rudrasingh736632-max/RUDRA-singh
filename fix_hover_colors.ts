import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/hover:text-slate-900 dark:hover:text-slate-900 dark:text-white/g, 'hover:text-slate-900 dark:hover:text-white');
content = content.replace(/text-slate-900 dark:text-white font-black text-xl text-center px-4 drop-shadow-\[0_4px_4px_rgba\(0,0,0,0\.8\)\]/g, 'text-white font-black text-xl text-center px-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]');

fs.writeFileSync('src/App.tsx', content);
