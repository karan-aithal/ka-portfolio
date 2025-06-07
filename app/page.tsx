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

const Home = () => {
  return (
    // main-container-- // relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5

    // inner-container- max-w-7xl w-full

    <main className="main-container">
      <div className="inner-container">
        <FloatingNav navItems={navItems} />
        <Logo />
        <Hero />
        <Portfolio />
        {/* logo is visible when disabling Hero  */}
        <Grid />
        <RecentProjects />
        <Clients />
        <Experience />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
