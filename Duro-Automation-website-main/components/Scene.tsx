"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { ROOMS, DWELL, N_SEG, TOTAL_P } from "@/lib/journey";
import { useJourney, pointerState } from "@/lib/store";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Depth-parallax room shader with cinematic fly-through transitions.
 */
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform sampler2D uDepth;
uniform float uImageAspect;
uniform float uViewAspect;
uniform float uDollyN;   // magnification of the nearest depth
uniform float uDollyF;   // magnification of the farthest depth
uniform float uStreak;   // zoom-blur strength along the dolly ray
uniform float uFade;     // layer opacity
uniform float uBright;
uniform float uTime;
uniform float uVig;
uniform vec2 uCenter;    // screen-space dolly target (the doorway)
uniform vec2 uMove;      // lateral camera drift, texture units

vec2 cover(vec2 uv) {
  if (uViewAspect > uImageAspect) {
    return vec2(uv.x, 0.5 + (uv.y - 0.5) * (uImageAspect / uViewAspect));
  }
  return vec2(0.5 + (uv.x - 0.5) * (uViewAspect / uImageAspect), uv.y);
}

void main() {
  vec2 suv = vUv;
  vec2 uv0 = cover(suv);
  vec2 c = cover(uCenter);

  vec2 uv = uv0;
  for (int i = 0; i < 2; i++) {
    float dep = texture2D(uDepth, uv).r;
    float mag = mix(uDollyF, uDollyN, dep);
    uv = c + (uv0 - c) / mag + uMove * (dep - 0.35);
  }
  uv = clamp(uv, 0.002, 0.998);

  vec3 col;
  if (uStreak > 0.001) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float k = (float(i) / 4.0 - 0.5) * uStreak;
      vec2 p = c + (uv - c) * (1.0 + k);
      acc += texture2D(uMap, clamp(p, 0.002, 0.998)).rgb;
    }
    col = acc * 0.2;
  } else {
    col = texture2D(uMap, uv).rgb;
  }

  vec2 dvec = (suv - uCenter) * vec2(uViewAspect, 1.0);
  float d = length(dvec);
  col *= 1.0 - 0.32 * uVig * smoothstep(0.25, 1.15, d);
  col *= uBright;

  gl_FragColor = vec4(col, uFade);
}
`;

/**
 * Walking-clip shader for frame sequences.
 */
const VIDEO_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform float uAspect;
uniform float uViewAspect;
uniform float uZoom;
uniform float uFade;
uniform float uBright;
uniform vec2 uMove;

void main() {
  vec2 suv = vUv;
  vec2 uv;
  if (uViewAspect > uAspect) {
    uv = vec2(suv.x, 0.5 + (suv.y - 0.5) * (uAspect / uViewAspect));
  } else {
    uv = vec2(0.5 + (suv.x - 0.5) * (uViewAspect / uAspect), suv.y);
  }
  uv = vec2(0.5) + (uv - vec2(0.5)) / uZoom + uMove;
  uv = clamp(uv, 0.002, 0.998);
  vec3 col = texture2D(uMap, uv).rgb * uBright;
  gl_FragColor = vec4(col, uFade);
}
`;

const smooth01 = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};

const COLOR_URLS = ROOMS.map((r) => "/images/" + r.file);
const DEPTH_URLS = ROOMS.map(
  (r) => "/images/depth/" + r.file.replace(".jpg", "-depth.png")
);

const CLIP_FRAME_PATHS: Record<string, string> = {
  "/clips/01-gate-to-hall.mp4": "/clips-frames/01-gate-to-hall",
  "/clips/04-corridor-to-bedroom.mp4": "/clips-frames/04-corridor-to-bedroom",
  "/clips/06-corridor-to-kitchen.mp4": "/clips-frames/06-corridor-to-kitchen",
  "/clips/07-corridor-to-bathroom.mp4": "/clips-frames/07-corridor-to-bathroom",
};

