"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const lastSection = document.querySelector(".last-section");
    if (!footer || !lastSection) return;

    gsap.fromTo(
      footer,
      { y: -500 },
      {
        y: 0,
        ease: "power1.out", // easing suave
        scrollTrigger: {
          trigger: lastSection,
          start: "bottom bottom",
          end: "+=500", // distancia de scroll para la animación
          scrub: true, // añade “delay” suavizando el seguimiento del scroll
        },
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full h-dvh bg-black ps-[95px] text-[#4e4e4e] text-2xl tracking-[-0.01em] font-bold leading-[120%] flex flex-col justify-between"
    >
      <div className="h-[160px] border-b border-[#eadbc833]">
        <div className="flex justify-end items-center">
          <p className="h-[160px] w-[160px] flex items-center justify-center border-r border-[#eadbc833]">
            Social
          </p>
          <a
            href=""
            className="h-[160px] w-[160px] flex items-center justify-center border-r border-[#eadbc833]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#fff3e2"
                d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 0 1-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 0 0 2 2.866v10.268a.88.88 0 0 0 .885.866h10.226a.882.882 0 0 0 .889-.866V2.865a.88.88 0 0 0-.889-.864z"
              />
            </svg>
          </a>
          <a
            href=""
            className="h-[160px] w-[160px] flex items-center justify-center border-r border-[#eadbc833]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="-1 0 19 19"
            >
              <path
                fill="#fff3e2"
                d="M16.417 9.57a7.917 7.917 0 1 1-8.144-7.908 1.758 1.758 0 0 1 .451 0 7.913 7.913 0 0 1 7.693 7.907zM5.85 15.838q.254.107.515.193a11.772 11.772 0 0 1-1.572-5.92h-3.08a6.816 6.816 0 0 0 4.137 5.727zM2.226 6.922a6.727 6.727 0 0 0-.511 2.082h3.078a11.83 11.83 0 0 1 1.55-5.89q-.249.083-.493.186a6.834 6.834 0 0 0-3.624 3.622zm8.87 2.082a14.405 14.405 0 0 0-.261-2.31 9.847 9.847 0 0 0-.713-2.26c-.447-.952-1.009-1.573-1.497-1.667a8.468 8.468 0 0 0-.253 0c-.488.094-1.05.715-1.497 1.668a9.847 9.847 0 0 0-.712 2.26 14.404 14.404 0 0 0-.261 2.309zm-.974 5.676a9.844 9.844 0 0 0 .713-2.26 14.413 14.413 0 0 0 .26-2.309H5.903a14.412 14.412 0 0 0 .261 2.31 9.844 9.844 0 0 0 .712 2.259c.487 1.036 1.109 1.68 1.624 1.68s1.137-.644 1.623-1.68zm4.652-2.462a6.737 6.737 0 0 0 .513-2.107h-3.082a11.77 11.77 0 0 1-1.572 5.922q.261-.086.517-.194a6.834 6.834 0 0 0 3.624-3.621zM11.15 3.3a6.82 6.82 0 0 0-.496-.187 11.828 11.828 0 0 1 1.55 5.89h3.081A6.815 6.815 0 0 0 11.15 3.3z"
              />
            </svg>
          </a>
          <a
            href=""
            className="h-[160px] w-[160px] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="#fff3e2"
                fillRule="evenodd"
                d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                clipRule="evenodd"
              />
              <path fill="#fff3e2" d="M18 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
              <path
                fill="#fff3e2"
                fillRule="evenodd"
                d="M1.654 4.276C1 5.56 1 7.24 1 10.6v2.8c0 3.36 0 5.04.654 6.324a6 6 0 0 0 2.622 2.622C5.56 23 7.24 23 10.6 23h2.8c3.36 0 5.04 0 6.324-.654a6 6 0 0 0 2.622-2.622C23 18.44 23 16.76 23 13.4v-2.8c0-3.36 0-5.04-.654-6.324a6 6 0 0 0-2.622-2.622C18.44 1 16.76 1 13.4 1h-2.8c-3.36 0-5.04 0-6.324.654a6 6 0 0 0-2.622 2.622ZM13.4 3h-2.8c-1.713 0-2.878.002-3.778.075-.877.072-1.325.202-1.638.361a4 4 0 0 0-1.748 1.748c-.16.313-.29.761-.36 1.638C3.001 7.722 3 8.887 3 10.6v2.8c0 1.713.002 2.878.075 3.778.072.877.202 1.325.361 1.638a4 4 0 0 0 1.748 1.748c.313.16.761.29 1.638.36.9.074 2.065.076 3.778.076h2.8c1.713 0 2.878-.002 3.778-.075.877-.072 1.325-.202 1.638-.361a4 4 0 0 0 1.748-1.748c.16-.313.29-.761.36-1.638.074-.9.076-2.065.076-3.778v-2.8c0-1.713-.002-2.878-.075-3.778-.072-.877-.202-1.325-.361-1.638a4 4 0 0 0-1.748-1.748c-.313-.16-.761-.29-1.638-.36C16.278 3.001 15.113 3 13.4 3Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <div>
        <h2 className="text-[9rem] leading-[95%] tracking-[-0.04em] font-bold text-[#fee9ce] before:content-['\0022'] after:content-['\0022'] w-[70%] mx-auto text-center">
          No debatas lo que puedes probar.
        </h2>
      </div>
      <div className="py-16 border-t border-[#eadbc833] flex items-center justify-between">
        <div className="text-[#ef5143] flex items-center justify-center gap-8 ps-[20px]">
          <div className="pe-8 border-e border-[#eadbc833]">
            <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[1.5rem] leading-[130%] font-bold">
              <a
                href=""
                className="flex items-center gap-2 transition-transform duration-500 ease-in-out"
              >
                <span>Sitio Personal</span>
                <span
                  className="transition-transform duration-500 ease-in-out group-hover:rotate-45 inline-block"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  ↗
                </span>
              </a>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
            </div>
          </div>
          <div className="pe-8 border-e border-[#eadbc833]">
            <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[1.5rem] leading-[130%] font-bold">
              <a
                href=""
                className="flex items-center gap-2 transition-transform duration-500 ease-in-out"
              >
                <span>Medium</span>
                <span
                  className="transition-transform duration-500 ease-in-out group-hover:rotate-45 inline-block"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  ↗
                </span>
              </a>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
            </div>
          </div>
          <div className="pe-8 border-e border-[#eadbc833]">
            <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[1.5rem] leading-[130%] font-bold">
              <a
                href=""
                className="flex items-center gap-2 transition-transform duration-500 ease-in-out"
              >
                <span>Recursos</span>
                <span
                  className="transition-transform duration-500 ease-in-out group-hover:rotate-45 inline-block"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  ↗
                </span>
              </a>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
            </div>
          </div>
          <div>
            <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[1.5rem] leading-[130%] font-bold">
              <a
                href=""
                className="flex items-center gap-2 transition-transform duration-500 ease-in-out"
              >
                <span>Colophon</span>
                <span
                  className="transition-transform duration-500 ease-in-out group-hover:rotate-45 inline-block"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  ↗
                </span>
              </a>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
              <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
            </div>
          </div>
        </div>
        <div className="pe-[20px]">
          <p>
            Copyright ©2025. Todos los derechos reservados. Robar es un mal
            karma.
          </p>
        </div>
      </div>
    </footer>
  );
}
