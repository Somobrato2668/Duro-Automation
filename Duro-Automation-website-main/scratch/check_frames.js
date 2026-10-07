const fs = require('fs');
if (fs.existsSync('public/clips-frames')) {
  fs.readdirSync('public/clips-frames').forEach(dir => {
    const p = 'public/clips-frames/' + dir;
    const files = fs.readdirSync(p);
    console.log(dir, 'has', files.length, 'frames. First:', files[0], 'Last:', files[files.length - 1]);
  });
}
