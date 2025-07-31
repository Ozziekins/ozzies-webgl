import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Clock,
  PlaneGeometry,
  BufferAttribute,
  Mesh,
  Color,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';

import GUIManager  from './gui/index.js';
import ShaderPlane from './plane/index.js';

// load raw GLSL
import vertexSrc   from './shaders/index.vert?raw';
import fragmentSrc from './shaders/index.frag?raw';

const V2 = new Vector2();
const V3 = new Vector3();
const COLOR = new Color();

export default class App {
  #gl;
  #camera;
  #scene;
  #clock;
  #stats;
  #plane;
  #raycaster;
  #mouse;
  #uniforms;
  #gui;

  constructor() {
    this.#clock = new Clock();
    this.#raycaster = new Raycaster();
    this.#mouse     = V2.clone();
    this.#init();
  }

  async #init() {
    // RENDERER
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true,
    });
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#gl.setClearColor(0x000000, 1);

    // CAMERA
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 0.1, 50);
    this.#camera.position.set(0, 0, 8);

    // STATS
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);

    // CONTROLS
    new OrbitControls(this.#camera, this.#gl.domElement);

    // SCENE
    this.#scene = new Scene();

    // LOAD
    this.#load();
  }

  async #load() {
    this.#initUniforms();
    this.#initScene();
    this.#initGUI();
    this.#initEvents();
    this.#animate();
  }

  #initUniforms() {
    this.#uniforms = {
      uTime:   { value: 0.0 },
      uMouse:  { value: V3.clone() },
      uColorA: { value: COLOR.clone().set(0x111111) },
      uColorB: { value: COLOR.clone().set(0x00ffff) },
    };
  }

  #initScene() {
    // build plane with noise attribute
    const geo = new PlaneGeometry(4, 4, 64, 64);
    const count = geo.attributes.position.count;
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) rand[i] = Math.random();
    geo.setAttribute('aRandom', new BufferAttribute(rand, 1));

    // mesh
    this.#plane = new ShaderPlane(this.#uniforms);
    this.#scene.add(this.#plane);
  }

  #initGUI() {
    this.#gui = new GUIManager(this.#uniforms);
  }

  #initEvents() {
    window.addEventListener('resize', this.#onResize.bind(this));
    window.addEventListener('mousemove', this.#onMouseMove.bind(this));
  }

  #onMouseMove(e) {
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  #onResize() {
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
  }

  #animate() {
    this.#stats.begin();

    const t = this.#clock.getElapsedTime();
    this.#plane.material.uniforms.uTime.value = t;

    // raycast to update uMouse in world space
    this.#raycaster.setFromCamera(this.#mouse, this.#camera);
    const hits = this.#raycaster.intersectObject(this.#plane);
    if (hits.length) {
      this.#plane.material.uniforms.uMouse.value.copy(hits[0].point);
    }

    this.#gl.render(this.#scene, this.#camera);
    this.#stats.end();

    requestAnimationFrame(this.#animate.bind(this));
  }
}
