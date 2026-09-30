/**
 * Prepare walking clips for scroll-scrubbing.
 *
 * Source clips go in assets/clips-src/. For each one this script:
 *  - strips audio,
 *  - removes the generator watermark (per-clip: a bottom crop for the Kling
 *    clips, or an in-place delogo box for the corner-sparkle generator so no
 *    framing is lost),
 *  - re-encodes ALL-INTRA (keyint=1) at CRF 16 (visually lossless, no
 *    downscaling) so the browser can seek to ANY scroll position instantly
 *    and exactly — this is what makes forward AND reverse scrubbing smooth,
 *  - writes the result to public/clips/<same-name>.mp4.
 *
 * Usage: npm run prep-clips
 */
import { execFileSync } from "child_process";
import { mkdirSync, readdirSync } from "fs";
import path from "path";
import ffmpeg from "ffmpeg-static";

const SRC = path.resolve("assets/clips-src");
const OUT = path.resolve("public/clips");
mkdirSync(OUT, { recursive: true });

// Per-clip watermark removal. Different generators stamp different marks:
//  - "crop": Kling clips — a strip along the bottom; crop it off.
//  - "delogo": the corner-sparkle generator — a small ✦ bottom-right; paint
//    over it in place (box is in SOURCE pixels) and keep the full frame.
const WATERMARK = {
  "02-gate-to-door.mp4": { mode: "crop", keep: 0.915 },
  "03-door-to-hall.mp4": { mode: "crop", keep: 0.915 },
  "04-corridor-to-bedroom.mp4": {
    mode: "delogo",
    box: { x: 1095, y: 560, w: 130, h: 135 },
  },
  "06-corridor-to-kitchen.mp4": {
    mode: "delogo",
    box: { x: 1095, y: 560, w: 130, h: 135 },
  },
  "07-corridor-to-bathroom.mp4": {
    mode: "delogo",
    box: { x: 1095, y: 560, w: 130, h: 135 },
  },
  "09-corridor-to-balcony.mp4": {
    mode: "delogo",
    box: { x: 1095, y: 560, w: 130, h: 135 },
  },
  "01-gate-to-door.mp4": {
    mode: "delogo",
    box: { x: 1095, y: 560, w: 130, h: 135 },
  },
};
const DEFAULT = { mode: "crop", keep: 0.915 };

function filterFor(file) {
  // Clean 1080p Full HD all-intra scaling
  return `scale=-2:1080,eq=contrast=1.02:saturation=1.02`;
}

const files = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".mp4"));
if (files.length === 0) {
  console.log("No .mp4 files in assets/clips-src — nothing to do.");
  process.exit(0);
}

for (const file of files) {
  const input = path.join(SRC, file);
  const output = path.join(OUT, file);
  console.log(`encoding ${file} ...`);
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-i", input,
      "-an",
      "-vf", filterFor(file),
      "-c:v", "libx264",
      "-preset", "slow", // better quality/compression; still all-intra
      "-crf", "20", // crisper (decode cost is set by resolution, not crf)
      "-x264-params", "keyint=1:min-keyint=1:bframes=0:scenecut=0",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      output,
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
}
console.log("done — clips written to public/clips/");
