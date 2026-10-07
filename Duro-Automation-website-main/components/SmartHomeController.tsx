"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const DigitalTwin3D = dynamic(() => import("./villa/DigitalTwin3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] rounded-2xl bg-[#07080b] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
    </div>
  ),
});

type SceneId = "morning" | "evening" | "arm_outside" | "home_away" | null;

export default function SmartHomeController() {
  // Appliance & Telemetry States
  const [temperature, setTemperature] = useState(23);
  const [lightsOn, setLightsOn] = useState(true);
  const [fanOn, setFanOn] = useState(false);
  const [curtainsClosed, setCurtainsClosed] = useState(true);
  const [gateClosed, setGateClosed] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [securityArmed, setSecurityArmed] = useState(false);
  const [tvOn, setTvOn] = useState(false);
  const [activeScene, setActiveScene] = useState<SceneId>("evening");

  // Temperature Handlers
  const handleTempMinus = () => setTemperature((t) => Math.max(16, t - 1));
  const handleTempPlus = () => setTemperature((t) => Math.min(30, t + 1));

  // Scene Handler
  const handleSceneClick = (scene: SceneId) => {
    setActiveScene(scene);
    if (scene === "morning") {
      setLightsOn(true);
      setFanOn(false);
      setCurtainsClosed(false);
      setGateClosed(true);
      setMusicOn(true);
      setSecurityArmed(false);
      setTvOn(false);
      setTemperature(24);
    } else if (scene === "evening") {
      setLightsOn(true);
      setFanOn(true);
      setCurtainsClosed(true);
      setGateClosed(true);
      setMusicOn(false);
      setSecurityArmed(false);
      setTvOn(true);
      setTemperature(23);
    } else if (scene === "arm_outside") {
      setLightsOn(true);
      setFanOn(false);
      setCurtainsClosed(true);
      setGateClosed(true);
      setMusicOn(false);
      setSecurityArmed(true);
      setTvOn(false);
      setTemperature(22);
    } else if (scene === "home_away") {
      setLightsOn(false);
      setFanOn(false);
      setCurtainsClosed(true);
      setGateClosed(true);
      setMusicOn(false);
      setSecurityArmed(true);
      setTvOn(false);
      setTemperature(21);
    }
  };

  return (
    <section className="w-full bg-black py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Main 2-Column Split: Pure 3D Digital Twin (Left) & Phone Controller (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ============================================================== */}
          {/* LEFT: PURE 3D WEBGL DIGITAL TWIN (Interactive Three.js Stage)  */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 bg-[#0b0d11] rounded-[28px] border border-neutral-800/80 p-5 sm:p-7 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[520px]">
            
            {/* Top Bar inside Digital Twin */}
            <div className="flex items-center justify-between z-20 mb-3">
              {/* DIGITAL TWIN · LIVE */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#d4af37]">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse shadow-[0_0_8px_#d4af37]" />
                <span className="uppercase text-[11px] tracking-widest text-[#f5ecd8]">
                  DIGITAL TWIN · LIVE
                </span>
              </div>

              {/* Dynamic Temperature Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181a20]/90 border border-[#2b2f3a] text-xs font-medium text-[#e2b774] shadow-sm">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-[#d4af37] fill-none" strokeWidth="2">
                  <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z" />
                </svg>
                <span>{temperature}°C</span>
              </div>
            </div>

            {/* Pure 3D WebGL Architectural Stage */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#07080b] border border-neutral-800/60 shadow-2xl flex items-center justify-center my-auto">
              <DigitalTwin3D
                lightsOn={lightsOn}
                fanOn={fanOn}
                curtainsClosed={curtainsClosed}
                gateClosed={gateClosed}
                tvOn={tvOn}
                musicOn={musicOn}
                securityArmed={securityArmed}
                temperature={temperature}
              />
            </div>

            {/* Bottom Controls / Orbit Hint */}
            <div className="flex items-center justify-between mt-3.5 z-20">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-[#13151b] border border-[#262a36] text-[11px] font-medium text-neutral-300 hover:text-white hover:border-[#d4af37]/60 transition flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                Custom control
              </button>

              <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                Drag to orbit • Scroll to zoom
              </span>
            </div>

          </div>

          {/* ============================================================== */}
          {/* RIGHT: DURO HOME PHONE CONTROLLER (Exact 1:1 Concept Replica) */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex justify-center">
            
            {/* Phone Bezel */}
            <div className="w-full max-w-[370px] bg-[#0c0d11] rounded-[48px] p-4 border-[2.5px] border-[#222632] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95)] select-none text-white font-sans">
              
              {/* Dynamic Island Header */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium px-4 pt-1 mb-2">
                <span>9:41</span>
                
                {/* Dynamic Island Pill */}
                <div className="w-24 h-4 bg-black rounded-full border border-[#1b1e27] shadow-inner" />
                
                <span>5G · 100%</span>
              </div>

              {/* Title & Subtitle */}
              <div className="px-2 pt-2 pb-3">
                <h3 className="font-serif text-2xl font-normal text-white tracking-tight">
                  My Residence
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Lights
                </p>
              </div>

              {/* CLIMATE BAR */}
              <div className="bg-[#14161b] rounded-2xl p-3.5 border border-[#232732] flex items-center justify-between mb-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-200">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[#d4af37] fill-none" strokeWidth="2">
                    <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z" />
                  </svg>
                  <span>Climate</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTempMinus}
                    className="w-7 h-7 rounded-full bg-[#1e222a] hover:bg-[#282d38] active:scale-90 text-neutral-300 flex items-center justify-center text-sm font-semibold border border-[#2b303c] transition cursor-pointer"
                  >
                    –
                  </button>
                  <span className="text-sm font-bold text-white tracking-tight min-w-[32px] text-center">
                    {temperature}°C
                  </span>
                  <button
                    type="button"
                    onClick={handleTempPlus}
                    className="w-7 h-7 rounded-full bg-[#1e222a] hover:bg-[#282d38] active:scale-90 text-neutral-300 flex items-center justify-center text-sm font-semibold border border-[#2b303c] transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2x3 CONTROL TILES GRID */}
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                
                {/* 1. LIGHTS */}
                <button
                  type="button"
                  onClick={() => setLightsOn(!lightsOn)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-[86px] transition-all duration-200 cursor-pointer ${
                    lightsOn
                      ? "bg-[#181611] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] text-white"
                      : "bg-[#14161b] border-[#232732] text-neutral-400 hover:border-[#323746]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${lightsOn ? "stroke-[#d4af37]" : "stroke-neutral-400"} fill-none`} strokeWidth="1.8">
                    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
                  </svg>
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      LIGHTS
                    </div>
                    <div className={`text-xs font-bold ${lightsOn ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                      {lightsOn ? "On" : "Off"}
                    </div>
                  </div>
                </button>

                {/* 2. FAN */}
                <button
                  type="button"
                  onClick={() => setFanOn(!fanOn)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-[86px] transition-all duration-200 cursor-pointer ${
                    fanOn
                      ? "bg-[#181611] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] text-white"
                      : "bg-[#14161b] border-[#232732] text-neutral-400 hover:border-[#323746]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${fanOn ? "stroke-[#d4af37] animate-spin" : "stroke-neutral-400"} fill-none`} strokeWidth="1.8">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 10C13 6 11.5 3 9.5 3S7 5 9 8M14 12C18 13 21 11.5 21 9.5S19 7 16 9M12 14C11 18 12.5 21 14.5 21S17 19 15 16M10 12C6 11 3 12.5 3 14.5S5 17 8 15" />
                  </svg>
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      FAN
                    </div>
                    <div className={`text-xs font-bold ${fanOn ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                      {fanOn ? "On" : "Off"}
                    </div>
                  </div>
                </button>

                {/* 3. CURTAINS */}
                <button
                  type="button"
                  onClick={() => setCurtainsClosed(!curtainsClosed)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-[86px] transition-all duration-200 cursor-pointer ${
                    !curtainsClosed
                      ? "bg-[#181611] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] text-white"
                      : "bg-[#14161b] border-[#232732] text-neutral-400 hover:border-[#323746]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${!curtainsClosed ? "stroke-[#d4af37]" : "stroke-neutral-400"} fill-none`} strokeWidth="1.8">
                    <path d="M3 4h18M4 4v16M20 4v16M4 20c3-1 4-4 4-8s-1-6-4-8M20 20c-3-1-4-4-4-8s1-6 4-8" />
                  </svg>
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      CURTAINS
                    </div>
                    <div className={`text-xs font-bold ${!curtainsClosed ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                      {curtainsClosed ? "Closed" : "Open"}
                    </div>
                  </div>
                </button>

                {/* 4. GATE */}
                <button
                  type="button"
                  onClick={() => setGateClosed(!gateClosed)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-[86px] transition-all duration-200 cursor-pointer ${
                    !gateClosed
                      ? "bg-[#181611] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] text-white"
                      : "bg-[#14161b] border-[#232732] text-neutral-400 hover:border-[#323746]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${!gateClosed ? "stroke-[#d4af37]" : "stroke-neutral-400"} fill-none`} strokeWidth="1.8">
                    <path d="M3 21V6l6-2M21 21V6l-6-2M9 4v17M15 4v17M3 21h18M7 8v9M11 8v9M17 8v9" />
                  </svg>
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      GATE
                    </div>
                    <div className={`text-xs font-bold ${!gateClosed ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                      {gateClosed ? "Closed" : "Open"}
                    </div>
                  </div>
                </button>

                {/* 5. MUSIC */}
                <button
                  type="button"
                  onClick={() => setMusicOn(!musicOn)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-[86px] transition-all duration-200 cursor-pointer ${
                    musicOn
                      ? "bg-[#181611] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] text-white"
                      : "bg-[#14161b] border-[#232732] text-neutral-400 hover:border-[#323746]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${musicOn ? "stroke-[#d4af37]" : "stroke-neutral-400"} fill-none`} strokeWidth="1.8">
                    <path d="M9 18V5l12-2v13M9 9l12-2M6 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM18 16a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
                  </svg>
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      MUSIC
                    </div>
                    <div className={`text-xs font-bold ${musicOn ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                      {musicOn ? "On" : "Off"}
                    </div>
                  </div>
                </button>

                {/* 6. SECURITY */}
                <button
                  type="button"
                  onClick={() => setSecurityArmed(!securityArmed)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-[86px] transition-all duration-200 cursor-pointer ${
                    securityArmed
                      ? "bg-[#181611] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] text-white"
                      : "bg-[#14161b] border-[#232732] text-neutral-400 hover:border-[#323746]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${securityArmed ? "stroke-[#d4af37]" : "stroke-neutral-400"} fill-none`} strokeWidth="1.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  </svg>
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      SECURITY
                    </div>
                    <div className={`text-xs font-bold ${securityArmed ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                      {securityArmed ? "Armed" : "Off"}
                    </div>
                  </div>
                </button>

              </div>

              {/* TELEVISION ROW */}
              <button
                type="button"
                onClick={() => setTvOn(!tvOn)}
                className={`w-full bg-[#14161b] rounded-2xl p-3 border flex items-center justify-between mb-3.5 transition-all cursor-pointer ${
                  tvOn ? "border-[#d4af37]/80 bg-[#191712]" : "border-[#232732] hover:border-[#323746]"
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-neutral-300">
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${tvOn ? "stroke-[#d4af37]" : "stroke-neutral-400"} fill-none`} strokeWidth="2">
                    <rect width="20" height="15" x="2" y="3" rx="2" />
                    <polyline points="17 21 12 18 7 21" />
                  </svg>
                  <span>TELEVISION</span>
                </div>
                <span className={`text-xs font-bold ${tvOn ? "text-[#f3e3ba]" : "text-neutral-500"}`}>
                  {tvOn ? "On" : "Off"}
                </span>
              </button>

              {/* SCENES SECTION */}
              <div className="space-y-2">
                <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 px-1">
                  SCENES
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "morning", label: "Good Morning" },
                    { id: "evening", label: "Good Evening" },
                    { id: "arm_outside", label: "Arm Outside" },
                    { id: "home_away", label: "Home Away" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSceneClick(s.id as SceneId)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer text-center ${
                        activeScene === s.id
                          ? "bg-[#1f222b] border-[#d4af37] text-white shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                          : "bg-[#14161b] border-[#232732] text-neutral-400 hover:text-neutral-200 hover:border-[#303544]"
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
    </section>
  );
}
