"use client";

import { navItems } from "@/data";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import Logo from "@/components/ui/Logo";

import "@/scss/app.scss";

import Portfolio from "./../components/ui/Portfolio";
import { CanvasLoad } from "@/components/ui/CanvasLoad";
import StarfieldBackground from "./../components/ui/StarfieldBackground";
import StickyCardsAnimation from "@/components/animations/StickyCardsAnimation";
import SynthWaveShader from "@/components/3D/shaders/SynthWaveShader";
import MatrixBackground from "@/components/ui/MatrixBackground";

const Home = () => {
  return (
    // main-container-- // relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5

    // inner-container- max-w-7xl w-full
    <>
      <div id="fixed-overlay-root"></div>
      <main className="main-container">
        <div className="inner-container">
          <FloatingNav navItems={navItems} />
          <Logo />
          <div className="sticky-cards">
            <div className="card" id="card1">
              <div className="card-inner">
                <Hero />
              </div>
            </div>
            {/* 
              Add z-index to ensure this card stays on top of card3 when they overlap.
              During the scroll animation, card2 is pinned (position: fixed) and card3
              scrolls up underneath it. A higher z-index for card2 is necessary
              for the fade-out effect to correctly reveal card3.
            */}
            <div className="card" id="card2" style={{ zIndex: 10 }}>
              <div className="card-inner">
                <CanvasLoad />

              </div>
            </div>

            {/* 
              Responsive Spacer for card2 animation:
              Total pin duration = 600vh (defined in ModelAnimNLE)
              Fade starts at 80% (0.8 * 600 = 480vh).
              This spacer ensures card3 arrives at the top of the viewport exactly when the fade begins.
            */}
            <div style={{ height: "380vh" }}></div>
            <div className="card" id="card3">
              <div className="card-inner">
                <MatrixBackground />
              </div>

            </div>
            <div className="card" id="card4">
              <div className="card-inner">
              </div>
            </div>
          </div>
          <Grid />
          {/* <MatrixBackground /> */}
          <StickyCardsAnimation />
          <RecentProjects />
          {/* <>Canvas </> // canvas for animation entry for character same background as tron or matrix  */}

          {/* logo is visible when disabling Hero  */}
          {/* <Grid />
          <RecentProjects /> */}
          <Clients />
          <Experience />
          <Approach />
          <Footer />
        </div>
      </main >
    </>
  );
};

export default Home;
