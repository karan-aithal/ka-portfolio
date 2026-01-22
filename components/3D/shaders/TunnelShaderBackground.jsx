import { useEffect, useRef } from "react";

export default function TunnelShaderBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl");
        if (!gl) return;

        // =========================
        // Resize (Shadertoy-accurate)
        // =========================
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        // =========================
        // Vertex shader
        // =========================
        const vertexShaderSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        // =========================
        // Fragment shader
        // ORIGINAL SHADER
        // ONLY CHANGE: CAM_SWING disabled
        // texture() → texture2D()
        // =========================
        const fragmentShaderSrc = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

//#define PURE_REFLECTION
//#define CAM_ROTATION
//#define CAM_SWING
#define DEPTH_OF_FIELD
//#define MOTION_BLUR

const int sampleNum = 8;

mat2 r2(float a){ return mat2(cos(a), sin(a), -sin(a), cos(a)); }

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(425.215, 714.388)))*45758.5453);
}

vec2 hash22(vec2 p) {
  return fract(sin(vec2(
    dot(p, vec2(72.927, 98.283)),
    dot(p, vec2(41.295, 57.263))
  )) * vec2(43758.5453, 23421.6361));
}

vec3 hash23(vec2 p){
  return fract(sin(vec3(
    dot(p, vec2(12.989, 78.233)),
    dot(p, vec2(51.898, 56.273)),
    dot(p, vec2(41.898, 57.263))
  )) * vec3(43758.5453, 23421.6361, 65426.6357));
}

float tick(float t, float d) {
  float m = fract(t/d);
  m = smoothstep(0., 1., m);
  m = smoothstep(0., 1., m);
  return (floor(t/d) + m)*d;
}

float tickTime(float t){ return t*2. + tick(t, 4.)*.75; }

void cam(inout vec3 p, float tm, float tTime) {
#ifdef CAM_ROTATION
  p.xy *= r2(tm/4.);
  p.xz *= r2(tm/2.);
#endif
#ifdef CAM_SWING
  p.xz *= r2(sin(tTime*.3)*.4);
  p.xy *= r2(sin(tTime*.1)*2.);
#endif
}

float rayPlane(vec3 ro, vec3 rd, vec3 n, float d){
  float t = 1e8;
  float ndotdir = dot(rd, n);
  if (ndotdir < 0.) {
    float dist = (-d - dot(ro, n) + 9e-7)/ndotdir;
    if (dist > 0. && dist < t) t = dist;
  }
  return t;
}

float udBox(vec2 p, vec2 b){
  return length(max(abs(p) - b + .1, 0.)) - .1;
}

float uvShape(vec2 p){
  p = abs(p);
  return max(p.x, p.y);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - iResolution.xy*.5) / iResolution.y;

  float tm = iTime;
