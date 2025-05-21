import * as THREE from 'three';

let scene, camera, renderer, mesh;

let scrollStrength = 0;
let lastScrollY = window.scrollY;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const container = document.querySelector('.project');
  container.appendChild(renderer.domElement);

  // 브라우저 전체 PlaneGeometry
  const vFov = (camera.fov * Math.PI) / 180;
  const planeHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
  const planeWidth = planeHeight * camera.aspect;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollStrength: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScrollStrength;

      void main() {
        float maxHeight = 0.25 * uScrollStrength;
        float gradient = smoothstep(maxHeight * 1.2, 0.0, vUv.y);

        // 아래에서 위로 올라가는 linear-gradient 색상
        vec3 colorBottom = vec3(0.5, 1.0, 0.83); //rgb(158, 254, 222)
        vec3 colorMid = vec3(0.0, 0.75, 1.0);    //rgb(46, 215, 231)
        vec3 colorTop = vec3(0.12, 0.56, 1.0);   //rgb(17, 114, 211) 

        // vUv.y가 0에 가까울수록 colorBottom, 0.5 부근은 colorMid, maxHeight에 가까울수록 colorTop
        float t = clamp(vUv.y / maxHeight, 0.0, 1.0);
        vec3 holo = mix(
          mix(colorBottom, colorMid, t * 1.2), // 아래~중간
          colorTop, t                         // 중간~위
        );

        // 아래쪽이 가장 선명, 위로 갈수록 약해짐
        float intensity = 1.0 - t;
        // float intensity = mix(0.5, 1.0, 1.0 - t); // 최소 0.5 보장

        holo *= intensity;

        float alpha = 0.65 * uScrollStrength * gradient * intensity; // 아래쪽이 더 진하게

        gl_FragColor = vec4(holo, alpha);
      }
    `,
    transparent: true,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener('resize', onWindowResize);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // geometry 업데이트
  const vFov = (camera.fov * Math.PI) / 180;
  const planeHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
  const planeWidth = planeHeight * camera.aspect;
  const newGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
  mesh.geometry.dispose();
  mesh.geometry = newGeometry;
}

function updateScrollStrength() {
  const currentScrollY = window.scrollY;
  const delta = Math.abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;

  // 속도값 보정 (0 ~ 1 사이)
  scrollStrength += delta * 0.01;
  scrollStrength = Math.min(scrollStrength, 1); // 최대 1
}

function animate() {
  requestAnimationFrame(animate);

  // 스크롤이 멈추면 scrollStrength를 점점 0으로 감소
  scrollStrength *= 0.92; // 감쇠율(0.9~0.95 사이로 조절 가능)
  if (mesh && mesh.material && mesh.material.uniforms) {
    mesh.material.uniforms.uTime.value += 0.01;
    mesh.material.uniforms.uScrollStrength.value = scrollStrength;
  }
  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('scroll', updateScrollStrength);
