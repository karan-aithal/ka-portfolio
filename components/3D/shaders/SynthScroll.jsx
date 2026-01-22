// import { useEffect, useRef } from "react";
// import { ScrollController } from "@/components/animations/ScrollController"; // ← your file

// // ================= SHADERS =================
// // import fragmentShaderSource from "./fragment.glsl"; // or inline string
// // import vertexShaderSource from "./vertex.glsl";     // or inline string

// export default function SynthWaveShaderScroll() {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const gl = canvas.getContext("webgl");
//         if (!gl) return;

//         // ---------------- Resize ----------------
//         const resize = () => {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//             gl.viewport(0, 0, canvas.width, canvas.height);
//         };
//         resize();
//         window.addEventListener("resize", resize);

//         // ---------------- Compile ----------------
//         const compile = (type, source) => {
//             const shader = gl.createShader(type);
//             gl.shaderSource(shader, source);
//             gl.compileShader(shader);
//             if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//                 console.error(gl.getShaderInfoLog(shader));
//             }
//             return shader;
//         };

//         const program = gl.createProgram();
//         gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShaderSource));
//         gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShaderSource));
//         gl.linkProgram(program);
//         gl.useProgram(program);

//         // ---------------- Quad ----------------
//         const buffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//         gl.bufferData(
//             gl.ARRAY_BUFFER,
//             new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
//             gl.STATIC_DRAW
//         );

//         const posLoc = gl.getAttribLocation(program, "position");
//         gl.enableVertexAttribArray(posLoc);
//         gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

//         // ---------------- Uniforms ----------------
//         const uScrollLoc = gl.getUniformLocation(program, "uScroll");
//         const uTimeLoc = gl.getUniformLocation(program, "uTime");
//         const resLoc = gl.getUniformLocation(program, "iResolution");

//         // ---------------- Scroll Controller ----------------
//         const scrollController = new ScrollController({
//             smoothing: 0.12
//         });

//         let idleTime = 0;

//         // ---------------- Render Loop ----------------
//         const render = () => {
//             scrollController.update();

//             const scroll = scrollController.getSmoothScrollRatio();
//             const velocity = Math.abs(scrollController.getScrollVelocity());

//             // Reset idle time while scrolling
//             if (velocity > 0.1) {
//                 idleTime = 0;
//             } else {
//                 idleTime += 0.016; // ~60fps
//             }

//             gl.uniform1f(uScrollLoc, scroll);
//             gl.uniform1f(uTimeLoc, idleTime);
//             gl.uniform2f(resLoc, canvas.width, canvas.height);

//             gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//             requestAnimationFrame(render);
//         };

//         render();

//         return () => {
//             window.removeEventListener("resize", resize);
//         };
//     }, []);

//     return (
//         <canvas
//             ref={canvasRef}
//             style={{
//                 position: "fixed",
//                 inset: 0,
//                 width: "100vw",
//                 height: "100vh",
//                 zIndex: 0
//             }}
//         />
//     );
// }
