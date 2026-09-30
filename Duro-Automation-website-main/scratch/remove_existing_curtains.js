const sharp = require('sharp');
const fs = require('fs');

async function removeStaticCurtains() {
  const image = sharp('public/images/digital-twin-single-story.jpg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Clean left drape (x: 112 to 134, y: 100 to 260)
  // Replace with smooth wall tone sampled from x=105..110
  for (let y = 100; y <= 260; y++) {
    // If y is below the ceiling LED strip (y > 105):
    for (let x = 112; x <= 134; x++) {
      const idx = (y * width + x) * channels;
      // Sample from the wall to the left (x: 105)
      const sampleX = Math.max(90, 106 - Math.floor((y - 100) * 0.05));
      const sampleIdx = (y * width + sampleX) * channels;

      data[idx] = data[sampleIdx];
      data[idx + 1] = data[sampleIdx + 1];
      data[idx + 2] = data[sampleIdx + 2];
    }
  }

  // 2. Clean right drape (x: 213 to 240, y: 130 to 290)
  // Replace with wood slat wall tone sampled from x=248..255
  for (let y = 130; y <= 290; y++) {
    for (let x = 213; x <= 240; x++) {
      const idx = (y * width + x) * channels;
      // Sample wood panel from x = 250
      const sampleX = 250;
      const sampleIdx = (y * width + sampleX) * channels;

      data[idx] = data[sampleIdx];
      data[idx + 1] = data[sampleIdx + 1];
      data[idx + 2] = data[sampleIdx + 2];
    }
  }

  // Save the updated base image without static curtains
  await sharp(data, { raw: { width, height, channels } })
    .jpeg({ quality: 95 })
    .toFile('public/images/digital-twin-single-story.jpg');

  console.log('Static curtains cleanly removed from base image!');
}

removeStaticCurtains().catch(console.error);
