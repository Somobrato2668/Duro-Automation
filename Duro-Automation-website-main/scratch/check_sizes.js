const fs = require('fs');
const path = require('path');
function getDirSize(dir) {
  let total = 0;
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) total += getDirSize(p);
    else total += stat.size;
  });
  return total;
}
if (fs.existsSync('public/clips-frames')) {
  console.log('Total size of clips-frames:', (getDirSize('public/clips-frames') / 1024 / 1024).toFixed(2), 'MB');
}
if (fs.existsSync('public/clips')) {
  console.log('Total size of clips (MP4s):', (getDirSize('public/clips') / 1024 / 1024).toFixed(2), 'MB');
}
