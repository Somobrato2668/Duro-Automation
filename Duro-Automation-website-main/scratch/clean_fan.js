const sharp = require('sharp');
const fs = require('fs');

async function removeStaticFan() {
  const image = sharp('public/images/digital-twin-single-story.jpg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Static fan region in raw pixels:
  // x: 200 to 325, y: 85 to 205
  // We replace pixels matching the grey fan blade color with smooth wall/curtain background blend
  for (let y = 85; y <= 205; y++) {
    for (let x = 200; x <= 325; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Detect grey fan blade pixels (r, g, b close to each other, brightness between 70 and 150)
      const isGreyFanBlade = Math.abs(r - g) < 18 && Math.abs(g - b) < 18 && r > 65 && r < 145;

      if (isGreyFanBlade) {
        // Sample background color from nearby wall or curtain
        // If x < 240, sample curtain from x = 185, y
        // If x >= 240, sample wood wall from x = 335, y
        const sampleX = x < 238 ? 185 : Math.min(width - 1, 335);
        const sampleIdx = (y * width + sampleX) * channels;

        data[idx] = data[sampleIdx];
        data[idx + 1] = data[sampleIdx + 1];
        data[idx + 2] = data[sampleIdx + 2];
      }
    }
  }

  // Save cleaned base image
  await sharp(data, { raw: { width, height, channels } })
    .jpeg({ quality: 95 })
    .toFile('public/images/digital-twin-single-story-clean.jpg');

  console.log('Static fan removed successfully from base image!');
}

removeStaticFan().catch(console.error);
