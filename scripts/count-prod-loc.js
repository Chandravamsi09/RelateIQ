const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.turbo', '.system_generated', 'tests', 'test', 'spec', 'specs'
]);

const PROD_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.py', '.sql'
]);

let totalProdLines = 0;
let totalProdFiles = 0;
const extCounts = {};

function countFileLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    return lines;
  } catch {
    return 0;
  }
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      traverse(fullPath);
    } else if (entry.isFile()) {
      // Exclude test files
      if (
        entry.name.includes('.test.') ||
        entry.name.includes('.spec.') ||
        entry.name.includes('runner.js') ||
        entry.name.includes('count-loc')
      ) {
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (PROD_EXTENSIONS.has(ext)) {
        const lines = countFileLines(fullPath);
        totalProdLines += lines;
        totalProdFiles++;
        extCounts[ext] = (extCounts[ext] || 0) + lines;
      }
    }
  }
}

traverse(process.cwd());

console.log('===========================================');
console.log('  RelateIQ Pure PRODUCTION Code Metrics');
console.log('  (Tests, JSON, Markdown & Configs Excluded)');
console.log('===========================================');
console.log(`Total Prod Files : ${totalProdFiles}`);
console.log(`Total Prod Lines : ${totalProdLines}`);
console.log('Breakdown by Extension:');
for (const [ext, count] of Object.entries(extCounts)) {
  console.log(`  ${ext.padEnd(7)} : ${count} lines`);
}
console.log('===========================================');
console.log(`Goal: >= 50,000 Prod LOC. Current: ${totalProdLines}`);
if (totalProdLines >= 50000) {
  console.log('\x1b[32m✔ EXCEEDS 50,000+ PROD LOC REQUIREMENT!\x1b[0m');
} else {
  console.log(`\x1b[31m✖ Need ${50000 - totalProdLines} more prod LOC\x1b[0m`);
}
console.log('===========================================');