//   float tickTm = tickTime(tm);
 float tickTm = tm * 1.0;
  vec3 ca = vec3(0, 0, tickTm);
  vec3 col = vec3(0);

  for(int j=0; j<sampleNum; j++){
    vec2 offs = hash22(uv + float(j)*74.542 + 35.877) - .5;

    vec3 ro = vec3(0);
    ro.xy += offs * .05;
    vec3 r = normalize(vec3(uv - offs*.05/3., 1.));

    cam(ro, tm, tickTm);
    cam(r, tm, tickTm);
    ro.z += ca.z;

    float alpha = 1.;
    float fogD = 1e5;

    for(int i=0; i<3; i++){
      vec4 pl;
      pl.x = rayPlane(ro, r, vec3(0,1,0), 1.);
      pl.y = rayPlane(ro, r, vec3(0,-1,0), 1.);
      pl.z = rayPlane(ro, r, vec3(1,0,0), 1.);
      pl.w = rayPlane(ro, r, vec3(-1,0,0), 1.);

      float d = min(min(pl.x,pl.y), min(pl.z,pl.w));
      if(i==0) fogD = d;

      vec3 p = ro + r*d;
      vec3 n = vec3(0, pl.x<pl.y?1.:-1., 0);
      vec2 tuv = p.xz + vec2(0,n.y);

      if(min(pl.z,pl.w) < min(pl.x,pl.y)){
        n = vec3(pl.z<pl.w?1.:-1.,0,0);
        tuv = p.yz + vec2(n.x,0);
      }

      const float sc = 12.;
      tuv *= sc;

      vec2 id = floor(tuv);
      tuv -= id + .5;

      float patDist = udBox(tuv, vec2(.4));
      float sh = clamp(.5 - patDist/.2, 0., 1.);

      vec3 sqCol = .85 + .3*cos(hash21(id)*6.2831 + vec3(0,1,2));
      vec3 sampleCol = mix(vec3(0), sqCol*sh, 1.-smoothstep(0.,.005,patDist));

      vec3 ip3 = (floor(p*sc)) / sc;
      float ang = atan(ip3.x, ip3.y)/6.2831;
      vec2 tnuv = vec2(uvShape(ip3.xy)*ang*2., ip3.z*0.5);

      vec3 p3 = mix(p, ip3, .8);
      float ang2 = atan(p3.x, p3.y)/6.2831;
      vec2 tnuv2 = vec2(uvShape(p3.xy)*ang2 + p3.z*.075, p3.z*.25);

      vec3 tx  = texture2D(iChannel0, fract(tnuv  - .5 - vec2(iTime/(sc)/2., 0))).xyz; tx *= tx;
      vec3 tx2 = texture2D(iChannel1, fract(tnuv2 - .5 - vec2(iTime/(sc)/2., 0))).xyz; tx2 *= tx2;

      sampleCol *= tx * tx2 * 4.;

      vec3 ld = normalize(ca + vec3(0,0,3) - p);
      float dif = max(dot(ld, n), 0.);
      float spe = pow(max(dot(reflect(ld, -n), -r), 0.), 8.);
      float fre = pow(max(1. - abs(dot(r, n))*.5, 0.), 1.);

      sampleCol *= dif + vec3(1,.9,.7)*spe*4. + vec3(.5,.7,1)*fre;
      sampleCol *= 1.35 / (1. + fogD*fogD*.05);

      col += sampleCol * alpha * fre;
      alpha *= .9;

      r = reflect(r,n);
      ro = p + n*.0011;
    }
  }

  col /= float(sampleNum);
  gl_FragColor = vec4(pow(max(col,0.), vec3(0.4545)), 1.);
}
`;

        // =========================
        // Compile helpers
        // =========================
        const compile = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
                throw gl.getShaderInfoLog(s);
            return s;
        };

        const program = gl.createProgram();
        gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShaderSrc));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShaderSrc));
        gl.linkProgram(program);
        gl.useProgram(program);

        // =========================
        // Fullscreen quad
        // =========================
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

        // =========================
        // Texture loader (Shadertoy-accurate)
        // =========================
        const loadTexture = (unit, url) => {
            const tex = gl.createTexture();
            const img = new Image();
            img.src = url;
            img.onload = () => {
                gl.activeTexture(gl.TEXTURE0 + unit);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            };
        };

        loadTexture(0, "/assets/IChannel1.jpg");
        loadTexture(1, "/assets/IChannel2.jpg");

        gl.uniform1i(gl.getUniformLocation(program, "iChannel0"), 0);
        gl.uniform1i(gl.getUniformLocation(program, "iChannel1"), 1);

        const timeLoc = gl.getUniformLocation(program, "iTime");
        const resLoc = gl.getUniformLocation(program, "iResolution");

        const start = performance.now();
        const render = () => {
            gl.uniform1f(timeLoc, (performance.now() - start) * 0.001);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        };
        render();

        return () => window.removeEventListener("resize", resize);
    }, []);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
