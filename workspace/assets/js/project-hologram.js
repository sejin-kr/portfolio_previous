import * as THREE from 'three';

let scenes = [];
let cameras = [];
let renderers = [];
let meshes = [];
let scrollY = 0;
let targetScrollY = 0;

function init() {
  const projectImages = document.querySelectorAll('.project-list .img-box');

  projectImages.forEach((container, index) => {
    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Geometry & Material
    const geometry = new THREE.PlaneGeometry(1.4, 1.6, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uTexture: { value: new THREE.TextureLoader().load(container.querySelector('img').src) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // 스크롤에 따른 물결 효과
          float ripple = sin(uv.x * 10.0 - uTime * 4.0) * 0.05;
          pos.z += ripple;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uScroll;
        
        // 홀로그램 컬러 함수
        vec3 hologramColor(float t) {
          return vec3(
            0.5 + 0.5 * sin(6.2831 * t + 0.0),
            0.5 + 0.5 * sin(6.2831 * t + 2.0),
            0.5 + 0.5 * sin(6.2831 * t + 4.0)
          );
        }
        
        void main() {
          vec2 uv = vUv;
          
          // 스크롤에 따른 페이드 아웃
          float fade = 1.0 - smoothstep(0.0, 1.0, uScroll);
          
          // 홀로그램 효과 강도
          float holoStrength = uScroll * 6.2;
          
          // RGB 분리(프리즘 효과)
          float angle = uTime * 0.2 + uScroll * 2.0;
          vec2 offset = vec2(cos(angle), sin(angle)) * 0.01 * holoStrength;
          vec4 texR = texture2D(uTexture, uv + offset);
          vec4 texG = texture2D(uTexture, uv);
          vec4 texB = texture2D(uTexture, uv - offset);
          vec4 tex = vec4(texR.r, texG.g, texB.b, texG.a);
          
          // 홀로그램 컬러 오버레이
          vec3 holo = hologramColor(uv.x + uv.y + uTime * 0.1) * holoStrength * 0.6;
          
          gl_FragColor = vec4(tex.rgb + holo, tex.a * fade);
        }
      `,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    scenes.push(scene);
    cameras.push(camera);
    renderers.push(renderer);
    meshes.push(mesh);
  });

  window.addEventListener('scroll', onScroll);
  animate();
}

function onScroll() {
  targetScrollY = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  scrollY += (targetScrollY - scrollY) * 0.1;

  meshes.forEach((mesh, index) => {
    mesh.material.uniforms.uTime.value += 0.01;
    mesh.material.uniforms.uScroll.value = scrollY;
    renderers[index].render(scenes[index], cameras[index]);
  });
}

document.addEventListener('DOMContentLoaded', init);
