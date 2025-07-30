import {
  AxesHelper,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  CameraHelper,
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap,
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
      intensity: 1,
    },
  },
  dark: {
    background: '#181a23',
    ambient: 0.2,
    directional: {
      color: 0xfff1c7,
      intensity: 1,
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
  #worldGroup = new Group();
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
    this.#renderer.shadowMap.type = PCFSoftShadowMap;
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

    this.#directional = new DirectionalLight(0xffffff, 1);
    this.#directional.position.set(0, 50, 0);
    this.#directional.target.position.set(0, 0, 0); 
    this.#directional.castShadow = true;
    this.#directional.shadow.mapSize.set(512, 512);
    this.#directional.shadow.camera.near = 1;
    this.#directional.shadow.camera.far = 50;
    this.#directional.shadow.camera.left = -50;
    this.#directional.shadow.camera.right = 50;
    this.#directional.shadow.camera.top = 100;
    this.#directional.shadow.camera.bottom = -10;
    this.#scene.add(this.#directional);

    const dirShadowHelper = new CameraHelper(this.#directional.shadow.camera);
    this.#scene.add(dirShadowHelper);

    this.#spotlight = new SpotLight(0xccccff, 550, 150, Math.PI / 8, 0.5, 1);
    this.#spotlightHelper = new SpotLightHelper(this.#spotlight);
    this.#scene.add(this.#spotlightHelper);
    this.#spotlight.castShadow = true;
    this.#spotlight.position.set(20, 120, -2); 
    this.#spotlight.shadow.mapSize.set(256, 256);
    this.#spotlight.shadow.bias = -0.0005;
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
      forest.traverse(obj => obj.receiveShadow = true);
      this.#worldGroup.add(forest);
      // this.#scene.add(forest);
    }

    const chalet = resources.get('chalet')?.scene;
    if (chalet) {
      chalet.position.set(2, 2, -2);
      this.#worldGroup.add(chalet);
      // this.#scene.add(chalet);
    }

    const fox = resources.get('fox')?.scene;
    if (fox) {
      fox.scale.setScalar(4);
      fox.position.set(12, 10, -2);
      fox.traverse(obj => obj.castShadow = true);
      this.#foxGroup.add(fox);
      this.#worldGroup.add(this.#foxGroup);
      // this.#scene.add(this.#foxGroup);
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
    
    this.#scene.add(this.#worldGroup);
  }

  #animate = () => {
    this.#stats.begin();

    const elapsed = this.#clock.getElapsedTime();
    this.#controls.update();

    this.#worldGroup.position.y = Math.sin(elapsed * 1.1) * 2.5;

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

    const distToCenter = Math.sqrt(this.#mouse.x ** 2 + this.#mouse.y ** 2);
    const darkness = 0.3 + Math.min(0.7, distToCenter * 1.2);

    gsap.to(this.#composer.vignette, {
      darkness,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  setTheme(theme) {
    this.#applyTheme(theme);
  }
}
