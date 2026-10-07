const https = require('https');
https.get('https://duro-automation.vercel.app/images/01-exterior.jpg', (res) => {
  console.log('Status code for /images/01-exterior.jpg:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
}).on('error', (e) => {
  console.error('Error:', e.message);
});
