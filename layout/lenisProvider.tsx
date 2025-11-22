"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis, { LenisRef } from "lenis/react";
import { ReactNode, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      {children}
    </>
  );
}
