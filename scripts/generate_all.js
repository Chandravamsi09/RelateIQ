const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runPhase(phaseScript) {
  console.log(`\n======================================================`);
  console.log(`Executing ${phaseScript}...`);
  console.log(`======================================================`);
  require(path.resolve(__dirname, 'builders', phaseScript));
}

console.log('RelateIQ Enterprise Master Builder initialized.');
