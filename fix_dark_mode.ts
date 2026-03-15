import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Colors to replace
const replacements = [
  { from: /bg-slate-950/g, to: 'bg-slate-50 dark:bg-slate-950' },
  { from: /bg-slate-900/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-slate-800/g, to: 'bg-slate-100 dark:bg-slate-800' },
  { from: /text-slate-300/g, to: 'text-slate-600 dark:text-slate-300' },
  { from: /text-slate-400/g, to: 'text-slate-500 dark:text-slate-400' },
  { from: /border-white\/5/g, to: 'border-slate-100 dark:border-white/5' },
  { from: /border-white\/10/g, to: 'border-slate-200 dark:border-white/10' },
  { from: /border-white\/20/g, to: 'border-slate-300 dark:border-white/20' },
  { from: /border-slate-800/g, to: 'border-slate-200 dark:border-slate-800' },
  { from: /border-slate-700/g, to: 'border-slate-300 dark:border-slate-700' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-slate-100 dark:hover:bg-white/5' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-slate-200 dark:hover:bg-white/10' },
  { from: /hover:text-white/g, to: 'hover:text-slate-900 dark:hover:text-white' },
];

for (const r of replacements) {
  content = content.replace(r.from, r.to);
}

// Special cases for text-white that shouldn't be changed (e.g., in buttons with accent background)
// We'll replace text-white with text-slate-900 dark:text-white, but then fix the buttons.
content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');

// Fix buttons and gradients
content = content.replace(/text-slate-900 dark:text-white shadow-\[0_4px_14px_0_rgba\(249,115,22,0\.39\)\]/g, 'text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]');
content = content.replace(/text-slate-900 dark:text-white shadow-\[0_4px_14px_0_rgba\(220,38,38,0\.39\)\]/g, 'text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.39)]');
content = content.replace(/bg-accent text-slate-900 dark:text-white/g, 'bg-accent text-white');

// Add ThemeToggle to LandingPage
content = content.replace(
  /<div className="flex items-center gap-4">\s*<button onClick=\{onLogin\}/,
  '<div className="flex items-center gap-4">\n            <ThemeToggle />\n            <button onClick={onLogin}'
);

// Add ThemeToggle to Dashboard
content = content.replace(
  /<div className="flex items-center gap-2 lg:gap-4">\s*\{user\.subscription_tier === 'free' \? \(/,
  '<div className="flex items-center gap-2 lg:gap-4">\n            <ThemeToggle />\n            {user.subscription_tier === \'free\' ? ('
);

fs.writeFileSync('src/App.tsx', content);
