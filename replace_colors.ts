import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  ['bg-slate-950', 'bg-slate-50 dark:bg-slate-950'],
  ['bg-slate-900', 'bg-white dark:bg-slate-900'],
  ['bg-slate-800', 'bg-slate-100 dark:bg-slate-800'],
  ['text-slate-400', 'text-slate-500 dark:text-slate-400'],
  ['text-slate-300', 'text-slate-600 dark:text-slate-300'],
  ['text-slate-200', 'text-slate-700 dark:text-slate-200'],
  ['text-slate-100', 'text-slate-800 dark:text-slate-100'],
  ['text-slate-50', 'text-slate-900 dark:text-slate-50'],
  ['border-white/10', 'border-slate-200 dark:border-white/10'],
  ['border-white/5', 'border-slate-100 dark:border-white/5'],
  ['border-white/20', 'border-slate-300 dark:border-white/20'],
  ['hover:bg-slate-800', 'hover:bg-slate-100 dark:hover:bg-slate-800'],
  ['hover:bg-slate-900', 'hover:bg-slate-200 dark:hover:bg-slate-900'],
  ['hover:text-white', 'hover:text-slate-900 dark:hover:text-white'],
  ['text-white', 'text-slate-900 dark:text-white']
];

replacements.forEach(([oldClass, newClass]) => {
  const regex = new RegExp(`(?<!dark:)\\b${oldClass.replace('/', '\\/')}\\b`, 'g');
  content = content.replace(regex, newClass);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements done.');
