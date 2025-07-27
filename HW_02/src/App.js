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

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';
import resources from './resources/index.js';
import { gsap } from 'gsap';

// CONFIGURATION FOR CHANGING THEMES
const CONFIG = {
  light: {
    background: '#f5f0fa',
    ambient: 0.6,
    dirColor: '#ffffff',
    dirIntensity: 1.5,
  },
  dark: {
    background: '#181a23',
    ambient: 0.2,
    dirColor: '#fff1c7',
    dirIntensity: 1.6,
  },
};

export default class App {
  #gl;
  #scene;
  #camera;
  #stats;
  #controls;
  #clock;
  #theme = 'light';

  #ambient;
  #directional;
  #modelGroup;

  constructor() {
    this.#clock = new Clock();
    this.#modelGroup = new Group();
    this.#init();
  }

  async #init() {
    this.#initRenderer();
    this.#initScene();
    this.#initCamera();
    this.#initStats();
    this.#initControls();
    this.#initEvents();

    await resources.load();

    this.#initLights();
    this.#initGround();
    this.#initModel();

    this.#animate();
  }

  // RENDERER INITIALIZATION
  #initRenderer() {
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true,
    });
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    this.#gl.outputColorSpace = SRGBColorSpace;
    this.#gl.shadowMap.enabled = true;
  }

  // SCENE INITIALIZATION
  #initScene() {
    this.#scene = new Scene();
    this.#scene.background = new Color(CONFIG[this.#theme].background);
    this.#scene.add(this.#modelGroup);
  }

  // CAMERA INITIALIZATION
  #initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 1, 70);
    this.#camera.position.set(7, 4, 10);
    this.#camera.lookAt(0, 1, 0);
  }

  // STATS INITIALIZATION
  #initStats() {
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);
  }

  // CONTROLS INITIALIZATION
  #initControls() {
    this.#controls = new OrbitControls(this.#camera, this.#gl.domElement);
    this.#controls.enableDamping = true;
  }

  // EVENT INITIALIZATION
  #initEvents() {
    window.addEventListener('resize', this.#resize.bind(this));

    const themeBtn = document.getElementById('toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.#toggleTheme();
        themeBtn.textContent = this.#theme === 'dark' ? '🌙' : '☀️';
      });
    }
  }

  // LIGHTS INITIALIZATION
  #initLights() {
    const config = CONFIG[this.#theme];

    this.#ambient = new AmbientLight(0xffffff, config.ambient);
    this.#scene.add(this.#ambient);

    this.#directional = new DirectionalLight(config.dirColor, config.dirIntensity);
    this.#directional.position.set(9, 7, 5);
    this.#directional.castShadow = true;

    this.#scene.add(this.#directional);
  }

  // GROUND INITIALIZATION - JUST A PLANE WITH STANDARD MESH MATERIAL
  #initGround() {
    const geometry = new PlaneGeometry(20, 20);
    const material = new MeshStandardMaterial({
      color: '#fff0f5',
      metalness: 0.2,
      roughness: 0.4,
    });

    const ground = new Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.#scene.add(ground);
  }

  // MODEL INITIALIZATION - LOAD THE LAMP GLTF MODEL
  #initModel() {
    const glb = resources.get('lamp');
    const model = glb.scene;
    model.scale.setScalar(0.3);
    model.position.y = 0.1;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
        child.material.envMapIntensity = 1;
      }
    });

    this.#modelGroup.add(model);
  }

  // THEME TOGGLE FUNCTIONALITY
  #toggleTheme() {
    const next = this.#theme === 'light' ? 'dark' : 'light';
    const config = CONFIG[next];

    // ANIMATE THE THEME TRANSITION
    gsap.to(this.#scene.background, new Color(config.background));
    gsap.to(this.#ambient, { intensity: config.ambient });
    gsap.to(this.#directional, {
      intensity: config.dirIntensity,
      onUpdate: () => {
        this.#directional.color.set(config.dirColor);
      },
    });

    this.#theme = next;
  }

  // RESIZE HANDLER
  #resize() {
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
  }

  // ANIMATION LOOP
  #animate = () => {
    this.#stats.begin();
    this.#controls.update();
    this.#modelGroup.rotation.y += 0.02;
    this.#gl.render(this.#scene, this.#camera);
    this.#stats.end();
    requestAnimationFrame(this.#animate);
  };
}
