import { useEffect, useRef } from "react";
import { ScrollController } from "@/components/animations/ScrollController";

/* ===================== SHADERS ===================== */

const fragmentShaderSource = `
precision highp float;

uniform float uScroll;
uniform float uTime;
uniform vec2 iResolution;

// ===== utilities =====
float dot2(in vec2 v) { return dot(v, v); }

// ===== sun =====
float sun(vec2 uv, float battery) {
  float val = smoothstep(0.3, 0.29, length(uv));
  float bloom = smoothstep(0.7, 0.0, length(uv));

  float scrollPhase = mix(0.0, 3.0, uScroll);
  float cut = 3.0 * sin((uv.y + scrollPhase) * 100.0)
            + clamp(uv.y * 14.0 + 1.0, -6.0, 6.0);

  cut = clamp(cut, 0.0, 1.0);
  return clamp(val * cut, 0.0, 1.0) + bloom * 0.6;
}

// ===== grid =====
float grid(vec2 uv, float baseY, float battery) {
  float dist = smoothstep(0.0, -1.2, baseY);
  float lineScale = mix(0.7, 2.0, dist);
  vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01 * lineScale;

  // scroll-driven travel
  float travel = mix(0.0, 10.0, uScroll);
  uv.y -= travel;

  // idle-only shimmer
  float idle = sin(uTime * 0.4) * 0.015;
  uv.x += idle * smoothstep(0.2, 1.0, abs(uv.y));

  uv = abs(fract(uv) - 0.5);

  vec2 lines = smoothstep(size, vec2(0.0), uv);
  lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;

  return clamp(lines.x + lines.y, 0.0, 3.0);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution) / iResolution.y;

  float battery = 1.0;
  float baseY = uv.y;

  vec3 col = vec3(0.0, 0.1, 0.2);

  float fogTightness = mix(1.4, 0.6, uScroll);
  float fog = smoothstep(0.1, -0.02, abs(uv.y) * fogTightness);

  if (uv.y < 0.0) {
    vec2 tuv = uv;
    tuv.y = 3.0 / (abs(tuv.y) + 0.05);
    tuv.x *= tuv.y;

    float g = grid(tuv, baseY, battery);

    vec3 gridColor = vec3(
      5.0 / 255.0,
      134.0 / 255.0,
      137.0 / 255.0
    );

    float dist = smoothstep(0.0, -1.2, baseY);
    float glow = mix(1.0, 0.35, dist);

    col = mix(col, gridColor * g * glow, g);
  } else {
    // Time-based sun animation - starts immediately on page load
    float sunRise = sin(uTime * 0.15) * 0.2; // Slow continuous rise/fall
    vec2 sunUV = uv + vec2(0.5, mix(-0.4, 0.05, uScroll) + sunRise);

    vec3 sunCol = mix(
      vec3(1.0, 0.2, 1.0),
      vec3(1.0, 0.4, 0.1),
      sunUV.y * 2.0 + 0.2
    );

    float pulse = 1.0 + sin(uTime * 0.6) * 0.05;
    col = mix(vec3(0.0), sunCol, sun(sunUV, battery) * pulse);
  }

  col += fog * fog * fog;
  col = mix(vec3(col.r) * 0.5, col, battery * 0.7);

  gl_FragColor = vec4(col, 1.0);
}
`;

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/* ===================== COMPONENT ===================== */

export default function SynthWaveShader({ scrollProgress = 0 }) {
  const canvasRef = useRef(null);
  const scrollProgressRef = useRef(scrollProgress);

  // Update ref when prop changes
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // ---------- resize ----------
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---------- shader compile ----------
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    // ---------- quad ----------
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ---------- uniforms ----------
    const uScrollLoc = gl.getUniformLocation(program, "uScroll");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const resLoc = gl.getUniformLocation(program, "iResolution");

    // ---------- scroll controller ----------
    const scrollController = new ScrollController({ smoothing: 0.12 });
    let idleTime = 0;

    // ---------- render ----------
    const render = () => {
      scrollController.update();

      const scroll = scrollController.getSmoothScrollRatio();
      const velocity = Math.abs(scrollController.getScrollVelocity());

      if (velocity > 0.1) idleTime = 0;
      else idleTime += 0.016;

      gl.uniform1f(uScrollLoc, scroll);
      gl.uniform1f(uTimeLoc, idleTime);
      gl.uniform2f(resLoc, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{

        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
      }}
    />
  );
}
