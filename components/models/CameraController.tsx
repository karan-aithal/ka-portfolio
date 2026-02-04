import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

interface CameraControllerProps {
    targetBone: THREE.Bone | null;
    zoomProgress: number; // 0-1 from scroll
}

/**
 * CameraController - Controls camera zoom to Spine2 bone
 * 
 * Smoothly interpolates camera position and lookAt target based on scroll progress.
 * Target: Fill ~50% of screen with heart (Spine2) area.
 */
export const CameraController: React.FC<CameraControllerProps> = ({
    targetBone,
    zoomProgress,
}) => {
    const { camera } = useThree();

    useEffect(() => {
        if (!targetBone) return;

        // Initial camera position (from FixedCamera in CanvasLoad)
        const startPos = new THREE.Vector3(0, 2, 17.7);
        const startLookAt = new THREE.Vector3(0, 20, 0);

        // Only animate if progress > 0
        if (zoomProgress === 0) {
            camera.position.copy(startPos);
            camera.lookAt(startLookAt);
            camera.updateProjectionMatrix();
            return;
        }

        // Get Spine2 world position
        const boneWorldPos = new THREE.Vector3();
        targetBone.getWorldPosition(boneWorldPos);

        // Calculate target camera position
        // To fill 50% of screen, we need to get closer to the bone
        // FOV = 30°, so for a bone area of ~0.5 units to fill 50% screen:
        // distance = (size / coverage) / (2 * tan(fov/2))
        const fov = 30; // degrees (from Canvas config)
        const boneVisualSize = 0.8; // Approximate chest/heart area size
        const targetScreenPercentage = 6.5;

        const fovRadians = (fov * Math.PI) / 180;
        const targetDistance =
            (boneVisualSize / targetScreenPercentage) / (2 * Math.tan(fovRadians / 2));

        // Position camera in front of bone (along Z-axis)
        const offset = new THREE.Vector3(0, 0.025, targetDistance); // Slight upward offset
        const targetPos = boneWorldPos.clone().add(offset);

        // Smooth interpolation based on scroll progress
        const easedProgress = easeInOutCubic(zoomProgress);
        camera.position.lerpVectors(startPos, targetPos, easedProgress);

        // Interpolate lookAt target
        const currentLookAt = new THREE.Vector3().lerpVectors(
            startLookAt,
            boneWorldPos,
            easedProgress
        );
        camera.lookAt(currentLookAt);

        camera.updateProjectionMatrix();

        // Debug logging
        if (zoomProgress > 0 && zoomProgress % 0.1 < 0.01) {
            console.log(`📷 Camera zoom: ${(zoomProgress * 100).toFixed(1)}%`);
        }
    }, [camera, targetBone, zoomProgress]);

    return null;
};

// Smooth easing for camera movement
function easeInOutCubic(t: number): number {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
