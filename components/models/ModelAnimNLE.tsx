import React, { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, LoopRepeat, LoopOnce } from "three";
import gsap from "gsap";
import * as THREE from "three";

export interface NLAStrip {
  action: string;
  start_frame: number;
  end_frame: number;
  scale: number;
  blend_type: string;
  influence: number;
  extrapolation: string;
  strip_time: number;
  use_reverse: boolean;
}

export interface NLATrack {
  track: string;
  mute: boolean;
  solo: boolean;
  strips: NLAStrip[];
}

interface ModelAnimNLEProps {
  actions: Record<string, AnimationAction>;
  mixer: AnimationMixer;
  nlaData: NLATrack[];
  blenderFPS: number;
}
export const ModelAnimNLE: React.FC<ModelAnimNLEProps> = ({
  actions,
  mixer,
  nlaData,
  blenderFPS,
}) => {
  const currentAction = useRef<AnimationAction | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const canStart = useRef(false);

  // --------- SCROLL OBSERVER ----------
  useEffect(() => {
    const section = document.querySelector(".Loader-container");
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          canStart.current = true;
          if (tlRef.current) tlRef.current.resume();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
  }, []);

  // --------- PLAY ACTION ----------

  const playAction = (action: AnimationAction, startFrame: number) => {
    const startSec = startFrame / blenderFPS;

    action.enabled = true;
    action.reset();
    action.setEffectiveWeight(1);
    action.time = startSec;
    action.paused = false;
    action.play();

    const speed = 1 / nlaData[0].strips[0].scale; // your scale
    action.timeScale = speed;

    currentAction.current = action;
  };

  // --------- LOOP ONLY 300 → 750 ----------
  const loopRange = (action: AnimationAction) => {
    const loopStart = 300 / blenderFPS;
    const loopEnd = 750 / blenderFPS;

    action.setLoop(LoopRepeat, Infinity);

    mixer.addEventListener("loop", () => {
      if (action.time >= loopEnd) {
        action.time = loopStart;
      }
    });

    action.time = loopStart;
  };

  // --------- GSAP TIMELINE ----------
  useEffect(() => {
    if (!actions || !nlaData) return;

    const strip = nlaData[0].strips[0];
    const action = actions[strip.action];

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // Frame → Seconds
    const f = (frame: number) => frame / blenderFPS;

    // 1) PLAY from frame 1 → frame 6
    tl.to(
      {},
      {
        duration: f(6 - 1),
        onStart: () => playAction(action, 1),
      }
    );

    // 2) PAUSE at frame 6 for 5 seconds
    tl.to(
      {},
      {
        duration: 0.01,
        onStart: () => {
          action.time = f(6); // perform assignment
        },
      }
    );
    tl.to({}, { duration: 5 });

    // 3) Continue animation normally (frame 6 → 759)
    tl.to(
      {},
      {
        duration: f(759 - 6),
        onStart: () => {
          action.paused = false;
        },
      }
    );

    // 4) Finally loop frames 300 → 750 forever
    tl.to(
      {},
      {
        duration: 0.01,
        onStart: () => loopRange(action),
      }
    );

    if (canStart.current) tl.play();

    return () => {
      tl.kill(); // ✔ cleanup function returning void
    };
  }, [actions, nlaData, blenderFPS]);

  // --------- MIXER UPDATE LOOP ----------
  useEffect(() => {
    let last = performance.now();
    const update = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      mixer.update(dt);
      requestAnimationFrame(update);
    };
    update();
  }, [mixer]);

  return null;
};

// export const ModelAnimNLE: React.FC<ModelAnimNLEProps> = ({
//   actions,
//   mixer,
//   nlaData,
//   blenderFPS,
// }) => {
//   const currentAction = useRef<AnimationAction | null>(null);
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const canStart = useRef(false);

//   const playStrip = (nextAction: AnimationAction, strip: NLAStrip): void => {
//     const startSec = strip.start_frame / blenderFPS;

//     // --- PRIME THE POSE FIRST ---
//     nextAction.enabled = true;
//     nextAction.setEffectiveWeight(1);

//     nextAction.reset();
//     nextAction.time = startSec;
//     nextAction.paused = true;
//     nextAction.play();

//     // Force evaluation so bones move into the correct starting pose
//     mixer.update(0);

//     // --- Now safe to unpause
//     nextAction.paused = false;

//     // Set playback speed
//     //nextAction.timeScale = strip.use_reverse ? -strip.scale : strip.scale;
//     const speed = 1 / strip.scale; // if strip.scale = 4 → speed = 0.25
//     nextAction.timeScale = strip.use_reverse ? -speed : speed;

//     nextAction.setLoop(LoopOnce, 1);
//     nextAction.clampWhenFinished = false;

//     // --- CROSSFADE ---
//     const prev = currentAction.current;

//     if (prev && prev !== nextAction) {
//       prev.enabled = true;
//       prev.setEffectiveWeight(1);

//       prev.crossFadeTo(nextAction, 0.25, false);
//     } else {
//       nextAction.play();
//     }

//     currentAction.current = nextAction;
//   };

//   // Play NLA strips in order
//   // Build sorted NLA strips ONCE
//   useEffect(() => {
//     if (!actions || !nlaData) return;

//     const tl = gsap.timeline({ repeat: -1 });

//     // Flatten & sort strips correctly
//     const sortedStrips = nlaData
//       .flatMap((track) => track.strips)
//       .sort((a, b) => a.start_frame - b.start_frame);

//     sortedStrips.forEach((strip) => {
//       const action = actions[strip.action]; // action name → AnimationAction
//       if (!action) return;

//       const duration = (strip.end_frame - strip.start_frame) / blenderFPS;

//       tl.to(
//         {},
//         {
//           duration,
//           onStart: () => {
//             playStrip(action, strip); // ✔ returns void now
//           },
//         }
//       );
//     });

//     // return () => tl.kill();
//     return () => {
//       tl.kill(); // ✔ cleanup function returning void
//     };
//   }, [actions, nlaData, blenderFPS]);

//   // Update mixer every frame with Blender FPS
//   useEffect(() => {
//     let lastTime = performance.now();

//     const update = () => {
//       const now = performance.now();
//       const dt = (now - lastTime) / 1000;
//       lastTime = now;

//       mixer.update(dt);

//       requestAnimationFrame(update);
//     };

//     update();
//     return () => {};
//   }, [mixer]);

//   return null;
// };

// 🔹 ACTION KEYS: Array(6)0: "Idle"1: "RunFlip"2: "Jumping"3: "Sprint"4: "CrouchedSprint"5: "APose"length: 6[[Prototype]]: Array(0)
// console.js:44 🔹 CLIP NAMES: Array(6)0: "Idle"1: "RunFlip"2: "Jumping"3: "Sprint"4: "CrouchedSprint"5: "APose"length: 6[[Prototype]]: Array(0)
