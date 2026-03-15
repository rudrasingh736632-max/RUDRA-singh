import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace light mode text colors with text-black or text-slate-900
content = content.replace(/text-slate-400 dark:text-slate-400/g, 'text-black dark:text-slate-400');
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-black dark:text-slate-400');
content = content.replace(/text-slate-600 dark:text-slate-300/g, 'text-black dark:text-slate-300');
content = content.replace(/text-slate-700 dark:text-slate-200/g, 'text-black dark:text-slate-200');
content = content.replace(/text-slate-800 dark:text-slate-100/g, 'text-black dark:text-slate-100');
content = content.replace(/text-slate-900 dark:text-slate-50/g, 'text-black dark:text-slate-50');

// Replace standalone ones
content = content.replace(/text-slate-500(?!\s*dark:)/g, 'text-black dark:text-slate-400');
content = content.replace(/text-slate-600(?!\s*dark:)/g, 'text-black dark:text-slate-300');
content = content.replace(/text-slate-700(?!\s*dark:)/g, 'text-black dark:text-slate-200');
content = content.replace(/text-slate-800(?!\s*dark:)/g, 'text-black dark:text-slate-100');

// Ensure text-slate-900 is text-black in light mode
content = content.replace(/text-slate-900/g, 'text-black');

// Fix any double darks just in case
content = content.replace(/dark:text-slate-400 dark:text-slate-400/g, 'dark:text-slate-400');
content = content.replace(/dark:text-slate-300 dark:text-slate-300/g, 'dark:text-slate-300');
content = content.replace(/dark:text-slate-200 dark:text-slate-200/g, 'dark:text-slate-200');
content = content.replace(/dark:text-slate-100 dark:text-slate-100/g, 'dark:text-slate-100');

// Fix background colors that might have been affected if they used text-slate-900
content = content.replace(/bg-black dark:bg-slate-900/g, 'bg-slate-900 dark:bg-slate-900');

fs.writeFileSync('src/App.tsx', content);
