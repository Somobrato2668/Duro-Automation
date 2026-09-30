const sharp = require('sharp');

async function cleanEntranceText() {
  const image = sharp('public/images/digital-twin-single-story.jpg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Region of white text "ENTRANCE": x: 300 to 410, y: 485 to 515
  for (let y = 485; y <= 515; y++) {
    for (let x = 300; x <= 410; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Detect white/bright text pixels
      if (r > 120 && g > 120 && b > 120) {
        // Sample dark asphalt color from nearby clean pixel (e.g. x, y - 20)
        const sampleIdx = ((y - 25) * width + x) * channels;
        data[idx] = data[sampleIdx];
        data[idx + 1] = data[sampleIdx + 1];
        data[idx + 2] = data[sampleIdx + 2];
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .jpeg({ quality: 96 })
    .toFile('public/images/digital-twin-single-story.jpg');

  console.log('Entrance text cleaned successfully!');
}

cleanEntranceText().catch(console.error);