const CLIP_FRAME_COUNTS: Record<string, number> = {
  "/clips/01-gate-to-hall.mp4": 240,
  "/clips/04-corridor-to-bedroom.mp4": 240,
  "/clips/06-corridor-to-kitchen.mp4": 240,
  "/clips/07-corridor-to-bathroom.mp4": 203,
};

type ClipSequenceEntry = {
  room: number;
  material: THREE.ShaderMaterial;
  textures: THREE.Texture[];
  loadedCount: number;
  frameCount: number;
};

function getReadyTexture(textures: THREE.Texture[], targetIdx: number): THREE.Texture {
  const target = textures[targetIdx];
  if (target && target.image && (target.image as HTMLImageElement).complete && (target.image as HTMLImageElement).width > 0) {
    return target;
  }
  for (let i = targetIdx - 1; i >= 0; i--) {
    const t = textures[i];
    if (t && t.image && (t.image as HTMLImageElement).complete && (t.image as HTMLImageElement).width > 0) {
      return t;
    }
  }
  for (let i = targetIdx + 1; i < textures.length; i++) {
    const t = textures[i];
    if (t && t.image && (t.image as HTMLImageElement).complete && (t.image as HTMLImageElement).width > 0) {
      return t;
    }
  }
  return textures[0];
}

