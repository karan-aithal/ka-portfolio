import { useThree, useFrame } from "@react-three/fiber";
import { Box3, Vector3 } from "three";
import { useEffect, useState } from "react";

export function AutoFitCamera({ modelRef, padding = 1.3 }) {
  const { camera } = useThree();
  const [fitted, setFitted] = useState(false);

  useEffect(() => {
    if (!modelRef.current) return;

    // Compute bounding box
    const box = new Box3().setFromObject(modelRef.current);
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    // Largest dimension
    const maxDim = Math.max(size.x, size.y, size.z);

    // Distance required to fit bounding box using fov
    const fov = camera.fov * (Math.PI / 180);
    const distance = maxDim / (2 * Math.tan(fov / 2));

    // Camera position from Blender's -Y viewpoint
    camera.position.set(center.x, center.y, center.z);
    camera.position.y -= distance * padding; // Move toward -Y
    camera.updateProjectionMatrix();

    // Look at model center
    camera.lookAt(center);

    setFitted(true);
  }, [modelRef.current]);

  return null;
}
