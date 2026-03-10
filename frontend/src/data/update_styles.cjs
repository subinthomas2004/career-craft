const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pages/CodingPractice.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
    { from: /bg-\[#0a0a0f\]/g, to: 'bg-background' },
    { from: /text-gray-100/g, to: 'text-foreground' },
    { from: /bg-\[#0f0f18\]/g, to: 'bg-card' },
    { from: /border-gray-800\/60/g, to: 'border-border/60' },
    { from: /text-gray-400/g, to: 'text-muted-foreground' },
    { from: /hover:text-emerald-400/g, to: 'hover:text-primary' },
    { from: /bg-gray-800/g, to: 'bg-border' },
    { from: /text-white/g, to: 'text-foreground' },
    { from: /bg-\[#0d0d15\]/g, to: 'bg-muted/30' },
    { from: /text-gray-300/g, to: 'text-muted-foreground' },
    { from: /bg-gray-800\/30/g, to: 'bg-muted/40' },
    { from: /border-gray-700\/30/g, to: 'border-border/40' },
    { from: /text-gray-500/g, to: 'text-muted-foreground/80' },
    { from: /text-cyan-400/g, to: 'text-cyan-600 dark:text-cyan-400' },
    { from: /border-gray-800\/40/g, to: 'border-border/50' },
    { from: /bg-gray-800\/50/g, to: 'bg-muted/60' },
    { from: /border-gray-700\/40/g, to: 'border-border/50' },
    { from: /bg-\[#0a0a12\]/g, to: 'bg-muted/20' },
    { from: /text-gray-600/g, to: 'text-muted-foreground/60' },
    { from: /border-gray-800\/30/g, to: 'border-border/30' },
    { from: /text-gray-200/g, to: 'text-foreground/90' },
    { from: /placeholder-gray-700/g, to: 'placeholder-muted-foreground' },
    { from: /bg-gray-900\/50/g, to: 'bg-muted/80' },
    { from: /text-gray-700/g, to: 'text-muted-foreground/40' },
    { from: /bg-gray-700\/50/g, to: 'bg-secondary' },
    { from: /border-gray-600\/40/g, to: 'border-border' },
    { from: /hover:bg-gray-700\/70/g, to: 'hover:bg-secondary/80' },
    { from: /hover:bg-gray-800\/50/g, to: 'hover:bg-muted/80' },
    { from: /hover:bg-gray-800\/30/g, to: 'hover:bg-muted/50' },
    { from: /hover:text-gray-300/g, to: 'hover:text-foreground' },
    { from: /text-emerald-400/g, to: 'text-emerald-600 dark:text-emerald-400' },
    { from: /text-amber-400/g, to: 'text-amber-600 dark:text-amber-400' },
    { from: /text-red-400/g, to: 'text-red-600 dark:text-red-400' },
];

replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated styles in CodingPractice.tsx');
