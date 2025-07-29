import {
  AxesHelper,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  AmbientLight,
  DirectionalLight,
  SpotLight,
  SpotLightHelper,
  Group,
  Clock,
  Vector2,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';
import gsap from 'gsap';

import resources from './resources/index.js';
import Postprocessing from './postprocessing/index.js';

const CONFIG = {
  light: {
    background: '#e0e7ef',
    ambient: 0.6,
    directional: {
      color: 0xffffff,
      intensity: 0.2,
    },
  },
  dark: {
    background: '#181a23',
    ambient: 0.2,
    directional: {
      color: 0xfff1c7,
      intensity: 0.6,
    },
  },
};

export default class App {
  #scene = new Scene();
  #camera;
  #renderer;
  #controls;
  #stats;
  #clock = new Clock();
  #foxGroup = new Group();
  #mouse = new Vector2();
  #composer;
  #ambient;
  #directional;
  #spotlight;
  #spotlightHelper;

  async init() {
    this.#setupRenderer();
    this.#setupCamera();
    this.#setupControls();
    this.#setupStats();

    await resources.load();

    this.#setupLights();
    this.#setupScene();

    this.#composer = new Postprocessing({
      gl: this.#renderer,
      scene: this.#scene,
      camera: this.#camera,
    });

    window.addEventListener('resize', () => this.#onResize());
    window.addEventListener('mousemove', (e) => this.#onMouseMove(e));

    this.#animate();
  }

  #setupRenderer() {
    this.#renderer = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true,
    });
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.#renderer.shadowMap.enabled = true;
  }

  #setupCamera() {
    this.#camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 690);
    this.#camera.position.set(0, 50, 200);
    this.#camera.lookAt(0, 10, 0);
    this.#scene.add(this.#camera);
  }

  #setupControls() {
    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);
    this.#controls.enableDamping = true;
    // this.#controls.maxDistance = 50;
    // this.#controls.minDistance = 3;
  }

  #setupStats() {
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);
  }

  #setupLights() {
    this.#ambient = new AmbientLight(0xffffff, 0.6);
    this.#scene.add(this.#ambient);

    this.#directional = new DirectionalLight(0xffffff, 1.5);
    this.#directional.position.set(6, 10, 5);
    this.#directional.castShadow = true;
    this.#directional.shadow.mapSize.set(1024, 1024);
    this.#scene.add(this.#directional);

    this.#spotlight = new SpotLight(0xccccff, 550, 150, Math.PI / 8, 0.5, 1);
    this.#spotlightHelper = new SpotLightHelper(this.#spotlight);
    this.#scene.add(this.#spotlightHelper);
    this.#spotlight.castShadow = true;
    this.#spotlight.position.set(20, 120, -2); 
    // this.#spotlight.shadow.bias = -0.0005;
    this.#scene.add(this.#spotlight);
    this.#scene.add(this.#spotlight.target);

    this.#applyTheme('dark');
  }

  #applyTheme(theme) {
    const cfg = CONFIG[theme];

    const env = resources.get(theme === 'dark' ? 'envmapDark' : 'envmapLight');

    if (env) {
      this.#scene.environment = env;
      this.#scene.background = env;

      this.#scene.traverse(obj => {
        if (obj.isMesh && obj.material?.envMapIntensity !== undefined) {
          obj.material.envMapIntensity = 1.5;
        }
      });
    }

    this.#ambient.intensity = cfg.ambient;
    this.#directional.color.set(cfg.directional.color);
    this.#directional.intensity = cfg.directional.intensity;
  }

  #setupScene() {
    const axesHelper = new AxesHelper(500); 
    this.#scene.add(axesHelper);


    const forest = resources.get('forest')?.scene;
    if (forest) {
      forest.scale.setScalar(0.5);
      forest.position.set(0, 0, 0);
      forest.traverse(obj => obj.castShadow = obj.receiveShadow = true);
      this.#scene.add(forest);
    }

    const chalet = resources.get('chalet')?.scene;
    if (chalet) {
      chalet.position.set(2, 2, -2);
      chalet.traverse(obj => {
        obj.castShadow = obj.receiveShadow = true;
      });
      this.#scene.add(chalet);
    }

    const fox = resources.get('fox')?.scene;
    if (fox) {
      fox.scale.setScalar(4);
      fox.position.set(12, 10, -2);
      fox.traverse(obj => obj.castShadow = obj.receiveShadow = true);
      this.#foxGroup.add(fox);
      this.#scene.add(this.#foxGroup);
    }

    // // Envmap
    // const env = resources.get('envmap');
    // if (env) {
    //   this.#scene.environment = env;
    //   this.#scene.background = env;
    //   this.#scene.traverse(obj => {
    //     if (obj.isMesh && obj.material?.envMapIntensity !== undefined) {
    //       obj.material.envMapIntensity = 1.5;
    //     }
    //   });
    // }
  }

  #animate = () => {
    this.#stats.begin();

    const elapsed = this.#clock.getElapsedTime();
    this.#controls.update();

    this.#foxGroup.position.z = Math.sin(elapsed) * 15;
    this.#foxGroup.position.y = Math.sin(elapsed * 2) * 0.2 + 1;

    this.#spotlight.position.set(
      this.#foxGroup.position.x + 30,
      this.#foxGroup.position.y + 60,
      this.#foxGroup.position.z - 15,
    );
    this.#spotlight.target.position.copy(this.#foxGroup.position);
    this.#spotlightHelper.update();

    this.#composer.render();
    this.#stats.end();
    requestAnimationFrame(this.#animate);
  };

  #onResize() {
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
    this.#composer.resize(window.innerWidth, window.innerHeight);
  }

  #onMouseMove(e) {
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    const offsetX = this.#mouse.x * 10;
    const offsetY = this.#mouse.y * 5;
    this.#directional.position.set(6 + offsetX, 10 + offsetY, 5);
  }

  setTheme(theme) {
    this.#applyTheme(theme);
  }
}
