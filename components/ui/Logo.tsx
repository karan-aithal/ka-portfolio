import React, { useState } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import localFont from "next/font/local";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

const jhonCream = localFont({
  src: [
    {
      path: "../../public/fonts/Jhon Cream.otf",
      weight: "400",
      style: "normal",
    },
  ],
});

const Logo = () => {
  const { scrollYProgress } = useScroll();

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        // also set true for the initial state
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <div className={"logo-span"}>
          <Image
            src={"/logo.png"}
            alt="Site Logo"
            width={120} // Add actual dimensions
            height={40}
            className={"Logo"}
          />

          <a href="/">
            {" "}
            <span className={`CName ${jhonCream.className}`}> Kagunita</span>
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Logo;
