import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
import * as THREE from "three";
// import from "../../public/assets/AnimntitledCopy.glb";

type ModelProps = {
  url: string;
  onAnimationsLoaded?: (clips: any, mixer: any) => void;
  onPointerOver?: (event: any) => void;
  onPointerOut?: (event: any) => void;
  onHeartTargetFound?: (obj: THREE.Object3D) => void;
};

export const Model: React.FC<ModelProps> = ({
  url,
  onAnimationsLoaded,
  onPointerOver,
  onPointerOut,
  onHeartTargetFound,
}) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as any;
  const { actions, mixer } = useAnimations(animations, group);



  useEffect(() => {
    if (!actions || !animations) return;
    if (!group.current) return;
    if (onAnimationsLoaded) onAnimationsLoaded(actions, mixer);
    console.log("🔹 ACTION KEYS:", Object.keys(actions));
    console.log(
      "🔹 CLIP NAMES:",
      animations.map((clip: any) => clip.name)
    );

  }, []);
  // actions, mixer, onAnimationsLoaded;
  const heartTarget = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((obj: THREE.Object3D) => {
      const name = obj.name.toLowerCase();

      if (
        // name.includes("Heart") ||
        // name.includes("chest") ||
        name.includes("spine2")
        // name.includes("upperchest")
      ) {
        heartTarget.current = obj;
      }
    });

    if (heartTarget.current) {
      console.log("❤️ Target found:", heartTarget.current.name);
      onHeartTargetFound?.(heartTarget.current);
    } else {
      console.warn("⚠️ No heart/chest target found");
    }
  }, [onHeartTargetFound]);



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
// AnimnSin

useGLTF.preload("../../public/assets/ModelAnimSingleBakewHeartblend.glb"); // optional preloading
