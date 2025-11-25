"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
//import "@/public/styles/starfield.css";

export default function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // const width = containerRef.current.offsetWidth;
    // const height = containerRef.current.offsetHeight;

    const width = window.innerWidth;
    const height = window.innerHeight;
    // Setup renderer + scene + camera
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.domElement.className = "starfield-canvas";
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -500,
      1000
    );

    let stars: Star[] = [];
    let mouseDown = false;
    let viewPoint = new THREE.Vector2(0, 0);

    function setViewPoint(x: number, y: number) {
      viewPoint.x = THREE.MathUtils.mapLinear(
        x,
        -width / 2,
        width / 2,
        -15,
        15
      );
      viewPoint.y = THREE.MathUtils.mapLinear(
        y,
        -height / 2,
        height / 2,
        -15,
        15
      );
    }

    // ------------------------------
    // STAR CLASS (exact p5 logic)
    // ------------------------------
    class Star {
      mesh: THREE.Mesh;
      position: THREE.Vector2;
      direction: THREE.Vector2;
      colorVal = 0;
      size: number;

      constructor(p: THREE.Vector2) {
        const geo = new THREE.PlaneGeometry(1, 1);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color("white"),
          transparent: true,
        });

        this.size = THREE.MathUtils.randFloat(0.5, 1.5);
        this.mesh = new THREE.Mesh(geo, mat);
        this.position = p.clone();

        // vector from center
        const v = new THREE.Vector2(p.x - width / 2, p.y - height / 2);
        this.direction = v.normalize();

        scene.add(this.mesh);
      }

      update() {
        // p5 behavior: accelerate a bit each frame
        const accel = THREE.MathUtils.randFloat(1.07, 1.1);
        this.direction.multiplyScalar(accel);

        // move outward + viewpoint offset
        this.position.add(this.direction);
        this.position.add(viewPoint);

        // brightness fade-in
        if (this.colorVal < 100) this.colorVal += 3;
        const b = this.colorVal / 100;

        // update material brightness
        (this.mesh.material as THREE.MeshBasicMaterial).color.setRGB(b, b, b);

        // grow slightly like p5
        this.size += 0.05;
        this.mesh.scale.set(this.size, this.size, 1);

        // update mesh position
        this.mesh.position.set(
          this.position.x - width / 2,
          height / 2 - this.position.y,
          0
        );
      }

      isDead() {
        return (
          this.position.x < 0 ||
          this.position.y < 0 ||
          this.position.x > width ||
          this.position.y > height
        );
      }

      remove() {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        (this.mesh.material as any).dispose();
      }
    }

    // -----------------------------------------------------------
    // SPAWN FUNCTIONS (exactly like p5)
    // -----------------------------------------------------------

    function spawnFieldStar() {
      // uniform rectangular distribution (CSS-like)
      const x = Math.random() * width;
      const y = Math.random() * height;
      return new THREE.Vector2(x, y);
    }

    function spawnTunnelStar() {
      const radius = 50;
      const angle = Math.random() * Math.PI * 2;

      const x = width / 2 + radius * Math.cos(angle);
      const y = height / 2 + radius * Math.sin(angle);

      return new THREE.Vector2(x, y);
    }

    // -----------------------------------------------------------
    // MOUSE EVENTS – identical to p5 behavior
    // -----------------------------------------------------------
    window.addEventListener("mousedown", (e) => {
      mouseDown = true;
      document.body.style.cursor = "none";
    });

    window.addEventListener("mouseup", () => {
      mouseDown = false;
      document.body.style.cursor = "default";
      viewPoint.set(0, 0);
    });

    window.addEventListener("mousemove", (e) => {
      if (!mouseDown) return;
      setViewPoint(e.clientX - width / 2, e.clientY - height / 2);
    });

    // -----------------------------------------------------------
    // MAIN LOOP
    // -----------------------------------------------------------
    function animate() {
      requestAnimationFrame(animate);

      // tunnel spawn when clicking (20 per frame)
      if (mouseDown) {
        for (let i = 0; i < 8; i++) {
          stars.push(new Star(spawnTunnelStar()));
        }
      }

      // field stars (15 per frame)
      for (let i = 0; i < 8; i++) {
        stars.push(new Star(spawnFieldStar()));
      }

      // update + remove
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.update();

        // if (s.isDead()) {
        //   s.remove();
        //   stars.splice(i, 1);
        // }
      }

      renderer.render(scene, camera);
    }

    animate();

    // cleanup
    return () => {
      stars.forEach((s) => s.remove());
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="starfield-container" />;
}
