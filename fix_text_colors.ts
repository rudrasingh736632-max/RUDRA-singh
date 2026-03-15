import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix text-slate-50 to text-slate-900 dark:text-slate-50
content = content.replace(/text-slate-50 /g, 'text-slate-900 dark:text-slate-50 ');
content = content.replace(/text-slate-100 /g, 'text-slate-800 dark:text-slate-100 ');
content = content.replace(/text-slate-200 /g, 'text-slate-700 dark:text-slate-200 ');

fs.writeFileSync('src/App.tsx', content);
