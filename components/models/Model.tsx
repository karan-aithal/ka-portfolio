import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
// import from "../../public/assets/AnimntitledCopy.glb";

type ModelProps = {
  url: string;
  onAnimationsLoaded?: (clips: any, mixer: any) => void;
  onPointerOver?: (event: any) => void;
  onPointerOut?: (event: any) => void;
};

export const Model: React.FC<ModelProps> = ({
  url,
  onAnimationsLoaded,
  onPointerOver,
  onPointerOut,
}) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as any;
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions || !animations) return;

    if (onAnimationsLoaded) onAnimationsLoaded(actions, mixer);
    console.log("🔹 ACTION KEYS:", Object.keys(actions));
    console.log(
      "🔹 CLIP NAMES:",
      animations.map((clip: any) => clip.name)
    );
  }, []);
  // actions, mixer, onAnimationsLoaded;
  return (
    <primitive
      ref={group}
      object={scene}
      dispose={null}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
};

useGLTF.preload("../../public/assets/AnimnSingleBake.glb"); // optional preloading
