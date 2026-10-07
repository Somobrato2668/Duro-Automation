"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

interface DigitalTwin3DProps {
  lightsOn: boolean;
  fanOn: boolean;
  curtainsClosed: boolean;
  gateClosed: boolean;
  tvOn: boolean;
  musicOn: boolean;
  securityArmed: boolean;
  temperature: number;
}

/* ========================================================================= */
/* 1. MOTORIZED 3D CURTAINS COMPONENT                                        */
/* ========================================================================= */
function MotorizedCurtains3D({ closed }: { closed: boolean }) {
  const leftCurtainRef = useRef<THREE.Group>(null);
  const rightCurtainRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Left curtain target: Closed (x: -0.7), Open (x: -1.35)
    // Right curtain target: Closed (x: 0.7), Open (x: 1.35)
    const targetLeft = closed ? -0.7 : -1.35;
    const targetRight = closed ? 0.7 : 1.35;
    const targetScale = closed ? 1.0 : 0.28;

    if (leftCurtainRef.current) {
      leftCurtainRef.current.position.x = THREE.MathUtils.damp(
        leftCurtainRef.current.position.x,
        targetLeft,
        6,
        delta
      );
      leftCurtainRef.current.scale.x = THREE.MathUtils.damp(
        leftCurtainRef.current.scale.x,
        targetScale,
        6,
        delta
      );
    }
    if (rightCurtainRef.current) {
      rightCurtainRef.current.position.x = THREE.MathUtils.damp(
        rightCurtainRef.current.position.x,
        targetRight,
        6,
        delta
      );
      rightCurtainRef.current.scale.x = THREE.MathUtils.damp(
        rightCurtainRef.current.scale.x,
        targetScale,
        6,
        delta
      );
    }
  });

  return (
    <group position={[-4.9, 1.8, -1.8]} rotation={[0, Math.PI / 2, 0]}>
      {/* Top Titanium Curtain Track */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[3.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#2d3139" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Curtain Panel with Pleats */}
      <group ref={leftCurtainRef} position={[-0.7, 0, 0]}>
        {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((offset, i) => (
          <mesh
            key={i}
            position={[offset, 0, (i % 2) * 0.04]}
            rotation={[0, (i % 2) * 0.2, 0]}
          >
            <boxGeometry args={[0.22, 3.1, 0.02]} />
            <meshStandardMaterial
              color="#e8e2d5"
              roughness={0.85}
              metalness={0.05}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>

      {/* Right Curtain Panel with Pleats */}
      <group ref={rightCurtainRef} position={[0.7, 0, 0]}>
        {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((offset, i) => (
          <mesh
            key={i}
            position={[offset, 0, (i % 2) * 0.04]}
            rotation={[0, -(i % 2) * 0.2, 0]}
          >
            <boxGeometry args={[0.22, 3.1, 0.02]} />
            <meshStandardMaterial
              color="#e8e2d5"
              roughness={0.85}
              metalness={0.05}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ========================================================================= */
/* 2. REAL 3D ROTATING CEILING FAN COMPONENT                                 */
/* ========================================================================= */
function CeilingFan3D({ spinning }: { spinning: boolean }) {
  const bladesRef = useRef<THREE.Group>(null);
  const currentSpeed = useRef(0);

  useFrame((_, delta) => {
    const targetSpeed = spinning ? 12 : 0;
    currentSpeed.current = THREE.MathUtils.damp(
      currentSpeed.current,
      targetSpeed,
      2.5,
      delta
    );

    if (bladesRef.current && currentSpeed.current > 0.01) {
      bladesRef.current.rotation.y += currentSpeed.current * delta;
    }
  });

  return (
    <group position={[-2.5, 3.4, -1.8]}>
      {/* Downrod Mount */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
        <meshStandardMaterial color="#1e222b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Center Motor Hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.16, 24]} />
        <meshStandardMaterial color="#181b22" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rotating Blades Group */}
      <group ref={bladesRef}>
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <group key={idx} rotation={[0, (angle * Math.PI) / 180, 0]}>
            {/* Blade Arm */}
            <mesh position={[0.25, 0, 0]}>
              <boxGeometry args={[0.2, 0.02, 0.05]} />
              <meshStandardMaterial color="#2d313b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Aerodynamic Blade */}
            <mesh
              position={[0.85, 0, 0]}
              rotation={[0.1, 0, 0]}
            >
              <boxGeometry args={[1.0, 0.02, 0.22]} />
              <meshStandardMaterial
                color="#1f232c"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ========================================================================= */
/* 3. MOTORIZED 3D ENTRANCE GATE COMPONENT                                   */
/* ========================================================================= */
function MotorizedGate3D({ closed }: { closed: boolean }) {
  const gatePanelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Closed (x: 0), Open (x: -2.3)
    const targetX = closed ? 0 : -2.3;
    if (gatePanelRef.current) {
      gatePanelRef.current.position.x = THREE.MathUtils.damp(
        gatePanelRef.current.position.x,
        targetX,
        4.5,
        delta
      );
    }
  });

  return (
    <group position={[0.2, 0, 4.8]}>
      {/* Ground Guide Rail */}
      <mesh position={[-0.8, 0.03, 0]}>
        <boxGeometry args={[4.2, 0.04, 0.12]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Structural Pillar */}
      <group position={[-1.7, 0.7, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 1.4, 0.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Status Indicator LED Top */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
          <meshStandardMaterial
            color={closed ? "#f59e0b" : "#10b981"}
            emissive={closed ? "#f59e0b" : "#10b981"}
            emissiveIntensity={2.5}
          />
        </mesh>
      </group>

      {/* Right Structural Pillar */}
      <group position={[1.7, 0.7, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 1.4, 0.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Status Indicator LED Top */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
          <meshStandardMaterial
            color={closed ? "#f59e0b" : "#10b981"}
            emissive={closed ? "#f59e0b" : "#10b981"}
            emissiveIntensity={2.5}
          />
        </mesh>
      </group>

      {/* Sliding Gate Panel */}
      <group ref={gatePanelRef} position={[0, 0.65, 0]}>
        {/* Outer Frame */}
        <mesh>
          <boxGeometry args={[3.1, 1.2, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Horizontal Slats */}
        {[-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.04]}>
            <boxGeometry args={[2.95, 0.06, 0.04]} />
            <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ========================================================================= */
/* 4. REAL 3D VILLA ARCHITECTURE & FURNITURE                                 */
/* ========================================================================= */
function VillaModel3D({
  lightsOn,
  tvOn,
  musicOn,
  securityArmed,
  curtainsClosed,
  fanOn,
  gateClosed,
}: DigitalTwin3DProps) {
  const masterLightIntensity = lightsOn ? 2.8 : 0.2;
  const livingLightIntensity = lightsOn ? 2.5 : 0.15;
  const kitchenLightIntensity = lightsOn ? 2.2 : 0.15;

  return (
    <group position={[0, -0.8, 0]}>
      {/* ----------------- FOUNDATION & FLOORS ----------------- */}
      {/* Exterior Ground Platform */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[13.5, 0.3, 12.5]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Master Bedroom Luxury Wood Flooring */}
      <mesh position={[-2.5, 0.02, -1.8]} receiveShadow>
        <boxGeometry args={[4.8, 0.04, 5.8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Living Room & Corridor Fine Sandstone Flooring */}
      <mesh position={[2.5, 0.02, -1.8]} receiveShadow>
        <boxGeometry args={[4.8, 0.04, 5.8]} />
        <meshStandardMaterial color="#222630" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Kitchen & Dining Calacatta Tile Flooring */}
      <mesh position={[2.5, 0.02, 2.2]} receiveShadow>
        <boxGeometry args={[4.8, 0.04, 4.0]} />
        <meshStandardMaterial color="#1a1d24" roughness={0.25} metalness={0.3} />
      </mesh>

      {/* Entrance Patio Flooring */}
      <mesh position={[-2.5, 0.02, 2.2]} receiveShadow>
        <boxGeometry args={[4.8, 0.04, 4.0]} />
        <meshStandardMaterial color="#14171f" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* ----------------- ARCHITECTURAL WALLS ----------------- */}
      {/* Back Wall */}
      <mesh position={[0, 1.5, -4.8]}>
        <boxGeometry args={[10.2, 3.0, 0.3]} />
        <meshStandardMaterial color="#181c24" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Left Wall (with Master Window Opening) */}
      <mesh position={[-5.0, 1.5, -4.0]}>
        <boxGeometry args={[0.3, 3.0, 1.8]} />
        <meshStandardMaterial color="#181c24" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[-5.0, 1.5, 0.4]}>
        <boxGeometry args={[0.3, 3.0, 1.8]} />
        <meshStandardMaterial color="#181c24" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Master Window Frame */}
      <mesh position={[-5.0, 1.6, -1.8]}>
        <boxGeometry args={[0.1, 2.8, 3.0]} />
        <meshPhysicalMaterial
          color="#a0c4e8"
          transmission={0.92}
          opacity={0.35}
          transparent
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Center Dividing Wall (Master Bedroom / Living Room) */}
      <mesh position={[0, 1.2, -2.4]}>
        <boxGeometry args={[0.25, 2.4, 4.6]} />
        <meshStandardMaterial color="#252a36" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Embedded LED Cove Glow Strip on Wall Top */}
      <mesh position={[0, 2.42, -2.4]}>
        <boxGeometry args={[0.27, 0.05, 4.6]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={lightsOn ? 1.8 : 0.1}
        />
      </mesh>

      {/* Right Wall (Living / Kitchen) */}
      <mesh position={[5.0, 1.3, -0.4]}>
        <boxGeometry args={[0.3, 2.6, 9.0]} />
        <meshStandardMaterial color="#181c24" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Glass Balustrade Perimeter */}
      <mesh position={[-2.5, 0.5, 4.3]}>
        <boxGeometry args={[4.8, 0.9, 0.06]} />
        <meshPhysicalMaterial
          color="#d0e2ec"
          transmission={0.88}
          opacity={0.4}
          transparent
          roughness={0.05}
        />
      </mesh>
      <mesh position={[2.5, 0.5, 4.3]}>
        <boxGeometry args={[4.8, 0.9, 0.06]} />
        <meshPhysicalMaterial
          color="#d0e2ec"
          transmission={0.88}
          opacity={0.4}
          transparent
          roughness={0.05}
        />
      </mesh>

      {/* ----------------- MASTER BEDROOM SUITE ----------------- */}
      {/* Platform King Bed Frame */}
      <mesh position={[-2.5, 0.25, -2.2]}>
        <boxGeometry args={[2.4, 0.35, 2.8]} />
        <meshStandardMaterial color="#1c202a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Headboard with Warm LED Backlighting */}
      <mesh position={[-2.5, 0.8, -3.65]}>
        <boxGeometry args={[2.6, 1.1, 0.15]} />
        <meshStandardMaterial color="#382d21" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-2.5, 1.38, -3.65]}>
        <boxGeometry args={[2.62, 0.04, 0.16]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={lightsOn ? 2.5 : 0.05}
        />
      </mesh>

      {/* Soft Mattress & Duvet */}
      <mesh position={[-2.5, 0.5, -2.1]}>
        <boxGeometry args={[2.2, 0.3, 2.5]} />
        <meshStandardMaterial color="#f3ede2" roughness={0.9} />
      </mesh>

      {/* Pillows */}
      <mesh position={[-3.0, 0.72, -3.1]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.45]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      <mesh position={[-2.0, 0.72, -3.1]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.45]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* Dual Nightstands & Bedside Lamps */}
      <mesh position={[-4.1, 0.25, -3.4]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#2d2218" roughness={0.5} />
      </mesh>
      <mesh position={[-4.1, 0.6, -3.4]}>
        <cylinderGeometry args={[0.12, 0.16, 0.3, 16]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#f59e0b"
          emissiveIntensity={lightsOn ? 2.0 : 0.05}
        />
      </mesh>

      <mesh position={[-0.9, 0.25, -3.4]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#2d2218" roughness={0.5} />
      </mesh>
      <mesh position={[-0.9, 0.6, -3.4]}>
        <cylinderGeometry args={[0.12, 0.16, 0.3, 16]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#f59e0b"
          emissiveIntensity={lightsOn ? 2.0 : 0.05}
        />
      </mesh>

      {/* ----------------- LIVING ROOM LOUNGE ----------------- */}
      {/* Modern Sectional Sofa */}
      <mesh position={[2.5, 0.35, -2.6]}>
        <boxGeometry args={[3.2, 0.45, 1.2]} />
        <meshStandardMaterial color="#dcd5c9" roughness={0.8} />
      </mesh>
      <mesh position={[4.0, 0.35, -1.5]}>
        <boxGeometry args={[1.0, 0.45, 1.4]} />
        <meshStandardMaterial color="#dcd5c9" roughness={0.8} />
      </mesh>
      {/* Sofa Backrest */}
      <mesh position={[2.5, 0.75, -3.15]}>
        <boxGeometry args={[3.2, 0.5, 0.25]} />
        <meshStandardMaterial color="#c8bfb0" roughness={0.85} />
      </mesh>

      {/* Smoked Glass & Marble Coffee Table */}
      <mesh position={[2.3, 0.2, -1.3]}>
        <boxGeometry args={[1.6, 0.22, 0.9]} />
        <meshPhysicalMaterial
          color="#1e222b"
          transmission={0.6}
          roughness={0.15}
          metalness={0.4}
        />
      </mesh>

      {/* Wall-Mounted Ultra-Thin OLED TV */}
      <group position={[0.15, 1.2, -1.3]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 1.0, 0.04]} />
          <meshStandardMaterial color="#0b0d11" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Dynamic Emissive Screen Surface */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.72, 0.92]} />
          <meshBasicMaterial
            color={tvOn ? "#38bdf8" : "#0f131a"}
          />
        </mesh>
      </group>

      {/* Music Equalizer Wave Floating Ring */}
      {musicOn && (
        <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[2.2, 1.6, -1.3]}>
            <torusGeometry args={[0.45, 0.03, 16, 32]} />
            <meshBasicMaterial color="#f59e0b" wireframe />
          </mesh>
        </Float>
      )}

      {/* ----------------- KITCHEN & DINING ----------------- */}
      {/* Waterfall Marble Kitchen Island */}
      <mesh position={[2.5, 0.55, 2.0]}>
        <boxGeometry args={[2.8, 0.9, 1.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Barstools */}
      {[-0.8, 0, 0.8].map((xOffset, idx) => (
        <group key={idx} position={[2.5 + xOffset, 0.35, 3.0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
            <meshStandardMaterial color="#1e2430" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.55, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Kitchen Pendant Downlights */}
      {[-0.8, 0, 0.8].map((xOffset, idx) => (
        <group key={idx} position={[2.5 + xOffset, 2.6, 2.0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            <meshStandardMaterial color="#181a20" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.14, 0.22, 16]} />
            <meshStandardMaterial
              color="#232732"
              emissive="#f59e0b"
              emissiveIntensity={lightsOn ? 1.5 : 0.05}
            />
          </mesh>
        </group>
      ))}

      {/* ----------------- PERIMETER SECURITY LASER ----------------- */}
      {securityArmed && (
        <group position={[0, 0.2, 0]}>
          <mesh position={[0, 0, -4.9]}>
            <boxGeometry args={[11.5, 0.04, 0.04]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[5.4, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 10.5]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[-5.4, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 10.5]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, 0, 4.9]}>
            <boxGeometry args={[11.5, 0.04, 0.04]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      )}

      {/* ----------------- SUB-COMPONENTS ----------------- */}
      {/* 1. Real 3D Motorized Curtains */}
      <MotorizedCurtains3D closed={curtainsClosed} />

      {/* 2. Real 3D Rotating Ceiling Fan */}
      <CeilingFan3D spinning={fanOn} />

      {/* 3. Real 3D Motorized Sliding Entrance Gate */}
      <MotorizedGate3D closed={gateClosed} />

      {/* ----------------- DYNAMIC THREE.JS LIGHTS ----------------- */}
      {/* Master Bedroom Warm PointLight */}
      <pointLight
        position={[-2.5, 2.4, -1.8]}
        color="#f59e0b"
        intensity={masterLightIntensity}
        distance={7}
        decay={2}
      />

      {/* Living Room Warm PointLight */}
      <pointLight
        position={[2.5, 2.6, -1.8]}
        color="#fbbf24"
        intensity={livingLightIntensity}
        distance={8}
        decay={2}
      />

      {/* Kitchen Island Warm SpotLight */}
      <spotLight
        position={[2.5, 3.2, 2.0]}
        target-position={[2.5, 0, 2.0]}
        color="#f59e0b"
        intensity={kitchenLightIntensity}
        angle={Math.PI / 3}
        penumbra={0.6}
      />

      {/* OLED TV Cinema Screen Glow */}
      {tvOn && (
        <pointLight
          position={[0.5, 1.2, -1.3]}
          color="#38bdf8"
          intensity={1.8}
          distance={4}
          decay={2}
        />
      )}
    </group>
  );
}

/* ========================================================================= */
/* 5. ROOT DIGITAL TWIN 3D VIEWPORT CONTAINER                                */
/* ========================================================================= */
export default function DigitalTwin3D(props: DigitalTwin3DProps) {
  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[480px] rounded-2xl overflow-hidden bg-[#07080b]">
      <Canvas
        camera={{ position: [11.5, 12.5, 13.5], fov: 36 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        {/* Soft Luxury Studio Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={0.8}
          color="#fffbeb"
          castShadow
        />
        <directionalLight
          position={[-10, 10, -8]}
          intensity={0.3}
          color="#94a3b8"
        />

        {/* 3D Villa Model */}
        <VillaModel3D {...props} />

        {/* Ground Soft Contact Shadows */}
        <ContactShadows
          position={[0, -0.96, 0]}
          opacity={0.65}
          scale={20}
          blur={2}
          far={4}
        />

        {/* Orbit Camera Controller */}
        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.15}
          minPolarAngle={Math.PI / 6}
          minDistance={10}
          maxDistance={30}
          enablePan={false}
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  );
}
