import { useSearchParams } from "next/navigation";
import Script from "next/script";
import React from "react";
import { useEffect, useRef, useState } from "react";
import FOG from "vanta/src/vanta.fog";
import * as THREE from "three";

//const FOG = require("vanta/src/vanta.fog");

const FogBg: React.FC = () => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const VANTA = await import("vanta/src/vanta.fog");
      if (!mounted || !elRef.current) return;

      vantaRef.current = (VANTA as any).default({
        el: elRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        // minHeight: 720.0,
        // minWidth: 1280.0,
        gyroControls: false,
        highlightColor: 0xc6cced,
        midtoneColor: 0x6a8ff5,
        lowlightColor: 0x3bacc,
        zoom: 1.5,
      });

      // force the Vanta canvas to be transparent
      const canvas = elRef.current.querySelector(
        "canvas"
      ) as HTMLCanvasElement | null;
      if (canvas) {
        canvas.style.opacity = "0.1";
      }
    })();

    return () => {
      mounted = false;
      if (vantaRef.current && typeof vantaRef.current.destroy === "function") {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return <div ref={elRef} id="vantajs-bg" className="FogBg" />;
};

export default FogBg;

// const FogBg = () => {
//   useEffect(() => {
//     FOG({
//       el: "#vantajs-bg",
//       THREE,
//       mouseControls: true,
//       touchControls: true,
//       minHeight: 720.0,
//       minWidth: 1280.0,
//       gyroControls: false,
//       highlightColor: 0xc6cced,
//       midtoneColor: 0x6a8ff5,
//       lowlightColor: 0x3bac,
//       zoom: 1.5,
//     });
//   }, []);

//   return (
//     <div className="FogBg" id="vantajs-bg">
//       {/* <div className="relative flex flex-col h-full w-full">
//         <div className="absolute -z-1 h-full w-full">
//           <video autoPlay muted loop className='rotate-180 absolute top-[-340px] left-0 z-[1] w-full h-full object-cover'>
//             <source src='./'></source>
//         </video>
//         </div>

//       </div> */}
//     </div>
//   );
// };

// export default FogBg;
