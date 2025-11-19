import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { AnimationAction, Group } from "three";

import { Model } from "./../models/Model";
import { ModelAnimNLE } from "./../models/ModelAnimNLE";
import "@/scss/layouts/_canvasload.scss";
import nlaData from "../../public/assets/nla_export3.json"; // <-- your exported NLA strips
const nlaJSON = [...nlaData];

interface CanvasLoadProps {
  modelUrl?: string;
}

function FixedCamera() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.position.set(0, 2, 17.7); // high + forward
    camera.lookAt(0, 20, 0); // look straight forward at model center
    camera.updateProjectionMatrix();
  }, []);

  return null;
}

export const CanvasLoad: React.FC<CanvasLoadProps> = ({
  modelUrl = "/assets/AnimnSingleBake.glb",
}) => {
  const [hovered, setHovered] = useState(false);
  const [actions, setActions] = useState<{
    actions: Record<string, AnimationAction>;
    mixer: THREE.AnimationMixer;
  } | null>(null);

  return (
    <div className="Loader-container">
      <Canvas shadows camera={{ position: [0, 2, 20], fov: 30 }}>
        <FixedCamera />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model
            url={modelUrl}
            onAnimationsLoaded={(actions, mixer) =>
              setActions({ actions, mixer })
            }
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          />
          {actions && (
            <ModelAnimNLE
              actions={actions.actions}
              mixer={actions.mixer}
              nlaData={nlaJSON} // your exported JSON
              blenderFPS={24} // match your Blender scene FPS
            />
          )}
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls
          //enableZoom={hovered}
          // enablePan={false}
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
          // screenSpacePanning={true} // ← vertical mouse drag becomes vertical pan
          //minPolarAngle={Math.PI / 2} // exactly level
          //maxPolarAngle={Math.PI / 2} // exactly level
          // minPolarAngle={0.2} // look down only a bit
          // maxPolarAngle={1.4} // prevent going below model
        />
      </Canvas>
      <div className="Loader-container tron"></div>
    </div>
  );
};
