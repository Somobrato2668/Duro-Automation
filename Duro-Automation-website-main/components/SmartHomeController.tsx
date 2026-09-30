"use client";

import { useState } from "react";
import Image from "next/image";

type Scene = "good_morning" | "evening" | "night" | null;
type ClimateMode = "heat" | "cool" | "fan" | "dry" | "eco" | "auto";

/* ---------- Luxury Golden SVG Stroke Icons (Matching Concept) ---------- */
const goldStroke = {
  fill: "none",
  stroke: "#d4af37",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" {...goldStroke}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="16" y2="17" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" {...goldStroke}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ThermometerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z" />
  </svg>
);

const FanPropellerIcon = ({ spinning = false }: { spinning?: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${spinning ? "animate-spin duration-700" : ""}`} {...goldStroke}>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 10C13 6 11.5 3 9.5 3S7 5 9 8M14 12C18 13 21 11.5 21 9.5S19 7 16 9M12 14C11 18 12.5 21 14.5 21S17 19 15 16M10 12C6 11 3 12.5 3 14.5S5 17 8 15" />
  </svg>
);

const LightBulbIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M2 19h20M2 19V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3h12v8M2 13h20" />
    <circle cx="7" cy="10" r="1.5" />
  </svg>
);

const BathIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M4 12h16c1.1 0 2 .9 2 2v2a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-2c0-1.1.9-2 2-2Z" />
    <path d="M6 12V6a2 2 0 0 1 2-2h1M5 20l-1 2M19 20l1 2" />
  </svg>
);

const KitchenIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8ZM7 11V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5M10 4V2M14 4V2" />
  </svg>
);

const HallIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M3 21h18M5 21V8l7-4 7 4v13M9 13h6M9 17h6" />
  </svg>
);

const CurtainsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M3 4h18M4 4v16M20 4v16M4 20c3-1 4-4 4-8s-1-6-4-8M20 20c-3-1-4-4-4-8s1-6 4-8" />
  </svg>
);

const GateIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <path d="M3 21V6l6-2M21 21V6l-6-2M9 4v17M15 4v17M3 21h18M7 8v9M11 8v9M17 8v9" />
  </svg>
);

const ScenesGridIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" {...goldStroke}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ---------- iOS-Style Luxury Golden Toggle Switch Component ---------- */
function GoldToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer outline-none border ${
        checked
          ? "bg-[#d4af37] border-[#ecd27c] shadow-[0_0_8px_rgba(212,175,55,0.45)]"
          : "bg-[#252833] border-[#343846]"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full transition-transform duration-200 ease-out shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
          checked ? "translate-x-4 bg-[#fff9ea]" : "translate-x-0 bg-[#64748b]"
        }`}
      />
    </button>
  );
}

