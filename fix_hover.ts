import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/hover:text-slate-900 dark:hover:text-slate-900 dark:text-white/g, 'hover:text-slate-900 dark:hover:text-white');
content = content.replace(/hover:bg-slate-200 dark:hover:bg-slate-200 dark:hover:bg-slate-900/g, 'hover:bg-slate-200 dark:hover:bg-slate-900');
fs.writeFileSync('src/App.tsx', content);
