"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const nav = navItemsRef.current;
    if (!nav) return;

    const items = Array.from(nav.children) as HTMLDivElement[];

    const groups = [
      document.querySelectorAll(".progress-1"),
      [document.querySelector(".progress-2")],
      [document.querySelector(".progress-3")],
      document.querySelectorAll(".progress-4"),
      [document.querySelector(".progress-5")],
    ];

    const computeGroupProgress = (nodes: NodeListOf<Element> | Element[]) => {
      if (!nodes || nodes.length === 0) return 0;

      for (const n of nodes as any) {
        if (!n) continue;
        const st = ScrollTrigger.getAll().find((t) => t.trigger === n);
        if (st) return st.progress ?? 0;
      }

      let minTop = Infinity;

      nodes.forEach((n: any) => {
        if (!n) return;
        const top = n.offsetTop;
        minTop = Math.min(minTop, top);
      });

      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const start = minTop - scrollY;

      let progress = 1 - start / vh;
      return Math.min(Math.max(progress, 0), 1);
    };

    const onScroll = () => {
      const horizontalST = ScrollTrigger.getById("horizontal");

      groups.forEach((group, i) => {
        const item = items[i];
        if (!item) return;

        let progress;
        if (i === 0) {
          progress = horizontalST?.progress ?? 0;
        } else {
          progress = computeGroupProgress(group as any);
        }

        item.style.setProperty("--progress", String(progress));

        const ps = item.querySelectorAll("p");
        const first = ps[0];
        const second = ps[1];

        const isActive = progress > 0 && progress < 1;
        const isLast = i === items.length - 1;
        const isFullyComplete = progress === 1;

        first.style.top = `10px`;

        if (isActive || (isLast && isFullyComplete)) {
          item.classList.add("active");

          second.style.width = "";
          second.style.height = "";
          second.style.opacity = "1";

          second.style.bottom = `${second.scrollWidth / 2}px`;

          const total = first.scrollWidth + second.scrollWidth;
          item.style.height = `${total + 32}px`;
        } else {
          item.classList.remove("active");

          second.style.width = "0";
          second.style.height = "0";
          second.style.padding = "0";
          second.style.opacity = "0";

          item.style.height = "10vh";
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="translate-x-0 fixed top-0 z-401 left-0 h-screen flex flex-col items-center w-24 border-e border-[#eadbc833] text-[21px] font-bold leading-[120%] uppercase bg-[#050505]">
      <div className="h-[112px] w-full border-b border-[#eadbc833]">
        <div className="relative w-full h-full group overflow-hidden">
          <div className="absolute bottom-1/2 left-1/2 -translate-x-[calc(2.4rem/2)] w-[2.4rem] h-[0.15em] overflow-hidden">
            <span className="absolute inset-0 bg-[#fff3e2] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
            <span className="absolute inset-0 bg-[#fff3e2] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
          </div>

          <div className="absolute bottom-1/3 left-1/2 -translate-x-[calc(2.4rem/2)] w-[1.6rem] h-[0.15em] overflow-hidden">
            <span className="absolute inset-0 bg-[#fff3e2] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
            <span className="absolute inset-0 bg-[#fff3e2] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
          </div>
        </div>
      </div>

      <div ref={navItemsRef} className="w-full text-[#fff3e2]">
        <div className="nav-item">
          <p className="absolute left-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            I.
          </p>
          <p className="absolute left-1/2 bottom-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            Intro
          </p>
        </div>
        <div className="nav-item">
          <p className="absolute left-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            II.
          </p>
          <p className="absolute left-1/2 bottom-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            Sobre nosotros
          </p>
        </div>
        <div className="nav-item">
          <p className="absolute left-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            III.
          </p>
          <p className="absolute left-1/2 bottom-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            Experiencia de marcas
          </p>
        </div>
        <div className="nav-item">
          <p className="absolute left-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            IV.
          </p>
          <p className="absolute left-1/2 bottom-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            Educación
          </p>
        </div>
        <div className="nav-item">
          <p className="absolute left-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            V.
          </p>
          <p className="absolute left-1/2 bottom-1/2 -translate-x-1/2 rotate-90 text-nowrap">
            Ponte en contacto
          </p>
        </div>
      </div>
      <div className="w-full text-[#0a0a0a] mt-auto">
        <div className="border-t border-[#eadbc833] flex justify-center items-center bg-[#ffb261] py-8">
          <p className="text-nowrap font-bold [writing-mode:sideways-lr] rotate-180">
            Conectemos
          </p>
        </div>
      </div>
    </header>
  );
}

/* const computeGroupProgress = (nodes: NodeListOf<Element> | Element[]) => {
      if (!nodes || nodes.length === 0) return 0;

      let minTop = Infinity;
      let maxBottom = -Infinity;

      nodes.forEach((n: any) => {
        if (!n) return;
        const rect = n.getBoundingClientRect();
        minTop = Math.min(minTop, rect.top);
        maxBottom = Math.max(maxBottom, rect.bottom);
      });

      const vh = window.innerHeight;

      const start = minTop;

      let progress = 1 - start / vh;
      progress = Math.min(Math.max(progress, 0), 1);

      return progress;
    }; */
