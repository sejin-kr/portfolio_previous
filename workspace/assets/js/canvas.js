import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let gui;
let scene, camera, renderer, mesh, controls;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

let uniforms;

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 3;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  const container = document.querySelector('.sec-hero');
  container.appendChild(renderer.domElement);

  // Light 1: Pink light
  const pinkLight = new THREE.PointLight(0xffb6c1, 2.5, 10);
  pinkLight.position.set(2, 2, 2);
  scene.add(pinkLight);

  // Light 2: Blue light
  const blueLight = new THREE.PointLight(0xadd8e6, 2, 10);
  blueLight.position.set(-2, -2, 2);
  scene.add(blueLight);

  // Light 3: Ambient Light
  const ambient = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambient);

  // Light 4: Directional Light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3.8, 1, 5);
  scene.add(directionalLight);

  // Geometry & Material
  const geometry = new THREE.IcosahedronGeometry(1, 6); // Sphere-like
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffccff,
    // metalness: 0.6,
    // roughness: 0.1,
    // envMapIntensity: 2,
    // clearcoat: 1.0,
    // envMapIntensity: 1,
    // flatShading: false,
    color: 0xdddddd, // 거의 흰색이나 살짝 푸른빛 추천
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.5,
    transmission: 1.0, // 빛을 통과시킴 (MeshPhysicalMaterial에서만 가능)
    ior: 1.5, // 유리 굴절률
    thickness: 0.1, // 유리 두께 (빛 굴절에 영향)
    envMapIntensity: 1.0, // 주변 반사 정도
    clearcoat: 1.0,
  });

  uniforms = {
    time: { value: 0.0 },
    color: { value: new THREE.Color(0xffedfa) },
  };

  // Mesh
  mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.6, 0.6, 0.6);
  scene.add(mesh);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;

  // dat.GUI
  gui = new dat.GUI();

  // Create a folder for controlling the camera
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'x', -10, 10).name('Camera X');
  cameraFolder.add(camera.position, 'y', -10, 10).name('Camera Y');
  cameraFolder.add(camera.position, 'z', -10, 10).name('Camera Z');
  cameraFolder.open(); // 폴더 열기

  // Create a folder for controlling the mesh material
  const materialFolder = gui.addFolder('Material');
  materialFolder.add(mesh.material, 'metalness', 0, 1).name('Metalness');
  materialFolder.add(mesh.material, 'roughness', 0, 1).name('Roughness');
  materialFolder.add(mesh.material, 'envMapIntensity', 0, 1).name('Env Map Intensity');
  materialFolder.open(); // 폴더 열기

  const dirFolder = gui.addFolder('Directional Light');
  dirFolder.add(directionalLight.position, 'x', -10, 10);
  dirFolder.add(directionalLight.position, 'y', -10, 10);
  dirFolder.add(directionalLight.position, 'z', -10, 10);
  dirFolder.open();

  // Event
  document.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onMouseMove(event) {
  // Normalize mouse coordinates between -1 and 1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set target rotation based on mouse position (반대방향: -)
  targetRotation.y = -mouse.x * 0.5;
  targetRotation.x = -mouse.y * 0.5;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  uniforms.time.value += 0.02;

  // Smooth rotation
  mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.03;
  mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.03;

  // Update controls
  controls.update();

  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', function () {
  init();
  animate();
});
