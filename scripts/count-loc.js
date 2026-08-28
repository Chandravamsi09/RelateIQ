const fs = require('fs');
const path = require('path');

function countLines(dir, extensions = ['.ts', '.tsx', '.js', '.json', '.prisma', '.css', '.md', '.yml', '.yaml', '.sql']) {
  let totalLines = 0;
  let fileCount = 0;
  const breakdown = {};

  function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        const ext = path.extname(file);
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n').length;
          totalLines += lines;
          fileCount++;
          breakdown[ext] = (breakdown[ext] || 0) + lines;
        }
      }
    }
  }

  traverse(dir);
  return { totalLines, fileCount, breakdown };
}

const root = path.resolve(__dirname, '..');
const result = countLines(root);
console.log('===========================================');
console.log(`Total Files : ${result.fileCount}`);
console.log(`Total Lines : ${result.totalLines}`);
console.log('Breakdown by extension:');
for (const [ext, count] of Object.entries(result.breakdown)) {
  console.log(`  ${ext.padEnd(8)}: ${count} lines`);
}
console.log('===========================================');
