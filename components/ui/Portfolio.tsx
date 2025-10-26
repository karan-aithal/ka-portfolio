import React from "react";

import { useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

import potraitL from "../../public/OG fake kush.png";
import potraitR from "../../public/OG Hyper fake kush.png";

import Image from "next/image";

import localFont from "next/font/local";

const misto = localFont({
  src: [
    {
      path: "../../public/fonts/Misto.otf",
      // weight: "400",
      style: "normal",
    },
  ],
});

const tfNuke = localFont({
  src: [
    {
      path: "../../public/fonts/TF Nukes DEMO.otf",
      weight: "400",
      style: "normal",
    },
  ],
});

const Overt = localFont({
  src: [
    {
      path: "../../public/fonts/Overt.otf",
      //weight: '400',
      style: "normal",
    },
  ],
});

const anonymousPro = localFont({
  src: [
    {
      path: "../../public/fonts/AnonymousPro-Regular.ttf",
      //weight: "400",
      style: "normal",
    },
  ],
});

const arrayWide = localFont({
  src: [
    {
      path: "../../public/fonts/Array-Wide.otf",
      //weight: "400",
      style: "normal",
    },
  ],
});

const Portfolio = () => {
  useEffect(() => {
    const leftText = document.querySelector(".Coder-left");
    const rightText = document.querySelector(".Design-right");
    const leftImage = document.querySelector(".image-wrapper-l");
    const rightImage = document.querySelector(".image-wrapper-r");

    let centerX = window.innerWidth / 2;
    let offset = window.innerWidth * 0.2; // 20% of screen width

    const handleResize = () => {
      centerX = window.innerWidth / 2;
      offset = window.innerWidth * 0.2; // 20% of screen width
    };

    window.addEventListener("resize", handleResize);


    interface MouseMoveEvent extends MouseEvent {
      clientX: number;
    }


    const handleMouseMove = (e: MouseMoveEvent) => {
      const distance = Math.abs(e.clientX - centerX);
      const maxDistance = centerX;
      const opacity = 1 - distance / maxDistance;

      if (e.clientX < centerX) {
        gsap.to(rightImage, { opacity, duration: 0.4 });
      } else {
        gsap.to(leftImage, { opacity, duration: 0.4 });
      }
    };

    const handleMouseEnterLeft = () => {
      gsap.killTweensOf([rightText, rightImage, leftText, leftImage]);
      // Instantly hide right side
      gsap.set(rightText, { autoAlpha: 0 });
      gsap.set(rightImage, { autoAlpha: 0 });
      // Instantly show left side (before animating)
      gsap.set(leftText, { autoAlpha: 1 });
      gsap.set(leftImage, { autoAlpha: 1 });
      // Animate left side in
      gsap.to(leftText, { scale: 1.2, duration: 0.3 });
      gsap.to(leftImage, { x: offset, duration: 0.3 });
      window.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseEnterRight = () => {
      gsap.killTweensOf([rightText, rightImage, leftText, leftImage]);
      // Instantly hide left side
      gsap.set(leftText, { autoAlpha: 0 });
      gsap.set(leftImage, { autoAlpha: 0 });
      // Instantly show right side (before animating)
      gsap.set(rightText, { autoAlpha: 1 });
      gsap.set(rightImage, { autoAlpha: 1 });
      // Animate right side in
      gsap.to(rightText, { scale: 1.2, duration: 0.3 });
      gsap.to(rightImage, { x: -offset, duration: 0.3 });
      window.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseLeave = () => {
      gsap.killTweensOf([rightText, rightImage, leftText, leftImage]);
      // Reset both sides instantly
      gsap.set([leftText, rightText], { scale: 1 });
      // Animate leftImage back to x: 0, then hide it
      gsap.to(leftImage, {
        x: 0,
        duration: 0.4,
        ease: "cubic-bezier(0.4, 0, 0.2, 1)",
        // fade out while moving

        onComplete: () => {
          gsap.set(leftImage, { x: 0, autoAlpha: 0 });
          gsap.set(rightImage, { x: 0, autoAlpha: 1 });
          gsap.to([leftText, rightText], { autoAlpha: 1, duration: 0.8 });
        },
      });
      window.removeEventListener("mousemove", handleMouseMove);
    };
    if (leftText && rightText) {
      leftText.addEventListener("mouseenter", handleMouseEnterLeft);
      rightText.addEventListener("mouseenter", handleMouseEnterRight);
      leftText.addEventListener("mouseleave", handleMouseLeave);
      rightText.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (leftText && rightText) {
        leftText.removeEventListener("mouseenter", handleMouseEnterLeft);
        rightText.removeEventListener("mouseenter", handleMouseEnterRight);
        leftText.removeEventListener("mouseleave", handleMouseLeave);
        rightText.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* <div className="portfolio-container"> */}

      <div className="container">
        {/* Extra FOG */}
        {/* <div className="fog-container">
          <div className="fog-img fog-img-first"></div>
          <div className="fog-img fog-img-second"></div>
        </div> */}
        {/* <section className="hero" data-scroll-section>
    
        <p className="subtitle">Full-Stack Developer</p>
        <a href="mailto:danielgraziotti99@gmail.com" className="email-btn">📧 danielgraziotti99@gmail.com</a>
      </section> */}


        <div className="Port-left">
          {/* Left column content */}
          <div className="Coder-left">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className={`${arrayWide.className}`}>{"<CODER>"}</span>
            </motion.h1>
            <p className={`${anonymousPro.className}`}>
              Passionate coder, solving one micro problem at a time
            </p>
          </div>
        </div>

        {/* Center column with overlapping images */}
        <div className="image-column">
          <div className="image-wrapper-l">
            <Image
              src={potraitL}
              alt="portrait"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
          <div className="image-wrapper-r">
            <Image
              src={potraitR}
              alt="portrait"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
        </div>

        <div className="Port-right">
          {/* Right column content */}
          <div className="Design-right">
            <h1 className={`${misto.className}`}>Designer</h1>
            <p className={`${anonymousPro.className}`}>
              Designer, specialising in creativity, UI and Design systems
            </p>
          </div>
        </div>





        {/* <div className="image-wrapper-l">
          <Image
            src={potraitL}
            alt="portrait"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
        <div className="image-wrapper-r">
          <Image
            src={potraitR}
            alt="portrait"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>

        <div className="Port-left">
          <div className="Coder-left">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className={`${arrayWide.className}`}>{"<CODER>"}</span>
            </motion.h1>
            <p className={`${anonymousPro.className}`}>
              Passionate coder, solving one micro problem at a time
            </p>
          </div>
        </div>
        <div className="Port-right">
          <div className="Design-right">
            <h1 className={`${misto.className}`}>Designer</h1>
            <p className={`${anonymousPro.className}`}>
              Designer, specialising in creativity, UI and Design systems
            </p>
          </div>
        </div> */}

        {/* Left Side (Coder) */}

        {/* <div className="Port-left">
          <div className="Coder-left">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className={`${arrayWide.className}`}>{"<CODER>"}</span>
            </motion.h1>
            <p className={`${anonymousPro.className}`}>
              Passionate coder, solving one micro problem at a time
            </p>
          </div>
          <div className="image-wrapper-l">
            <Image
              src={potraitL}
              alt="portrait"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
        </div> */}

        {/* Right Side (Designer) */}

        {/* <div className="Port-right">
          <div className="Design-right">
            <h1 className={`${misto.className}`}>Designer</h1>
            <p className={`${anonymousPro.className}`}>
              Designer, specialising in creativity, UI and Design systems
            </p>
          </div>
          <div className="image-wrapper-r">
            <Image
              src={potraitR}
              alt="portrait"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
        </div> */}

        {/* Extra FOG  */}
        {/* <div className="fog-container">
          <div className="fog-img fog-img-first"></div>
          <div className="fog-img fog-img-second"></div>
        </div> */}
        {/* <section className="hero" data-scroll-section>
    
        <p className="subtitle">Full-Stack Developer</p>
        <a href="mailto:danielgraziotti99@gmail.com" className="email-btn">📧 danielgraziotti99@gmail.com</a>
      </section> */}
      </div >
    </>
  );
};

export default Portfolio;
