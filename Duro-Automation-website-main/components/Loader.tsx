"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useJourney } from "@/lib/store";

export default function Loader() {
  const { progress, active } = useProgress();
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);
  const setLoaded = useJourney((s) => s.setLoaded);

  const done = (progress >= 100 && !active) || progress >= 95;

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    // Trigger completion if Drei reports ready OR after safety timeout (3s max)
    const triggerComplete = () => {
      setLoaded(true);
      t1 = setTimeout(() => setFading(true), 300);
      t2 = setTimeout(() => setGone(true), 1200);
    };

    if (done) {
      triggerComplete();
    } else {
      // Safety fallback: never keep user stuck on loading screen longer than 3.5s
      const fallbackTimer = setTimeout(() => {
        triggerComplete();
      }, 3500);

      return () => {
        clearTimeout(fallbackTimer);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [done, setLoaded]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/duro-logo-gold.png"
        alt="DURO Automation"
        className="h-16 md:h-20 w-auto"
      />

      <div className="mt-10 h-px w-48 bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gold transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(progress, 15)}%` }}
        />
      </div>
      <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-stone-500">
        Preparing your walkthrough
      </p>
    </div>
  );
}
