import { GLTFLoader } from "three/examples/jsm/Addons.js";
import "./style.css";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg") as HTMLCanvasElement,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Lights
const sunPosition = new THREE.Vector3(14000, 7000, -10000);
const sunLight = new THREE.PointLight(0xffcc33, 1000000000);
sunLight.position.add(sunPosition);
scene.add(sunLight);

// Create the sun
const sunObject = new THREE.SphereGeometry(1000);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunObject, sunMaterial);
sun.position.add(sunPosition);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Setup Effect Composer for Bloom
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(bloomPass);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill(0)
    .map(() => THREE.MathUtils.randFloatSpread(250));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill(0).forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// Moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("moon_normal_map.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

moon.position.z = 30;
moon.position.setX(-10);

const loader = new GLTFLoader();

interface loadedObject {
  scene: THREE.Group<THREE.Object3DEventMap>;
  normalAxis: THREE.Vector3;
}
let flyingSaucer: loadedObject | null, earth: loadedObject | null, rectangle;

// Load and set up flying saucer model
loader.load(
  "flying_saucer.glb",
  function (gltf) {
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.rotation.x = Math.PI / 8; // slight forward tilt
    gltf.scene.rotation.z = Math.PI / 12; // slight left tilt

    const rotationAxis = new THREE.Vector3(0, 1, 0).normalize();
    flyingSaucer = { scene: gltf.scene, normalAxis: rotationAxis };

    scene.add(gltf.scene);
  },
  undefined,
  (error) => console.error(error)
);

// Load Earth Model
loader.load(
  "earth.glb",
  function (gltf) {
    gltf.scene.scale.multiplyScalar(0.05);
    gltf.scene.position.set(-16, -22, -2);

    const rotationAxis = new THREE.Vector3(0, 1, 0).normalize();
    earth = { scene: gltf.scene, normalAxis: rotationAxis };

    scene.add(gltf.scene);
    createRectangle();
  },
  undefined,
  (error) => console.error(error)
);

// Create the embedded rectangle
function createRectangle() {
  const geometry = new THREE.PlaneGeometry(15, 9);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
  });

  // Create the rectangle mesh
  rectangle = new THREE.Mesh(geometry, material);
  rectangle.rotation.y = Math.PI;
  rectangle.position.set(-8, -2, 14);
  rectangle.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.4);

  // Flip the rectangle to correct text orientation
  rectangle.scale.x = -1;

  // Add text to the rectangle
  addTextToRectangle(rectangle);

  scene.add(rectangle);
}

// Function to create a texture from text
function addTextToRectangle(
  rectangle: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) return;

  // Set canvas size
  canvas.width = 512;
  canvas.height = 256;

  // Set background color
  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  context.font = "36px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Add text to canvas
  context.fillText(
    "Welcome to my portfolio!",
    canvas.width / 2,
    canvas.height / 2 - 30
  );
  context.fillText(
    "Enjoy your journey 🚀",
    canvas.width / 2,
    canvas.height / 2 + 40
  );

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  rectangle.material.map = texture;
  rectangle.material.needsUpdate = true;
}

let scrollPosition = 0;

function moveCamera() {
  camera.position.z = 30 + scrollPosition * 0.05;
  camera.position.x = scrollPosition * -0.001;
  camera.rotation.y = scrollPosition * -0.0002;
}

document.addEventListener("wheel", (event) => {
  scrollPosition += event.deltaY * 0.1;
  moveCamera();
});

moveCamera();

// Function to handle window resize
function onWindowResize() {
  // Update camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update the renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update the composer size for post-processing effects
  composer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener("resize", onWindowResize);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  moon.rotation.x += 0.005;

  if (flyingSaucer) {
    const distance = 12;
    const offsetRight = -10;

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(camera.up, cameraDirection).normalize();

    flyingSaucer.scene.position
      .copy(camera.position)
      .add(cameraDirection.multiplyScalar(distance))
      .add(cameraRight.multiplyScalar(offsetRight));

    flyingSaucer.scene.rotateOnAxis(flyingSaucer.normalAxis, 0.01);
  }

  if (earth) {
    earth.scene.rotateOnAxis(earth.normalAxis, 0.0025);
  }

  // Use Effect Composer for rendering with bloom
  composer.render();
}

animate();
