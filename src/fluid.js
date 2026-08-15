import {
  Clock,
  DoubleSide,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

export function createFluidScene(canvas) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 4.8;

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new Vector2(0.5, 0.5) },
  };
  const geometry = new IcosahedronGeometry(1.35, 6);
  const material = new ShaderMaterial({
    transparent: true,
    side: DoubleSide,
    uniforms,
    vertexShader: `
      uniform float uTime;
      uniform vec2 uPointer;
      varying vec3 vN;
      varying vec3 vP;
      float hash(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float noise(vec3 x) {
        vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y), mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      void main() {
        vec3 p = position;
        float n = noise(normal * 2.3 + uTime * .22) + .5 * noise(normal * 5. - uTime * .16);
        p += normal * (n - .6) * .62;
        p.x += (uPointer.x - .5) * .28;
        p.y += (uPointer.y - .5) * .2;
        vN = normalMatrix * normal;
        vP = p;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }
    `,
    fragmentShader: `
      varying vec3 vN;
      varying vec3 vP;
      uniform float uTime;
      void main() {
        float fres = pow(1. - abs(dot(normalize(vN), vec3(0.,0.,1.))), 2.2);
        float bands = .5 + .5 * sin(vP.y * 7. + vP.x * 3. + uTime);
        vec3 acid = vec3(.68,1.,0.);
        vec3 hot = vec3(1.,.08,.01);
        vec3 col = mix(acid, hot, bands * .48);
        gl_FragColor = vec4(col, .05 + fres * .53);
      }
    `,
  });
  const blob = new Mesh(geometry, material);
  blob.position.set(1.55, -0.35, 0);
  scene.add(blob);

  const pointer = { x: 0.5, y: 0.5 };
  const clock = new Clock();
  let frameId;

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    blob.scale.setScalar(innerWidth < 760 ? 0.82 : 1);
  };
  const updatePointer = (event) => {
    pointer.x = event.clientX / innerWidth;
    pointer.y = 1 - event.clientY / innerHeight;
  };
  const render = () => {
    if (!document.hidden) {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uPointer.value.x += (pointer.x - uniforms.uPointer.value.x) * 0.025;
      uniforms.uPointer.value.y += (pointer.y - uniforms.uPointer.value.y) * 0.025;
      blob.rotation.x += 0.0015;
      blob.rotation.y += 0.0025;
      renderer.render(scene, camera);
    }
    frameId = requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', updatePointer);
  resize();
  render();

  return {
    blob,
    destroy() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
