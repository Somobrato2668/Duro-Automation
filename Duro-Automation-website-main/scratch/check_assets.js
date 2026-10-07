const fs = require('fs');
const journey = fs.readFileSync('lib/journey.ts', 'utf8');
const files = Array.from(journey.matchAll(/file:\s*"([^"]+)"/g)).map(m => m[1]);
console.log('Total files found:', files.length);
files.forEach(f => {
  const img = 'public/images/' + f;
  const depth = 'public/images/depth/' + f.replace('.jpg', '-depth.png');
  console.log(f, fs.existsSync(img) ? 'IMG_OK' : 'MISSING_IMG', fs.existsSync(depth) ? 'DEPTH_OK' : 'MISSING_DEPTH');
});

const clips = Array.from(journey.matchAll(/clip:\s*"([^"]+)"/g)).map(m => m[1]);
console.log('Clips:', clips);
clips.forEach(c => {
  const clipFile = 'public' + c;
  console.log(c, fs.existsSync(clipFile) ? 'CLIP_OK' : 'MISSING_CLIP');
});
