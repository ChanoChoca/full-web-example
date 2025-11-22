"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  // Animación texto inicial
  useEffect(() => {
    const titles = gsap.utils.toArray<HTMLParagraphElement>(
      "section:first-of-type p"
    );
    if (!titles.length) return;

    const container = titles[0].parentElement;
    if (!container) return;

    titles.forEach((t) => (t.style.lineHeight = "1"));

    const lines = titles.length;

    const setupLayout = () => {
      const containerHeight = container.clientHeight;
      const targetFontSize = containerHeight / lines;

      titles.forEach((title) => {
        title.style.fontSize = `${targetFontSize}px`;
        title.style.margin = "0";
      });

      return targetFontSize;
    };

    let targetFontSize = setupLayout();

    gsap.set(titles, {
      position: "absolute",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      y: window.innerHeight,
      scale: 0.8,
      opacity: 0,
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    titles.forEach((title, i) => {
      const yOffset = (i - (lines - 1) / 2) * targetFontSize; // -1.5 * ancho de parrafo, -0.5 * ...
      tl.to(
        title,
        {
          y: yOffset, // esos valores hacen ubicar a los elementos en el medio
          opacity: 1,
          scale: 1,
          duration: 1,
        },
        i * 0.2 // Retraso incremental
      );

      tl.to(
        titles,
        {
          left: 0,
          xPercent: 0,
          top: 0,
          yPercent: 0,
          y: (i) => i * targetFontSize,
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.05,
        },
        "+=0.4"
      );
    });

    const handleResize = () => {
      targetFontSize = setupLayout();

      titles.forEach((title, i) => {
        const newY = i * targetFontSize;
        gsap.set(title, { y: newY });
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      tl.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll horizontal
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let totalWidth = container.scrollWidth - window.innerWidth;

    const tween = gsap.to(container, {
      x: () => -totalWidth,
      scrollTrigger: {
        id: "horizontal",
        trigger: container,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: true,
      },
    });

    const handleResize = () => {
      if (tween.scrollTrigger) {
        totalWidth = container.scrollWidth - window.innerWidth;
        tween.vars.x = () => -totalWidth;
        tween.scrollTrigger.vars.end = `+=${totalWidth}`;
        tween.scrollTrigger.update();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  // Parrafos dentro de la sección horizontal (efecto persiana)
  const paragraphsRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!paragraphsRef.current) return;

    const paragraphs = paragraphsRef.current.querySelectorAll("p");

    paragraphs.forEach((p) => {
      const split = new SplitText(p, { type: "lines" });
      const lines = split.lines;

      gsap.set(lines, { yPercent: 100, opacity: 0 });

      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: p,
          start: "top 50%",
          //onEnter, onLeave, onEnterBack, onLeaveBack
          toggleActions: "play none none none",
        },
      });
    });
  }, []);

  // Animación texto background
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const textElements =
      document.querySelectorAll<HTMLParagraphElement>(".animate-text");

    textElements.forEach((textElement) => {
      const text = textElement.textContent?.trim();
      if (!text) return;
      textElement.setAttribute("data-text", text);

      ScrollTrigger.create({
        trigger: textElement,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

          const velocity = self.getVelocity();

          const maxAngle = 1;
          const angle = gsap.utils.clamp(-maxAngle, maxAngle, velocity / 100);

          gsap.to(textElement, {
            transform: `skew(0deg, ${angle}deg)`,
            duration: 0.15,
            ease: "power2.out",
          });

          scrollTimeout.current = setTimeout(() => {
            gsap.to(textElement, {
              transform: "skew(0deg, 0deg)",
              duration: 0.6,
              ease: "power3.out",
            });
          }, 120);

          const clipValue = Math.max(0, 100 - self.progress * 100);
          textElement.style.setProperty("--clip-value", `${clipValue}%`);
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Animación brands
  const brandsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const brands = brandsRef.current;
    if (!brands) return;

    const target = brands.querySelector<HTMLDivElement>(".brands");
    const box = brands.querySelector<HTMLDivElement>(".box");
    const parent = brands.querySelector<HTMLDivElement>(".div");
    if (!target || !box || !parent) return;

    const boxHeight = box.offsetHeight;
    const brandHeight = target.offsetHeight;

    box.style.top = `calc(${brandHeight / 2 - boxHeight / 2}px)`;

    const endDistance = parent.offsetHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "center center",
        end: `+=${endDistance}`,
        pin: true,
        scrub: true,
      },
    });

    tl.fromTo(box, { y: 0 }, { y: endDistance, ease: "none" }, 0);

    const textElements =
      document.querySelectorAll<HTMLParagraphElement>(".animate-text-2");

    textElements.forEach((textElement) => {
      const text = textElement.textContent?.trim();
      if (!text) return;
      textElement.setAttribute("data-text", text);

      ScrollTrigger.create({
        trigger: textElement,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          const clipValue = Math.max(0, 100 - self.progress * 100);
          textElement.style.setProperty("--clip-value", `${clipValue}%`);
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Animación textos repetidos
  const whoAmIRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const services = whoAmIRef.current;
    if (!services) return;
    const paragraphs = services.querySelectorAll<HTMLParagraphElement>("p");
    if (!paragraphs.length) return;

    const centerIndex = 3;

    let viewportHeight = window.innerHeight;
    let textHeight = paragraphs[0].offsetHeight;
    let maxOffset = (viewportHeight - textHeight) / 2;

    const trigger = ScrollTrigger.create({
      id: "services",
      trigger: services,
      start: "top top",
      end: () => `+=${viewportHeight * 2}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;

        gsap.set(paragraphs[0], { y: maxOffset * p });
        gsap.set(paragraphs[1], { y: maxOffset * 0.66 * p });
        gsap.set(paragraphs[2], { y: maxOffset * 0.33 * p });

        gsap.set(paragraphs[centerIndex], { y: 0 });

        gsap.set(paragraphs[4], { y: -maxOffset * 0.33 * p });
        gsap.set(paragraphs[5], { y: -maxOffset * 0.66 * p });
        gsap.set(paragraphs[6], { y: -maxOffset * 1 * p });
      },
    });

    const handleResize = () => {
      viewportHeight = window.innerHeight;
      textHeight = paragraphs[0].offsetHeight;
      maxOffset = (viewportHeight - textHeight) / 2;

      trigger.vars.end = () => `+=${viewportHeight * 2}`;
      trigger.update();
      trigger.scroll(trigger.start + trigger.progress * trigger.end);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animación cambio de color background
  const nextSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    const whoAmI = whoAmIRef.current;
    const nextSection = nextSectionRef.current;
    if (!main || !whoAmI || !nextSection) return;

    let isColored = false;

    const toColor = () =>
      gsap.to(main, {
        backgroundColor: "#ffe9cf",
        duration: 0.6,
        ease: "power2.out",
      });

    const toOriginal = () =>
      gsap.to(main, {
        backgroundColor: "#000000",
        duration: 0.8,
        ease: "power3.out",
      });

    const trigger = ScrollTrigger.create({
      trigger: whoAmI,
      start: "top center",
      end: () => {
        const spacer = whoAmI.parentElement;
        const spacerHeight = spacer ? spacer.offsetHeight : 0;
        return spacerHeight;
      },
      onEnter: () => {
        if (!isColored) {
          isColored = true;
          toColor();
        }
      },
      onEnterBack: () => {
        if (!isColored) {
          isColored = true;
          toColor();
        }
      },
      onLeave: () => {
        if (isColored) {
          isColored = false;
          toOriginal();
        }
      },
      onLeaveBack: () => {
        if (isColored) {
          isColored = false;
          toOriginal();
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Profesor de UX
  useEffect(() => {
    if (!nextSectionRef.current) return;

    const paragraphs = nextSectionRef.current.querySelectorAll("p");
    const headings = nextSectionRef.current.querySelectorAll("h2");

    paragraphs.forEach((p) => {
      const split = new SplitText(p, { type: "lines" });
      const lines = split.lines;

      gsap.set(lines, { yPercent: 100, opacity: 0 });

      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: p,
          start: "top 70%",
          //onEnter, onLeave, onEnterBack, onLeaveBack
          toggleActions: "play none none none",
        },
      });
    });

    headings.forEach((p) => {
      const split = new SplitText(p, { type: "lines" });
      const lines = split.lines;

      gsap.set(lines, { yPercent: 100, opacity: 0 });

      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: p,
          start: "top 70%",
          //onEnter, onLeave, onEnterBack, onLeaveBack
          toggleActions: "play none none none",
        },
      });
    });
  }, []);

  // Tenemos que hablar animación
  const lastSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = lastSectionRef.current;
    if (!section) return;

    const paragraphs =
      section.querySelectorAll<HTMLParagraphElement>("p:nth-of-type(-n+3");
    if (!paragraphs.length) return;

    const finalPositions = [...paragraphs].map((p) => {
      const r = p.getBoundingClientRect();
      return { y: 0 };
    });

    const offset = 200;

    gsap.set(paragraphs, {
      y: offset,
      opacity: 0,
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom center",
          scrub: 1,
        },
      })
      .to(paragraphs, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
      })
      .to(paragraphs, {
        y: (i) => finalPositions[i].y,
        duration: 0.6,
        ease: "power3.out",
      });
  }, []);

  return (
    <main className="bg-black overflow-x-hidden">
      <Link href="/" className="fixed top-0 left-0 ms-[115px] mt-[40px] z-20">
        <img src="/flashpage.png" alt="" className="max-w-[60px]" />
      </Link>
      <div
        ref={containerRef}
        className="progress-1 main flex w-[300vw] relative"
      >
        <section className="progress-1 w-screen h-dvh ps-[115px] py-[17vh] text-[#ef5143] uppercase leading-[80%] font-extrabold text-[12rem] flex flex-col justify-center relative">
          <div className="relative w-full h-full">
            <p>Diseñamos</p>
            <p>Construimos</p>
            <p>Innovamos</p>
            <p>Escalamos</p>
          </div>

          <div className="absolute bottom-10 ps-[1rem] flex items-center gap-4">
            <div className="text-[#fee9ce] font-bold leading-[120%] tracking-[-0.02em] text-[1rem]">
              Desplázate para descubrir
            </div>
            <div className="relative w-[6.5rem] h-[1.5px] overflow-hidden bg-transparent">
              <div className="absolute w-full h-full bg-[#fee9ce] animate-slide"></div>
            </div>
          </div>
        </section>
        <section className="progress-1 w-screen h-dvh py-[17vh] ps-[15rem] pe-[12.5rem] flex flex-col text-[#fee9ce]">
          <div className="flex-1">
            <p className="text-8xl">
              Tras años diseñando soluciones para gigantes de la industria y
              startups revolucionarias...
            </p>
          </div>
          <div
            ref={paragraphsRef}
            className="flex-1 flex flex-wrap content-end justify-left gap-[2rem] text-lg font-medium leading-[140%] tracking-[-0.01em]"
          >
            <p className="w-1/6">
              Mi enfoque ha pasado de los proyectos con clientes a la formación
              de diseñadores excepcionales que están preparados para liderar,
              innovar y generar cambios significativos.
            </p>
            <p className="w-1/6">
              Mi misión es ayudar a crear la próxima generación de líderes del
              diseño que piensen de forma diferente, desafíen con audacia y
              creen con propósito.
            </p>
          </div>
        </section>
        <section className="w-screen h-dvh ps-[95px] flex justify-end items-center">
          <video
            ref={videoRef}
            src="/videos/video.mp4"
            className="w-[calc(100vw-95px)] h-full object-cover"
            muted
            loop
            playsInline
          ></video>
        </section>
      </div>
      <section className="w-screen h-[25vh] ms-auto"></section>
      <section className="progress-2 relative w-screen h-full p-[15rem] uppercase font-extrabold text-[12rem] text-center">
        <p className="animate-text relative inline-block mx-auto text-[#4e4e4e] leading-none before:absolute before:inset-0 before:block before:text-[#ef5143] before:leading-none">
          Más de 4 años ayudando a startups a revolucionar mercados y a empresas
          Fortune 5000 a innovar a gran escala.
        </p>
      </section>
      <section
        ref={brandsRef}
        className="progress-3 relative w-screen ps-[115px] pe-[12.5rem] font-bold content-center my-[17vh]"
      >
        <div className="">
          <div className="flex">
            <div className="flex-1 div">
              <h4 className="text-[#ffb261] text-5xl brands">
                Experiencia de marca
              </h4>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ef5143] flex items-center z-1 box">
              <img src="/brands/wemakenoise.png" alt="" />
            </div>
            <div className="flex-1">
              <h2 className="animate-text-2 relative inline-block text-[#4e4e4e] text-9xl before:absolute before:inset-0 before:block before:text-[#fee9ce]">
                We Make Noise
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section
        ref={whoAmIRef}
        className="progress-4 relative w-screen h-dvh flex flex-col justify-center items-center text-center text-[12rem] font-bold tracking-[-0.04em] leading-[0.8] text-white uppercase"
      >
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform text-stroke">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform text-stroke">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform text-stroke">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform text-stroke">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform text-stroke">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full text-center will-change-transform text-stroke">
          Profesionales
        </p>
        <p className="absolute top-1/2 -translate-y-1/2 w-full px-8 main-text text-[3rem] text-[#ef5143] tracking-[-0.03em] leading-[120%] normal-case">
          Puedes llamarnos
        </p>
      </section>
      <section
        ref={nextSectionRef}
        className="progress-4 relative w-screen min-h-dvh ps-[115px] text-[#ef5143] py-[23.3rem]"
      >
        <p className="text-[1.5rem] leading-[130%] font-bold">Profesor de UX</p>
        <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[1.5rem] leading-[130%] font-bold">
          <a href="">Arte & Diseño</a>
          <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
          <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#ef5143] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
        </div>

        <h2 className="absolute left-[48%] top-[13%] text-[7rem] leading-[95%] font-bold tracking-[-0.04em] max-w-[53rem]">
          Educando a la próxima generación de rebeldes del diseño y agentes de
          cambio.
        </h2>
        <div className="flex">
          <div className="flex-1">
            <img src="/weare.jpg" alt="" />
          </div>
          <div className="flex-1 relative">
            <div className="absolute right-5 bottom-0 w-1/2">
              <p className="text-[1.6rem] leading-[120%] font-medium tracking-[-0.01em] mb-16">
                El mundo del diseño necesita más que grandes
                portafolios—necesita líderes audaces que no teman romper
                barreras y desafiar el status quo.
              </p>
              <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[1.5rem] leading-[130%] font-bold">
                <a
                  href=""
                  className="flex items-center gap-2 transition-transform duration-500 ease-in-out"
                >
                  <span>Mis servicios</span>
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
        </div>
      </section>
      <section
        ref={lastSectionRef}
        className="progress-5 relative w-full min-h-dvh ps-[95px] overflow-hidden last-section"
      >
        <img src="/talk.jpg" alt="" className="absolute z-1 " />
        <div className="relative z-10 grid grid-cols-12 gap-y-12 min-h-dvh py-14 px-5">
          <p className="col-span-10 text-[16.8rem] leading-[80%] font-extrabold tracking-[-0.04em] uppercase text-[#ef5143]">
            Tenemos
          </p>
          <p className="col-start-2 col-span-8 text-[16.8rem] leading-[80%] font-extrabold tracking-[-0.04em] uppercase text-[#ef5143]">
            que
          </p>
          <p className="col-start-3 col-span-9 text-[16.8rem] leading-[80%] font-extrabold tracking-[-0.04em] uppercase text-[#ef5143]">
            hablar
          </p>
          <div className="col-start-1 col-span-12 flex justify-start gap-32 self-end">
            <div className="flex flex-col gap-[0.4rem]">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <div className="bg-[#ffb261] w-[0.6rem] h-[0.6rem]"></div>
                <p className="text-[#ffb261] uppercase font-bold leading-[120%] text-[1.25rem]">
                  Programa una llamada
                </p>
              </div>
              <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[3.6rem] leading-[120%] font-bold tracking-[-0.04em] text-[#fee9ce]">
                <a href="">calendly.com</a>
                <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#fee9ce] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#fee9ce] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
              </div>
            </div>

            <div className="flex flex-col gap-[0.4rem]">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <div className="bg-[#ffb261] w-[0.6rem] h-[0.6rem]"></div>
                <p className="text-[#ffb261] uppercase font-bold leading-[120%] text-[1.25rem]">
                  Deja un mensaje
                </p>
              </div>
              <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[3.6rem] leading-[120%] font-bold tracking-[-0.04em] text-[#fee9ce]">
                <a href="">+5492364533342</a>
                <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#fee9ce] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#fee9ce] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
              </div>
            </div>

            <div className="flex flex-col gap-[0.4rem]">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <div className="bg-[#ffb261] w-[0.6rem] h-[0.6rem]"></div>
                <p className="text-[#ffb261] uppercase font-bold leading-[120%] text-[1.25rem]">
                  Envíame un correo electrónico
                </p>
              </div>
              <div className="group relative inline-block w-fit overflow-hidden pb-[0.6rem] text-[3.6rem] leading-[120%] font-bold tracking-[-0.04em] text-[#fee9ce]">
                <a href="">juanicaprioli16@outlook.com</a>
                <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#fee9ce] translate-x-0 transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#fee9ce] -translate-x-full transition-transform duration-500 ease-in-out delay-150 group-hover:translate-x-0"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
