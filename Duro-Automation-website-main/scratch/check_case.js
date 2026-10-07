const fs = require('fs');
console.log('--- public/images ---');
fs.readdirSync('public/images').forEach(f => {
  if (f.endsWith('.jpg') || f.endsWith('.png')) console.log(f);
});

console.log('--- public/images/depth ---');
fs.readdirSync('public/images/depth').forEach(f => {
  console.log(f);
});
