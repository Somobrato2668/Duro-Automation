import { execFileSync } from "child_process";
import { mkdirSync, readdirSync, rmSync } from "fs";
import path from "path";
import ffmpeg from "ffmpeg-static";

const SRC = path.resolve("assets/clips-src");
const OUT = path.resolve("public/clips-frames");
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".mp4"));
if (files.length === 0) {
  console.log("No .mp4 files in assets/clips-src.");
  process.exit(0);
}

for (const file of files) {
  const clipName = path.parse(file).name;
  const clipOutDir = path.join(OUT, clipName);
  rmSync(clipOutDir, { recursive: true, force: true });
  mkdirSync(clipOutDir, { recursive: true });

  const input = path.join(SRC, file);
  const pattern = path.join(clipOutDir, "frame_%03d.webp");

  console.log(`Extracting WebP frame sequence for ${file} -> ${clipName}...`);
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-i", input,
      "-an",
      "-vf", "scale=-2:1080,unsharp=3:3:0.5:3:3:0.0,eq=contrast=1.02:saturation=1.02,fps=30",
      "-c:v", "libwebp",
      "-quality", "92",
      pattern,
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
  console.log(`Extracted frames for ${clipName}`);
}

console.log("All frame sequences extracted into public/clips-frames/");
