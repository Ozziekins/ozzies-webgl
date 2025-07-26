import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  SRGBColorSpace,
  Clock,
  Group,
} from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';

export default class App {
  #gl;
  #scene;
  #camera;
  #stats;
  #controls;
  #clock;
  #modelGroup;

  constructor() {
    this.#clock = new Clock();
    this.#modelGroup = new Group();

    this.#init();
  }

  async #init() {
    // RENDERER
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true,
    });
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.4)); 
    this.#gl.shadowMap.enabled = true;
    this.#gl.outputColorSpace = SRGBColorSpace;

    // SCENE
    this.#scene = new Scene();
    this.#scene.background = new Color('#f5f0fa'); // soft lavender

    // CAMERA
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 0.1, 100);
    this.#camera.position.set(7, 4, 10); // zoomed out a bit
    this.#camera.lookAt(0, 1, 0);

    // STATS
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);

    // CONTROLS
    this.#controls = new OrbitControls(this.#camera, this.#gl.domElement);
    this.#controls.enableDamping = true;

    // LIGHTS
    this.#initLights();

    // GROUND
    this.#initGround();

    // MODEL
    await this.#loadModel();

    // EVENTS
    window.addEventListener('resize', this.#resize.bind(this));

    // START
    this.#animate();
  }

  #initLights() {
    const ambient = new AmbientLight(0xffffff, 0.6);
    this.#scene.add(ambient);

    const directional = new DirectionalLight(0xffffff, 1.5);
    directional.position.set(6, 8, 4);
    directional.castShadow = true;

    directional.shadow.mapSize.set(1024, 1024);
    directional.shadow.radius = 6;
    directional.shadow.bias = -0.001;

    this.#scene.add(directional);
  }

  #initGround() {
    const geometry = new PlaneGeometry(20, 20);
    const material = new MeshStandardMaterial({
      color: '#fff0f5',      // soft pink ground
      metalness: 0.2,
      roughness: 0.4,
    });
    const ground = new Mesh(geometry, material);

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;

    this.#scene.add(ground);
  }

  async #loadModel() {
    const loader = new GLTFLoader();
    const glb = await loader.loadAsync('/lamp.glb');

    const model = glb.scene;
    model.scale.setScalar(0.5);        // smaller scale
    model.position.y = 0.1;            // slight float
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
        child.material.envMapIntensity = 1;
      }
    });

    this.#modelGroup.add(model);
    this.#scene.add(this.#modelGroup);
  }

  #resize() {
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
  }

  #animate = () => {
    this.#stats.begin();

    this.#controls.update();

    this.#modelGroup.rotation.y += 0.002;
    this.#gl.render(this.#scene, this.#camera);

    this.#stats.end();
    requestAnimationFrame(this.#animate);
  };
}