export default function Scene() {
  const colorMaps = useTexture(COLOR_URLS);
  const depthMaps = useTexture(DEPTH_URLS);
  const { viewport } = useThree();

  useMemo(() => {
    colorMaps.forEach((t) => {
      t.colorSpace = THREE.NoColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    });
    depthMaps.forEach((t) => {
      t.colorSpace = THREE.NoColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    });
  }, [colorMaps, depthMaps]);

  const materials = useMemo(
    () =>
      ROOMS.map(
        (r, i) =>
          new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
              uMap: { value: colorMaps[i] },
              uDepth: { value: depthMaps[i] },
              uImageAspect: { value: 1.5 },
              uViewAspect: { value: 1.7 },
              uDollyN: { value: 1.045 },
              uDollyF: { value: 1.03 },
              uStreak: { value: 0 },
              uFade: { value: 1 },
              uBright: { value: 1 },
              uTime: { value: 0 },
              uVig: { value: 0 },
              uCenter: { value: new THREE.Vector2(r.portal[0], r.portal[1]) },
              uMove: { value: new THREE.Vector2(0, 0) },
            },
          })
      ),
    [colorMaps, depthMaps]
  );

  /** Preloaded frame sequence clips */
  const clipEntries = useMemo<ClipSequenceEntry[]>(() => {
    if (typeof document === "undefined") return [];
    return ROOMS.flatMap((r, i) => {
      if (!r.clip) return [];
      const framePath = CLIP_FRAME_PATHS[r.clip];
      if (!framePath) return [];

      const frameCount = (r.clip && CLIP_FRAME_COUNTS[r.clip]) || 240;
      const textures: THREE.Texture[] = [];
      const bgLoadingManager = new THREE.LoadingManager();
      const loader = new THREE.TextureLoader(bgLoadingManager);

      for (let f = 1; f <= frameCount; f++) {
        const frameStr = String(f).padStart(3, "0");
        const url = `${framePath}/frame_${frameStr}.webp`;
        const tex = loader.load(url);
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        textures.push(tex);
      }

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: VIDEO_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uMap: { value: textures[0] },
          uAspect: { value: 1.64 },
          uViewAspect: { value: 1.7 },
          uZoom: { value: 1.045 },
          uFade: { value: 0 },
          uBright: { value: 1 },
          uMove: { value: new THREE.Vector2(0, 0) },
        },
      });

      return [{
        room: i,
        material,
        textures,
        loadedCount: frameCount,
        frameCount,
      }];
    });
  }, []);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const clipMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const par = useRef({ x: 0, y: 0 });
  const renderP = useRef(0);
  const prevP = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 20);

    // Render-side low-pass filter on scroll progress (~30ms time constant for crisp responsive scrubbing)
    const rawP = useJourney.getState().progress;
    renderP.current += (rawP - renderP.current) * (1 - Math.exp(-dt / 0.03));
    const P = renderP.current;
    const s = Math.min(Math.floor(P), N_SEG - 1);

    const aSway = 1 - Math.exp(-dt / 0.32);
    const targetX = pointerState.x * 0.005;
    const targetY = pointerState.y * 0.004;
    par.current.x += (targetX - par.current.x) * aSway;
    par.current.y += (targetY - par.current.y) * aSway;

    const segV = Math.min(Math.max(P - s, 0), 1);
    const activeClip = clipEntries.find((c) => c.room === s);
    const revSeg = s > 0 && !!ROOMS[s - 1]?.reverseOut;
    const revClip = revSeg ? clipEntries.find((c) => c.room === s - 1) : null;

    materials.forEach((mat, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const visible = i === s || i === s + 1;
      mesh.visible = visible;
      if (!visible) return;

      const room = ROOMS[i];
      const bz = room.baseZoom ?? 1;
      const ds = room.dollyScale ?? 1;
      const sw = room.swayScale ?? 1;

      const u = mat.uniforms;
      const img: { width?: number; height?: number } | undefined = (
        u.uMap.value as THREE.Texture
      ).image;
      if (img?.width && img?.height) u.uImageAspect.value = img.width / img.height;
      u.uViewAspect.value = viewport.aspect;
      u.uTime.value = t;
      (u.uMove.value as THREE.Vector2).set(
        par.current.x * sw,
        -par.current.y * sw
      );

      const v = Math.min(Math.max(P - s, 0), 1);

      if (i === s) {
        if (i === 0) {
          const breath = Math.sin(Math.PI * v);
          u.uDollyN.value = bz * (1.045 + 0.055 * ds * breath);
          u.uDollyF.value = bz * (1.03 + 0.018 * ds * breath);
          u.uStreak.value = 0;
          u.uFade.value = 1;
          u.uBright.value = 1;
          u.uVig.value = 0;
        } else if (activeClip) {
          const k = Math.min(v / DWELL, 1);
          u.uDollyN.value = bz * (1.045 + 0.04 * ds * smooth01(k));
          u.uDollyF.value = bz * (1.03 + 0.01 * ds * smooth01(k));
          u.uStreak.value = 0;
          u.uFade.value = 1.0 - smooth01((v - (DWELL - 0.02)) / 0.08);
          u.uBright.value = 1;
          u.uVig.value = 0;
        } else if (revSeg) {
          const k = Math.min(v / DWELL, 1);
          u.uDollyN.value = bz * (1.045 + 0.03 * ds * smooth01(k));
          u.uDollyF.value = bz * (1.03 + 0.01 * ds * smooth01(k));
          u.uStreak.value = 0;
          u.uFade.value = 1.0 - smooth01((v - (DWELL - 0.02)) / 0.08);
          u.uBright.value = 1;
          u.uVig.value = 0;
        } else if (v < DWELL) {
          const k = v / DWELL;
          u.uDollyN.value = bz * (1.045 + 0.1 * ds * k);
          u.uDollyF.value = bz * (1.03 + 0.022 * ds * k);
          u.uStreak.value = 0;
          u.uFade.value = 1;
          u.uBright.value = 1;
          u.uVig.value = 0;
        } else {
          const q = (v - DWELL) / (1 - DWELL);
          const push = smooth01(q);
          u.uDollyN.value = bz * (1.045 + 0.1 * ds + 0.6 * ds * push);
          u.uDollyF.value = bz * (1.03 + 0.022 * ds + 0.22 * ds * push);
          u.uStreak.value = 0;
          u.uFade.value = 1 - smooth01((q - 0.55) / 0.37);
          u.uBright.value = 1 + 0.06 * smooth01((q - 0.3) / 0.4);
          u.uVig.value = q;
        }
      } else {
        if (activeClip || (revSeg && i === s + 1)) {
          u.uDollyN.value = bz * 1.045;
          u.uDollyF.value = bz * 1.03;
          u.uStreak.value = 0;
          u.uFade.value = smooth01((v - 0.82) / 0.14);
          u.uBright.value = 1;
          u.uVig.value = 0;
        } else {
          const settle = smooth01(v);
          u.uDollyN.value = bz * (1.045 + 0.16 * (1 - settle));
          u.uDollyF.value = bz * (1.03 + 0.05 * (1 - settle));
          u.uStreak.value = 0;
          u.uFade.value = 1;
          u.uBright.value = 0.7 + 0.3 * smooth01((v - 0.5) / 0.45);
          u.uVig.value = 0;
        }
        if (i === ROOMS.length - 1 && P > N_SEG) {
          const f = Math.min((P - N_SEG) / (TOTAL_P - N_SEG), 1);
          u.uDollyN.value = bz * (1.045 + 0.06 * f);
          u.uDollyF.value = bz * (1.03 + 0.015 * f);
          u.uBright.value = 1 - 0.25 * smooth01((f - 0.15) / 0.6);
          u.uStreak.value = 0;
        }
      }
    });

    // drive frame sequence walking clips
    clipEntries.forEach((c, idx) => {
      const mesh = clipMeshes.current[idx];
      if (!mesh) return;
      const u = c.material.uniforms;

      const clipReverseOut = !!ROOMS[c.room]?.reverseOut;
      const isPrimary = c.room === s;
      const isReverse = clipReverseOut && c.room + 1 === s;
      const isTail = !isReverse && c.room === s - 1 && segV < 0.14;

      if (!isPrimary && !isReverse && !isTail) {
        mesh.visible = false;
        u.uFade.value = 0;
        return;
      }

      let fade = 0;
      let frameProgress = 0;

      if (isPrimary) {
        const rv = Math.min(Math.max(P - c.room, 0), 1);
        const q = Math.min(Math.max((rv - DWELL) / (1 - DWELL), 0), 1);
        frameProgress = 0.5 - 0.5 * Math.cos(Math.PI * q);
        fade = smooth01((segV - (DWELL - 0.02)) / 0.08);
        fade *= 1 - smooth01((segV - 0.82) / 0.14);
      } else if (isReverse) {
        const rv = Math.min(Math.max(P - s, 0), 1);
        const q = Math.min(Math.max((rv - DWELL) / (1 - DWELL), 0), 1);
        frameProgress = 1 - (0.5 - 0.5 * Math.cos(Math.PI * q));
        fade = smooth01((rv - (DWELL - 0.02)) / 0.08);
        fade *= 1 - smooth01((rv - 0.82) / 0.14);
      } else {
        frameProgress = 1;
        fade = 1 - smooth01(segV / 0.14);
      }

      const totalFrames = c.frameCount || 240;
      const frameIdx = Math.min(
        Math.max(Math.floor(frameProgress * (totalFrames - 1)), 0),
        totalFrames - 1
      );

      const frameTex = getReadyTexture(c.textures, frameIdx);
      if (frameTex) {
        u.uMap.value = frameTex;
      }

      u.uFade.value = fade;
      mesh.visible = fade > 0.001;

      u.uAspect.value = 1.777; // 16:9 540p aspect
      u.uViewAspect.value = viewport.aspect;
      (u.uMove.value as THREE.Vector2).set(
        par.current.x * 0.45,
        -par.current.y * 0.45
      );
    });
  });

  return (
    <group>
      {ROOMS.map((r, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          renderOrder={ROOMS.length - i}
          scale={[viewport.width * 1.002, viewport.height * 1.002, 1]}
          material={materials[i]}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
      {clipEntries.map((c, idx) => (
        <mesh
          key={`clip-${c.room}`}
          ref={(el) => {
            clipMeshes.current[idx] = el;
          }}
          renderOrder={ROOMS.length + 30 - c.room}
          scale={[viewport.width * 1.002, viewport.height * 1.002, 1]}
          material={c.material}
          visible={false}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

