const fs = require('fs');
const path = require('path');

function writeFile(relPath, content) {
  const fullPath = path.resolve(__dirname, '../../', relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

module.exports = { writeFile };
