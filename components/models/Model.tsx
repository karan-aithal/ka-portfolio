import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
import * as THREE from "three";

type ModelProps = {
  url: string;
  onAnimationsLoaded?: (clips: any, mixer: any) => void;
  onBoneFound?: (bone: THREE.Bone) => void;
  onPointerOver?: (event: any) => void;
  onPointerOut?: (event: any) => void;
};

export const Model: React.FC<ModelProps> = ({
  url,
  onAnimationsLoaded,
  onBoneFound,
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

  // Find Spine2 bone for heart zoom
  useEffect(() => {
    if (!scene || !onBoneFound) return;

    scene.traverse((child: any) => {
      if (child.type === "Bone" && child.name === "Spine2") {
        console.log("🫀 Found Spine2 bone:", child);
        onBoneFound(child as THREE.Bone);
      }
    });
  }, [scene, onBoneFound]);

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

useGLTF.preload("../../public/assets/ModelAnimSingleBakewHeartblend.glb"); // optional preloading
