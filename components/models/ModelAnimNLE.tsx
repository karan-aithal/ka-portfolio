import React, { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, LoopRepeat } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
  onScrollProgress?: (progress: number) => void;
  onAnimationComplete?: () => void; // 👈 ADD THIS
}

/**
 * ModelAnimNLE - Scroll-controlled 3D model animation
 * 
 * Controls model animation based on scroll position using GSAP ScrollTrigger.
 * - Scroll down: Play animation forward (frames 3→250)
 * - Scroll up: Reverse animation
 * - Scroll past: Auto-loop last 60 frames (190→250)
 */
export const ModelAnimNLE: React.FC<ModelAnimNLEProps> = ({
  actions,
  mixer,
  nlaData,
  blenderFPS,
  onScrollProgress,
  onAnimationComplete,
}) => {
  const actionRef = useRef<AnimationAction | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isLooping = useRef(false); // Track if auto-loop is active
  const loopListenerRef = useRef<((e: any) => void) | null>(null);
  const scrollProgress = useRef(0);

  // Convert frame number to seconds
  const f = (frame: number) => frame / blenderFPS;

  // --------- AUTO-LOOP (activates after scrolling past section) ----------
  const startAutoLoop = (action: AnimationAction) => {
    if (isLooping.current) return;

    const loopStart = 190 / blenderFPS; // Last 60 frames (250 - 60 = 190)
    const loopEnd = 250 / blenderFPS;

    console.log("🔁 Starting auto-loop: frames 190 → 250 (last 60 frames)");

    action.setLoop(LoopRepeat, Infinity);
    action.clampWhenFinished = false;
    action.time = loopStart;
    action.paused = false; // Allow time-based playback
    action.timeScale = 1 / nlaData[0].strips[0].scale;
    action.play();

    // Clamp animation to loop range
    if (loopListenerRef.current) {
      mixer.removeEventListener("loop", loopListenerRef.current);
    }

    const loopListener = () => {
      if (action.time >= loopEnd) {
        action.time = loopStart;
      }
    };

    loopListenerRef.current = loopListener;
    mixer.addEventListener("loop", loopListener);
    isLooping.current = true;
  };

  // --------- STOP AUTO LOOP (when scrolling back) ----------
  const stopAutoLoop = (action: AnimationAction) => {
    if (!isLooping.current) return;

    console.log("⏹️ Stopping auto-loop");

    action.paused = true;

    if (loopListenerRef.current) {
      mixer.removeEventListener("loop", loopListenerRef.current);
      loopListenerRef.current = null;
    }

    isLooping.current = false;
  };

  // Smooth easing function for cleaner scrubbing
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // --------- SCROLL-TO-FRAME MAPPING ----------
  // Maps scroll progress (0-1) to specific animation frames
  const updateAnimationFromScroll = (progress: number) => {
    if (!actionRef.current) return;

    const action = actionRef.current;

    // Phase 1: Intro (0-20% scroll) → frames 3-60
    if (progress <= 0.2) {
      const phaseProgress = progress / 0.2;
      const frame = 3 + phaseProgress * (60 - 3);
      action.time = f(frame);
    }
    // Phase 2: Main animation (20-95% scroll) → frames 60-250 with easing
    else if (progress <= 0.95) {
      const phaseProgress = (progress - 0.2) / 0.75;
      const easedProgress = easeInOutQuad(phaseProgress); // Smooth acceleration/deceleration
      const frame = 60 + easedProgress * (250 - 60);
      action.time = f(frame);
    }
    // Phase 3: Hold final frame (95-100% scroll)
    else {
      action.time = f(250);
    }

    mixer.update(0); // Apply frame without advancing time
  };

  // --------- SCROLLTRIGGER SETUP ----------
  useEffect(() => {
    if (!actions || !nlaData) return;

    const strip = nlaData[0].strips[0];
    const action = actions[strip.action];
    if (!action) return;

    // Setup: Pause action and control it manually via scroll
    action.enabled = true;
    action.reset();
    action.setEffectiveWeight(1);
    action.paused = true; // Pause - we control time via scroll
    action.time = f(3); // Start at frame 3 (skip A-pose)
    action.play();
    actionRef.current = action;

    console.log("🎬 Animation ready for scroll control");

    // Configure ScrollTrigger: 4000px scroll distance to complete animation
    const st = ScrollTrigger.create({
      // trigger: ".Loader-container",
      trigger: "#card2",
      start: "top top", // Pin when section reaches viewport top
      // end: "+=4000", // Unpin after 4000px of scroll
      end: () => "+=5000",
      scrub: 13, // Smooth delay (higher = more lag)
      pin: true, // Keep section fixed during animation
      pinSpacing: true,
      markers: true, // Debug markers (remove in production)

      onUpdate: (self) => {
        scrollProgress.current = self.progress;

        // Notify parent of scroll progress
        if (onScrollProgress) {
          onScrollProgress(self.progress);
        }

        // Only update if not looping
        if (!isLooping.current) {
          updateAnimationFromScroll(self.progress);
        }

        if (self.progress < 1) {
          console.log(`📊 Scroll: ${(self.progress * 100).toFixed(1)}%`);
        }
      },

      onEnter: () => {
        console.log("🎯 Entered scroll zone");
        stopAutoLoop(action);
      },

      onLeave: () => {
        console.log("👋 Scroll complete - starting auto-loop");
        // startAutoLoop(action);
        // Lock to final frame (A-pose)
        action.time = f(250);
        mixer.update(0);

        // Notify parent ONCE
        onAnimationComplete?.();
      },

      onEnterBack: () => {
        console.log("🔙 Scrolled back - enabling reverse control");
        stopAutoLoop(action);
        updateAnimationFromScroll(scrollProgress.current);
      },

      onLeaveBack: () => {
        console.log("⬆️ Scrolled above section");
      },
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up ScrollTrigger");
      st.kill();
      stopAutoLoop(action);
      actionRef.current = null;
    };
  }, [actions, nlaData, blenderFPS, mixer]);

  // --------- MIXER UPDATE LOOP ----------
  // Updates animation system on every frame
  useEffect(() => {
    let last = performance.now();

    const update = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      // Only advance time when auto-looping (not during scroll control)
      if (isLooping.current) {
        mixer.update(dt);
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [mixer]);

  return null;
};
