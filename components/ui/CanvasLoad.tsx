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
import SynthWaveShader from "@/components/3D/shaders/SynthWaveShader";
import { FixedOverlay } from "@/lib/FixedOverlayPortal";

import { Model } from "./../models/Model";
import { ModelAnimNLE } from "./../models/ModelAnimNLE";
import "@/scss/layouts/_canvasload.scss";
import nlaData from "../../public/assets/nla_export3.json"; // <-- your exported NLA strips
const nlaJSON = [...nlaData];

// import StarfieldBackground from "../ui/StarfieldBackground";
// import SynthWaveScroll from "@/components/3D/shaders/SynthScroll";
import { useStickWhenTopReached } from "@/lib/useStickWhenTopReached";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [shaderDone, setShaderDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Disabled: ScrollTrigger handles pinning now
  // useStickWhenTopReached(containerRef, setIsFixed);

  const CanvasStack = (
    <>
      <div className="synthwave-container">
        <SynthWaveShader scrollProgress={scrollProgress} />
      </div>
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
              nlaData={nlaJSON}
              blenderFPS={24}
              onScrollProgress={setScrollProgress}
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
    </>
  );

  return (
    <div ref={containerRef} className="Loader-container">
      {CanvasStack}
    </div>
  );
};


{/* <div ref={containerRef} className="Loader-container"> */ }
{/* <StarfieldBackground /> */ }
{/* <SynthWaveScroll /> */ }
{/* <div className="synthwave-container">
    <SynthWaveShader />
  </div>
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
    />
  </Canvas> */}
{/* <div className="Loader-container tron"></div> */ }
// </div>