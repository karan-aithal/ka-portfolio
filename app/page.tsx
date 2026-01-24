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
            <div className="card" id="card2">
              <div className="card-inner">
                <CanvasLoad />
              </div>
            </div>
            <div className="card" id="card3">
              <div className="card-inner">
                <Grid />
              </div>
            </div>
            <div className="card" id="card4">
              <div className="card-inner">
                <RecentProjects />
              </div>
            </div>
          </div>
          <StickyCardsAnimation />


          {/* <>Canvas </> // canvas for animation entry for character same background as tron or matrix  */}

          {/* logo is visible when disabling Hero  */}
          {/* <Grid /> */}
          {/* <RecentProjects /> */}
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
