import { useSearchParams } from "next/navigation";
import Script from "next/script";
import React from "react";
import { useEffect, useRef, useState } from "react";
import FOG from "vanta/src/vanta.fog";
import * as THREE from "three";

//const FOG = require('vanta/src/vanta.fog')

const FogBg = () => {
  useEffect(() => {
    FOG({
      el: "#vantajs-bg",
      THREE,
      mouseControls: true,
      touchControls: true,
      minHeight: 720.0,
      minWidth: 1280.0,
      gyroControls: false,
      highlightColor: 0xc6cced,
      midtoneColor: 0x6a8ff5,
      lowlightColor: 0x3bac,
      zoom: 1.5,
    });
  }, []);

  return (
    <div className="FogBg" id="vantajs-bg">
      {/* <div className="relative flex flex-col h-full w-full">
        <div className="absolute -z-1 h-full w-full">
          <video autoPlay muted loop className='rotate-180 absolute top-[-340px] left-0 z-[1] w-full h-full object-cover'>
            <source src='./'></source>
        </video>
        </div>
        
      </div> */}
    </div>
  );
};

export default FogBg;
