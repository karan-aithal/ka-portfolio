// import { FaLocationArrow } from "react-icons/fa6";

// import MagicButton from "./MagicButton";
// import { Spotlight } from "./ui/Spotlight";
// import { TextGenerateEffect } from "./ui/TextGenerateEffect";
// import Logo from "@/components/ui/Logo";

// // tailwind

// // hero -- pb-20 pt-36
// // spotlight--primary-- -top-40 -left-10 md:-left-32 md:-top-20 h-screen
// // spotlight--secondary-- - h-[80vh] w-[50vw] top-10 left-full
// // spotlight--tertiary-- -left-80 top-28 h-[80vh] w-[50vw]

// // hero__grid-container:  h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
// //  absolute top-0 left-0 flex items-center justify-center

// // hero__gradient-overlay: absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
// //  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]

// // hero__content: flex justify-center relative my-20 z-10
// // hero____maxwidthcontainer : max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center

// // uppercase tracking-widest text-xs text-center text-blue-100 max-w-80

// const Hero = () => {
//   return (
//     <div className="hero">
//       {/**
//        *  UI: Spotlights
//        *  Link: https://ui.aceternity.com/components/spotlight
//        */}
//       <div className="hero__spotlight-container">
//         <Spotlight className="spotlight--primary" fill="white" />
//         <Spotlight className="spotlight--secondary" fill="purple" />
//         <Spotlight className="spotlight--tertiary" fill="blue" />
//       </div>

//       {/**
//        *  UI: grid
//        *  change bg color to bg-black-100 and reduce grid color from
//        *  0.2 to 0.03
//        */}
//       <div className="hero__grid-container">
//         {/* <Logo /> */}
//         {/* Radial gradient for the container to give a faded look */}
//         <div
//           // chnage the bg to bg-black-100, so it matches the bg color and will blend in
//           className="hero__gradient-overlay"
//         />
//       </div>

//       <div className="hero__content">
//         <div className="hero__maxwidthcontainer">
//           <p className="hero__subheading">Dynamic Web Magic with Next.js</p>

//           {/**
//            *  Link: https://ui.aceternity.com/components/text-generate-effect
//            *
//            *  change md:text-6xl, add more responsive code
//            */}
//           <TextGenerateEffect
//             words="Transforming Concepts into Seamless User Experiences"
//             className="hero__textgenerate"
//           />

//           <p className="hero__description-text">
//             Hi! I&apos;m Adrian, a Next.js Developer based in Croatia.
//           </p>

//           <a href="#about">
//             <MagicButton
//               title="Show my work"
//               icon={<FaLocationArrow />}
//               position="right"
//             />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import { FaLocationArrow } from "react-icons/fa6";

// import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";
// import { TextGenerateEffect } from "./ui/TextGenerateEffect";
//import Portfolio from "./ui/Portfolio";

import Portfolio from "./ui/Portfolio";

const Hero = () => {
  return (
    <div className="hero">
      {/**
       *  UI: Spotlights
       *  Link: https://ui.aceternity.com/components/spotlight
       */}
      <div>
        <Spotlight className="spotlight--primary" fill="white" />
        <Spotlight className="spotlight--secondary" fill="purple" />
        <Spotlight className="spotlight--tertiary " fill="blue" />
      </div>

      {/**
       *  UI: grid
       *  change bg color to bg-black-100 and reduce grid color from
       *  0.2 to 0.03
       */}
      <div className="hero__grid-container">
        {/* Radial gradient for the container to give a faded look */}
        <div
          // chnage the bg to bg-black-100, so it matches the bg color and will blend in
          className="hero__gradient-overlay"
        />
      </div>

      <div className="hero__grid-container tron"></div>
      {/* //add portfolio her if wanted */}
    </div>
  );
};

export default Hero;

{
  /* <div className="hero__maxwidthcontainer">
          <p className="hero__subheading ">Dynamic Web Magic with Next.js</p>

          {/**
           *  Link: https://ui.aceternity.com/components/text-generate-effect
           *
           *  change md:text-6xl, add more responsive code
           */
}
{
  /* <TextGenerateEffect
            words="Transforming Concepts into Seamless User Experiences"
            className="hero__textgenerate"
          />

          <p className="hero__description-text ">
            Hi! I&apos;m Karan, a Next.js Developer based in India.
          </p>

          <a href="#about">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div> */
}
