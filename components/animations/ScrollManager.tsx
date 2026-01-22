// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lenis from "lenis";


// document.addEventListener("DOMContentLoaded", () => {
//     gsap.registerPlugin(ScrollTrigger);


//     // Initialize Lenis
//     const lenis = new Lenis();

//     lenis.on("scroll", ScrollTrigger.update);

//     gsap.ticker.add((time) => {
//         lenis.raf(time * 1000);
//     });

//     gsap.ticker.lagSmoothing(0);
// });

'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default function ScrollManager(): null {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.125,
            smooth: true,
        } as any);

        // keep ScrollTrigger in sync with Lenis
        lenis.on('scroll', ScrollTrigger.update);

        function raf(time: number) {
            lenis.raf(time * 1000);
        }

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // scrollerProxy so ScrollTrigger queries/use the Lenis-driven scroll
        // const scroller = (document.scrollingElement || document.documentElement) as HTMLElement;

        const scroller = document.documentElement;

        ScrollTrigger.scrollerProxy(scroller, {
            scrollTop(value?: number) {
                if (arguments.length) {
                    lenis.scrollTo(value as number);
                }
                return scroller.scrollTop;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            // optional: fixed-position elements support
            pinType: scroller.style.transform ? 'transform' : 'fixed',
        });

        // ensure correct sizing / triggers
        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            gsap.ticker.remove(raf);
            lenis.off('scroll', ScrollTrigger.update);
            lenis.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return null;
}