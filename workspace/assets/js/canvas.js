import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, mesh;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let scrollY = 0;
let targetScrollY = 0;
let rippleEffect = 0;
let scrollDir = 0; // -1, 0, 1
let transitionWeight = 1; // 0~1, 1이면 현재 방향 100%
let lastDir = 0;
let targetScale = 1;
let currentScale = 0.0; // scale 0에서 시작
let targetRotationY = 0; // 0deg
let currentRotationY = Math.PI / 6; // 30deg
let geometry, material;

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 3;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const container = document.querySelector(".sec-hero");
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
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uRipple: { value: 0 },
      uScrollDir: { value: 0 },
      uTransitionWeight: { value: 1 },
      // uTexture: { value: new THREE.TextureLoader().load('../assets/images/test.jpg') }, // for local
      uTexture: {
        value: new THREE.TextureLoader().load("/assets/images/test.jpg"),
      }, // for server
      uIsMobile: { value: window.innerWidth <= 768 ? 1 : 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uRipple;

      void main() {
        vUv = uv;

        vec3 pos = position;

        // 마우스 움직임에 따른 변형
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.5, 0.0, dist);
        pos.z += influence * 0.1;

        // 스크롤에 따른 물결 효과
        float ripple = sin(dist * 10.0 - uTime * 4.0) * uRipple;
        pos.z += ripple * 0.05;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,

    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uRipple;
      uniform float uScrollDir;
      uniform float uTransitionWeight;

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

        // 마우스 움직임에 따른 UV 왜곡
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.5, 0.0, dist);
        uv += (uv - uMouse) * influence * 0.1;

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

        // 아래쪽(내려갈 때) 마스크
        float maskDown = smoothstep(0.5, 0.0, uv.y);
        // 위쪽(올라갈 때) 마스크
        float maskUp = smoothstep(1.0, 0.5, uv.y);

        // 현재 방향에 따라 보간
        float mask = 0.0;
        if (uScrollDir > 0.0) {
          mask = mix(maskUp, maskDown, uTransitionWeight);
        } else if (uScrollDir < 0.0) {
          mask = mix(maskDown, maskUp, uTransitionWeight);
        }

        mask = clamp(mask, 0.0, 1.0);

        // 홀로그램 효과를 마스크로 제한
        gl_FragColor = vec4(tex.rgb + holo * mask, tex.a * fade);
      }
    `,
    transparent: true,
  });

  mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(currentScale, currentScale, currentScale);
  mesh.rotation.y = currentRotationY;
  scene.add(mesh);

  // Event Listeners
  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("scroll", onScroll);

  animate();
}

function onMouseMove(event) {
  mouse.x = event.clientX / window.innerWidth;
  mouse.y = 1 - event.clientY / window.innerHeight;
}

function onScroll() {
  targetScrollY =
    window.scrollY /
    (document.documentElement.scrollHeight - window.innerHeight);
}

// PlaneGeometry 생성 함수
function createPlaneGeometryToFitSecHero() {
  const container = document.querySelector(".sec-hero");
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  // 카메라 z, fov, aspect에 따라 화면에 딱 맞는 크기 계산
  const vFov = (camera.fov * Math.PI) / 180;
  const planeHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
  const planeWidth = planeHeight * camera.aspect;

  // 모바일 여부 판단
  const isMobile = window.innerWidth <= 768;

  // 세분화 수치 설정
  const segments = isMobile ? 16 : 32;

  // sec-hero의 비율에 맞게 PlaneGeometry 생성
  const targetAspect = width / height;
  let geoWidth, geoHeight;
  if (targetAspect > camera.aspect) {
    geoWidth = planeWidth;
    geoHeight = planeWidth / targetAspect;
  } else {
    geoHeight = planeHeight;
    geoWidth = planeHeight * targetAspect;
  }

  return new THREE.PlaneGeometry(planeWidth, planeHeight, segments, segments);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerWidth <= 768) {
    // 기존 mesh 제거
    scene.remove(mesh);
    // 새 geometry 생성
    geometry = createPlaneGeometryToFitSecHero();
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    // scale은 1로 고정
    mesh.scale.set(1, 1, 1);
    scene.add(mesh);
  } else {
    // 데스크탑일 때는 기존 geometry/scale 사용
    // (원하는 기본 geometry로 복원)
    // 필요시 geometry를 다시 생성해서 할당
    // mesh.scale.set(currentScale, currentScale, currentScale);
  }
}

function animate() {
  requestAnimationFrame(animate);

  scrollY += (targetScrollY - scrollY) * 0.1;

  // 스크롤 방향 계산
  let dir = 0;
  if (targetScrollY > scrollY) dir = 1;
  else if (targetScrollY < scrollY) dir = -1;

  // 방향이 바뀌면 transitionWeight를 0부터 시작
  if (dir !== lastDir && dir !== 0) {
    scrollDir = dir;
    transitionWeight = 0;
    lastDir = dir;
  }
  // 방향이 유지되면 transitionWeight를 1로 서서히 증가
  if (transitionWeight < 1) {
    transitionWeight += 0.08;
    if (transitionWeight > 1) transitionWeight = 1;
  }

  mesh.material.uniforms.uScrollDir.value = scrollDir;
  mesh.material.uniforms.uTransitionWeight.value = transitionWeight;

  // 768px 이하일 때 물결 효과 약하게, 그 외에는 강하게
  if (window.innerWidth <= 768) {
    rippleEffect = 0.3;
  } else {
    rippleEffect = 1.0;
  }

  // 쉐이더 유니폼 업데이트
  mesh.material.uniforms.uTime.value += 0.01;
  mesh.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
  mesh.material.uniforms.uScroll.value = scrollY;
  mesh.material.uniforms.uRipple.value = rippleEffect;

  // scale, rotation 보간 (자연스럽게 커지고 회전)
  if (currentScale < targetScale) {
    currentScale += (targetScale - currentScale) * 0.03;
    if (Math.abs(currentScale - targetScale) < 0.001)
      currentScale = targetScale;
  }
  if (Math.abs(currentRotationY - targetRotationY) > 0.001) {
    currentRotationY += (targetRotationY - currentRotationY) * 0.02;
    if (Math.abs(currentRotationY - targetRotationY) < 0.001)
      currentRotationY = targetRotationY;
  }
  mesh.scale.set(currentScale, currentScale, currentScale);
  mesh.rotation.y = currentRotationY;

  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', init);
