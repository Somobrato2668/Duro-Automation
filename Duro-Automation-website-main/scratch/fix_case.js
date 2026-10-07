const fs = require('fs');

// Ensure 01-exterior.jpg exists in lowercase
if (fs.existsSync('public/images/01-Exterior.jpg') && !fs.existsSync('public/images/01-exterior.jpg')) {
  fs.copyFileSync('public/images/01-Exterior.jpg', 'public/images/01-exterior.jpg');
  console.log('Copied 01-Exterior.jpg to 01-exterior.jpg');
}

// Ensure depth files exist in both cases if needed
fs.readdirSync('public/images/depth').forEach(f => {
  const lower = f.toLowerCase();
  if (f !== lower) {
    fs.copyFileSync('public/images/depth/' + f, 'public/images/depth/' + lower);
    console.log('Copied depth', f, 'to', lower);
  }
});