export default function SmartHomeController() {
  // --- Telemetry States ---
  const [temperature, setTemperature] = useState(23);
  const [climateMode, setClimateMode] = useState<ClimateMode>("heat");
  const [fanOn, setFanOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState<1 | 2 | 3 | 4>(2); // 1, 2, 3, MAX (4)

  // Room Light States
  const [bedroomLight, setBedroomLight] = useState(true);
  const [bathroomLight, setBathroomLight] = useState(true);
  const [kitchenLight, setKitchenLight] = useState(true);
  const [hallLight, setHallLight] = useState(false);

  // Curtains & Gate
  const [curtainPos, setCurtainPos] = useState(65); // 0% closed to 100% open
  const [gateOpen, setGateOpen] = useState(false);

  // Active Scene
  const [activeScene, setActiveScene] = useState<Scene>("evening");

  // Temp Handlers
  const handleTempMinus = () => setTemperature((t) => Math.max(16, t - 1));
  const handleTempPlus = () => setTemperature((t) => Math.min(30, t + 1));

  // Scene Apply
  const applyScene = (scene: Scene) => {
    setActiveScene(scene);
    if (scene === "good_morning") {
      setBedroomLight(true);
      setBathroomLight(false);
      setKitchenLight(true);
      setHallLight(true);
      setFanOn(false);
      setCurtainPos(100);
      setTemperature(24);
      setClimateMode("cool");
    } else if (scene === "evening") {
      setBedroomLight(true);
      setBathroomLight(true);
      setKitchenLight(true);
      setHallLight(false);
      setFanOn(true);
      setFanSpeed(2);
      setCurtainPos(65);
      setTemperature(23);
      setClimateMode("heat");
    } else if (scene === "night") {
      setBedroomLight(false);
      setBathroomLight(false);
      setKitchenLight(false);
      setHallLight(false);
      setFanOn(true);
      setFanSpeed(1);
      setCurtainPos(0);
      setGateOpen(false);
      setTemperature(21);
      setClimateMode("dry");
    }
  };

  // Fan Animation speed class
  const fanSpeedClass =
    fanSpeed === 1
      ? "[animation-duration:1.8s]"
      : fanSpeed === 2
      ? "[animation-duration:1.1s]"
      : fanSpeed === 3
      ? "[animation-duration:0.6s]"
      : "[animation-duration:0.28s]";

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-neutral-100 rounded-3xl border border-neutral-800/80 shadow-2xl overflow-hidden font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-neutral-800/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Live 3D Single-Floor Digital Twin
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            DURO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">HOME</span> Controller
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Refined luxury titanium controller synchronized live with single-floor architectural dissection.
          </p>
        </div>

        {/* Quick Room Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-neutral-400">Master Bed:</span>
            <span className={bedroomLight ? "text-amber-400 font-semibold" : "text-neutral-500"}>
              {bedroomLight ? "LIT" : "UNLIT"}
            </span>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-neutral-400">Ceiling Fan:</span>
            <span className={fanOn ? "text-amber-400 font-semibold" : "text-neutral-500"}>
              {fanOn ? `SPD ${fanSpeed === 4 ? "MAX" : fanSpeed}` : "OFF"}
            </span>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-neutral-400">Main Gate:</span>
            <span className={gateOpen ? "text-emerald-400 font-semibold" : "text-amber-500 font-semibold"}>
              {gateOpen ? "OPEN" : "CLOSED"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 3D Twin (7 cols), Right Phone Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: Clean Photorealistic Single-Story Digital Twin     */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-neutral-900/40 rounded-3xl border border-neutral-800/90 p-4 sm:p-6 relative overflow-hidden group shadow-inner">
          
          {/* Section Subheader */}
          <div className="flex items-center justify-between z-20 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Single-Story Architectural Cutaway Twin
              </span>
            </div>
            <div className="text-xs text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-mono">
              60 FPS • Real-Time Motion
            </div>
          </div>

          {/* Interactive Stage Container */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl flex items-center justify-center">
            
            {/* Base Image: Clean Single-Story Floorplan */}
            <Image
              src="/images/digital-twin-single-story.jpg"
              alt="Single Story Smart Home Floorplan Dissection"
              fill
              priority
              className="object-cover object-center select-none"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* ---------------------------------------------------------- */}
            {/* REALISTIC LIGHT GLOW 1: MASTER BEDROOM HEADBOARD & COVE    */}
            {/* ---------------------------------------------------------- */}
            <div
              className={`absolute top-[14%] left-[12%] w-[28%] h-[36%] rounded-full blur-xl pointer-events-none transition-opacity duration-700 bg-gradient-to-r from-amber-400/70 via-yellow-300/50 to-orange-400/40 mix-blend-color-dodge ${
                bedroomLight ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* ---------------------------------------------------------- */}
            {/* REALISTIC LIGHT GLOW 2: BATHROOM MIRROR & VANITY LED       */}
            {/* ---------------------------------------------------------- */}
            <div
              className={`absolute top-[8%] left-[36%] w-[22%] h-[26%] rounded-full blur-lg pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-amber-300/70 to-yellow-200/50 mix-blend-screen ${
                bathroomLight ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* ---------------------------------------------------------- */}
            {/* REALISTIC LIGHT GLOW 3: LIVING AREA COVE & SOFA AMBIENCE   */}
            {/* ---------------------------------------------------------- */}
            <div
              className={`absolute top-[22%] left-[54%] w-[32%] h-[34%] rounded-full blur-2xl pointer-events-none transition-opacity duration-700 bg-amber-400/50 mix-blend-screen ${
                hallLight ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* ---------------------------------------------------------- */}
            {/* REALISTIC LIGHT GLOW 4: KITCHEN ISLAND & DINING PENDANTS   */}
            {/* ---------------------------------------------------------- */}
            <div
              className={`absolute top-[44%] left-[60%] w-[32%] h-[38%] rounded-full blur-xl pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-amber-500/60 via-yellow-300/50 to-amber-200/40 mix-blend-color-dodge ${
                kitchenLight ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* ---------------------------------------------------------- */}
            {/* SEAMLESS MOTORIZED WINDOW CURTAIN SHEER OVERLAY            */}
            {/* Clipped strictly within the window frame polygon           */}
            {/* ---------------------------------------------------------- */}
            <svg
              viewBox="0 0 980 653"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <clipPath id="bedroomGlassClip">
                  <polygon points="135,110 213,148 213,265 135,227" />
                </clipPath>
              </defs>
              <g clipPath="url(#bedroomGlassClip)">
                <polygon
                  points="135,110 213,148 213,265 135,227"
                  fill="rgba(240, 235, 225, 0.88)"
                  style={{
                    opacity: (100 - curtainPos) / 100,
                    transition: "opacity 600ms ease-in-out",
                  }}
                />
                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                  const x = 135 + i * 11;
                  const yTop = 110 + i * 5.4;
                  const yBottom = 227 + i * 5.4;
                  return (
                    <line
                      key={i}
                      x1={x}
                      y1={yTop}
                      x2={x}
                      y2={yBottom}
                      stroke="rgba(180, 170, 155, 0.4)"
                      strokeWidth="1.2"
                      style={{
                        opacity: (100 - curtainPos) / 100,
                        transition: "opacity 600ms ease-in-out",
                      }}
                    />
                  );
                })}
              </g>
            </svg>

            {/* ---------------------------------------------------------- */}
            {/* SINGLE WORKABLE MASTER BEDROOM CEILING FAN OVERLAY         */}
            {/* Aligned EXACTLY on the ceiling mount rod (x:27.0%, y:32.1%)*/}
            {/* ---------------------------------------------------------- */}
            <div className="absolute top-[32.1%] left-[27.0%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <div
                className={`w-[90px] h-[90px] origin-center transition-transform duration-500 ${
                  fanOn ? `animate-spin ${fanSpeedClass}` : "rotate-0 opacity-95"
                }`}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                  {fanOn && (
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="6 4" />
                  )}

                  {/* 5 Premium Dark Metallic Ceiling Fan Blades */}
                  {[0, 72, 144, 216, 288].map((angle, idx) => (
                    <g key={idx} transform={`rotate(${angle} 50 50)`}>
                      <path
                        d="M 50 42 Q 54 12 50 3 C 44 3 42 12 50 42 Z"
                        fill="url(#metallicBladeGrad)"
                        stroke="rgba(148, 163, 184, 0.6)"
                        strokeWidth="1"
                      />
                      <line x1="50" y1="40" x2="50" y2="8" stroke="#E2E8F0" strokeWidth="0.8" opacity="0.75" />
                    </g>
                  ))}

                  {/* Fan Motor Housing & Dark Center Hub */}
                  <circle cx="50" cy="50" r="11" fill="url(#metallicHubGrad)" stroke="#64748B" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="4" fill="#F8FAFC" opacity="0.9" />

                  <defs>
                    <radialGradient id="metallicHubGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="60%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </radialGradient>
                    <linearGradient id="metallicBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="50%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* MOTORIZED ARCHITECTURAL SLIDING ENTRANCE GATE / DOOR       */}
            {/* Smoothly glides along the paved patio entrance rail        */}
            {/* ---------------------------------------------------------- */}
            <div className="absolute top-[67%] left-[41%] w-[15%] h-[12%] pointer-events-none z-30">
              <svg viewBox="0 0 140 80" className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]">
                <defs>
                  <linearGradient id="slidingDoorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0F172A" />
                    <stop offset="40%" stopColor="#334155" />
                    <stop offset="80%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>

                  <linearGradient id="gatePillarGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>

                {/* Ground Guide Rail */}
                <line x1="-15" y1="20" x2="120" y2="85" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="-15" y1="21" x2="120" y2="86" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

                {/* Left Structural Guide Post */}
                <g>
                  <polygon points="12,18 24,12 24,52 12,58" fill="url(#gatePillarGrad2)" stroke="#64748B" strokeWidth="0.8" />
                  <polygon points="0,24 12,18 12,58 0,64" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
                  <polygon points="0,24 12,18 24,12 12,18" fill="#64748B" />
                  <circle cx="12" cy="17" r="3" fill={gateOpen ? "#34D399" : "#F59E0B"} className="transition-colors duration-500" />
                  <circle cx="12" cy="17" r="6" fill={gateOpen ? "rgba(52,211,153,0.4)" : "rgba(245,158,11,0.4)"} className="transition-colors duration-500 animate-pulse" />
                </g>

                {/* Right Structural Stop Post */}
                <g>
                  <polygon points="122,72 134,66 134,106 122,112" fill="url(#gatePillarGrad2)" stroke="#64748B" strokeWidth="0.8" />
                  <polygon points="110,78 122,72 122,112 110,118" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
                  <polygon points="110,78 122,72 134,66 122,72" fill="#64748B" />
                  <circle cx="122" cy="71" r="3" fill={gateOpen ? "#34D399" : "#F59E0B"} className="transition-colors duration-500" />
                  <circle cx="122" cy="71" r="6" fill={gateOpen ? "rgba(52,211,153,0.4)" : "rgba(245,158,11,0.4)"} className="transition-colors duration-500 animate-pulse" />
                </g>

                {/* Motorized Sliding Gate Panel */}
                <g
                  style={{
                    transform: gateOpen ? "translate(-85px, -42px)" : "translate(0px, 0px)",
                    transition: "transform 850ms cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  <polygon
                    points="16,19 116,68 116,38 16,-11"
                    fill="url(#slidingDoorGrad)"
                    stroke="#F59E0B"
                    strokeWidth="1.4"
                  />
                  {[6, 12, 18, 24, 30, 36, 42].map((offsetY, idx) => (
                    <line
                      key={idx}
                      x1={18}
                      y1={-9 + offsetY}
                      x2={114}
                      y2={39 + offsetY}
                      stroke="rgba(245, 158, 11, 0.5)"
                      strokeWidth="1.2"
                    />
                  ))}
                  <line
                    x1={16}
                    y1={-11}
                    x2={116}
                    y2={38}
                    stroke={gateOpen ? "#34D399" : "#FCD34D"}
                    strokeWidth="1.5"
                    className="transition-colors duration-500"
                  />
                  <line x1="26" y1="8" x2="26" y2="28" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Driveway Guide Light Beam */}
                {gateOpen && (
                  <polygon
                    points="24,36 110,78 95,95 5,50"
                    fill="rgba(52, 211, 153, 0.2)"
                    style={{ mixBlendMode: "screen" }}
                    className="animate-pulse"
                  />
                )}
              </svg>
            </div>

          </div>

          {/* Quick Room Telemetry Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4 z-20">
            <button
              onClick={() => setBedroomLight(!bedroomLight)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                bedroomLight
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <span>Master Bed</span>
              <span className={`w-2 h-2 rounded-full ${bedroomLight ? "bg-amber-400" : "bg-neutral-600"}`} />
            </button>

            <button
              onClick={() => setBathroomLight(!bathroomLight)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                bathroomLight
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <span>Bathroom</span>
              <span className={`w-2 h-2 rounded-full ${bathroomLight ? "bg-amber-400" : "bg-neutral-600"}`} />
            </button>

            <button
              onClick={() => setKitchenLight(!kitchenLight)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                kitchenLight
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <span>Kitchen</span>
              <span className={`w-2 h-2 rounded-full ${kitchenLight ? "bg-amber-400" : "bg-neutral-600"}`} />
            </button>

            <button
              onClick={() => setHallLight(!hallLight)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                hallLight
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <span>Living Area</span>
              <span className={`w-2 h-2 rounded-full ${hallLight ? "bg-amber-400" : "bg-neutral-600"}`} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: DURO HOME Ultra-Refined Smartphone Controller    */}
        {/* Exact 1:1 match to concept: Neumorphic dark cards & iOS toggles */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          
          {/* Smartphone Bezel Device Frame */}
          <div className="w-full max-w-[380px] bg-[#1a1c23] rounded-[50px] p-2.5 border-[3px] border-[#2c303d] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.18)] relative select-none">
            
            {/* Screen Glass Area */}
            <div className="bg-[#0e1014] rounded-[42px] px-4 pt-3 pb-5 border border-[#1e222c] space-y-3.5 relative overflow-hidden">
              
              {/* Dynamic Island Pill */}
              <div className="w-28 h-5 bg-black rounded-full mx-auto flex items-center justify-between px-3 border border-[#222632] shadow-inner mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#181a20] border border-[#2a2e3a]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#14161a]" />
              </div>

              {/* Phone Header: Hamburger, DURO HOME, Notification Bell */}
              <div className="flex items-center justify-between px-1 pt-1 pb-1">
                <button type="button" className="p-1 text-neutral-400 hover:text-amber-400 transition cursor-pointer">
                  <MenuIcon />
                </button>

                <div className="text-center">
                  <span className="text-base font-bold tracking-wider text-[#e2b774]">DURO</span>{" "}
                  <span className="text-base font-semibold tracking-wider text-[#f3e5cb]">HOME</span>
                </div>

                <div className="relative p-1">
                  <BellIcon />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                </div>
              </div>

              {/* CARD 1: CLIMATE */}
              <div className="bg-[#15171e] rounded-2xl p-3 border border-[#232733] shadow-[0_4px_16px_rgba(0,0,0,0.4)] space-y-2">
                {/* Title Line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                    <ThermometerIcon />
                    <span>Climate</span>
                  </div>
                  <button type="button" className="flex items-center gap-0.5 text-neutral-400 hover:text-amber-300 text-[11px] cursor-pointer">
                    <span>Modes</span>
                    <ChevronRight />
                  </button>
                </div>

                {/* Temp & Mode Buttons Grid */}
                <div className="flex items-center justify-between pt-0.5">
                  {/* Temp Display & Up/Down Chevrons */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-3xl font-light text-white tracking-tight">{temperature}°C</div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={handleTempPlus}
                        className="w-6 h-6 rounded-lg bg-[#20232c] hover:bg-[#282d38] active:scale-90 text-neutral-300 flex items-center justify-center text-xs font-bold border border-[#2a2e3a] transition cursor-pointer"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={handleTempMinus}
                        className="w-6 h-6 rounded-lg bg-[#20232c] hover:bg-[#282d38] active:scale-90 text-neutral-300 flex items-center justify-center text-xs font-bold border border-[#2a2e3a] transition cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* 2x3 Mode Matrix (Heat, Cool, Fan, Dry, Eco, Auto) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "heat", label: "♨" },
                      { id: "cool", label: "❄" },
                      { id: "fan", label: "≋" },
                      { id: "dry", label: "💧" },
                      { id: "eco", label: "🌿" },
                      { id: "auto", label: "⚙" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setClimateMode(m.id as ClimateMode)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition cursor-pointer border ${
                          climateMode === m.id
                            ? "bg-[#d4af37] text-neutral-950 font-bold border-[#f2d06b] shadow-[0_0_10px_rgba(212,175,55,0.45)]"
                            : "bg-[#1f222b] text-neutral-400 border-[#282c37] hover:border-[#383d4c] hover:text-neutral-200"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2: FAN CONTROL */}
              <div className="bg-[#15171e] rounded-2xl p-3 border border-[#232733] shadow-[0_4px_16px_rgba(0,0,0,0.4)] space-y-2.5">
                {/* Title Line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                    <FanPropellerIcon spinning={fanOn} />
                    <span>Fan Control</span>
                  </div>
                  <button type="button" className="flex items-center gap-0.5 text-neutral-400 hover:text-amber-300 text-[11px] cursor-pointer">
                    <span>Speed</span>
                    <ChevronRight />
                  </button>
                </div>

                {/* Controls Line */}
                <div className="flex items-center justify-between pt-0.5">
                  {/* Master ON/OFF Segmented Pill */}
                  <div className="bg-[#0e1014] p-0.5 rounded-full border border-[#232630] flex items-center">
                    <button
                      type="button"
                      onClick={() => setFanOn(true)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        fanOn ? "bg-[#d4af37] text-neutral-950 shadow" : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      ON
                    </button>
                    <button
                      type="button"
                      onClick={() => setFanOn(false)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        !fanOn ? "bg-[#282c37] text-white shadow" : "text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      OFF
                    </button>
                  </div>

                  {/* 1, 2, 3, MAX Segmented Pill */}
                  <div className="bg-[#0e1014] p-0.5 rounded-xl border border-[#232630] flex items-center gap-1">
                    {([1, 2, 3, 4] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => {
                          setFanSpeed(spd);
                          if (!fanOn) setFanOn(true);
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          fanOn && fanSpeed === spd
                            ? "bg-[#d4af37] text-neutral-950 shadow-[0_0_8px_rgba(212,175,55,0.35)]"
                            : "text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        {spd === 4 ? "MAX" : spd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: LIGHTS (2x2 GRID WITH IOS GOLDEN TOGGLES) */}
              <div className="bg-[#15171e] rounded-2xl p-3 border border-[#232733] shadow-[0_4px_16px_rgba(0,0,0,0.4)] space-y-2.5">
                {/* Title Line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                    <LightBulbIcon />
                    <span>Lights</span>
                  </div>
                  <ChevronRight />
                </div>

                {/* 2x2 Room Grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-0.5">
                  {/* Master Bed */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                      <BedIcon />
                      <span className="text-[11px]">Master Bed</span>
                    </div>
                    <GoldToggleSwitch checked={bedroomLight} onChange={() => setBedroomLight(!bedroomLight)} />
                  </div>

                  {/* Bathroom */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                      <BathIcon />
                      <span className="text-[11px]">Bathroom</span>
                    </div>
                    <GoldToggleSwitch checked={bathroomLight} onChange={() => setBathroomLight(!bathroomLight)} />
                  </div>

                  {/* Kitchen */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                      <KitchenIcon />
                      <span className="text-[11px]">Kitchen</span>
                    </div>
                    <GoldToggleSwitch checked={kitchenLight} onChange={() => setKitchenLight(!kitchenLight)} />
                  </div>

                  {/* Living Hall */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                      <HallIcon />
                      <span className="text-[11px]">Hall</span>
                    </div>
                    <GoldToggleSwitch checked={hallLight} onChange={() => setHallLight(!hallLight)} />
                  </div>
                </div>
              </div>

              {/* CARD 4: CURTAINS */}
              <div className="bg-[#15171e] rounded-2xl p-3 border border-[#232733] shadow-[0_4px_16px_rgba(0,0,0,0.4)] space-y-2">
                {/* Title Line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                    <CurtainsIcon />
                    <span>Curtains</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium">{curtainPos}% Open</span>
                </div>

                {/* Slider Row */}
                <div className="flex items-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setCurtainPos((p) => Math.max(0, p - 10))}
                    className="text-neutral-400 hover:text-white text-xs font-bold px-1 cursor-pointer"
                  >
                    —
                  </button>
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={curtainPos}
                      onChange={(e) => setCurtainPos(Number(e.target.value))}
                      className="w-full accent-[#d4af37] bg-[#222632] rounded-lg cursor-pointer h-1.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurtainPos((p) => Math.min(100, p + 10))}
                    className="text-neutral-400 hover:text-white text-xs font-bold px-1 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CARD 5: MAIN SLIDING GATE */}
              <div className="bg-[#15171e] rounded-2xl p-3 border border-[#232733] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GateIcon />
                  <span className="text-xs font-semibold text-neutral-200">Main Gate</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {gateOpen ? "Open" : "Closed"}
                  </span>
                  <GoldToggleSwitch checked={gateOpen} onChange={() => setGateOpen(!gateOpen)} />
                </div>
              </div>

              {/* CARD 6: SCENES */}
              <div className="bg-[#15171e] rounded-2xl p-3 border border-[#232733] shadow-[0_4px_16px_rgba(0,0,0,0.4)] space-y-2">
                {/* Title Line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                    <ScenesGridIcon />
                    <span>Scenes</span>
                  </div>
                  <ChevronRight />
                </div>

                {/* Scene Pills */}
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {[
                    { id: "good_morning", label: "Good Morning" },
                    { id: "evening", label: "Evening" },
                    { id: "night", label: "Night" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => applyScene(s.id as Scene)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition border cursor-pointer text-center ${
                        activeScene === s.id
                          ? "bg-[#252834] border-[#d4af37] text-[#f7edd8] shadow-[0_0_10px_rgba(212,175,55,0.25)]"
                          : "bg-[#1b1d25] border-[#272b38] text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
