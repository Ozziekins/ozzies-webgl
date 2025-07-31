import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Clock,
} from 'three';
import Stats      from 'stats.js';
import UI         from './slider/index.js';
import PlanesManager from './planes/index.js';

export default class App {
  #gl;
  #camera;
  #scene;
  #clock;
  #stats;
  #ui;
  #planes;

  constructor() {
    this.#clock = new Clock();
    this.#init();
  }

  async #init() {
    // RENDERER
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true,
    });
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#gl.setClearColor(0x000000, 1);

    // CAMERA
    this.#initCamera();

    // STATS
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);

    // SCENE
    this.#scene = new Scene();

    // CONTENT
    this.#initContent();

    // EVENTS + START LOOP
    this.#load();
  }

  #initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 0.1, 2000);
    this.#camera.position.set(0, 0, 300);
    this.#camera.lookAt(0, 0, 0);
  }

  #initContent() {
    // PLANES
    this.#planes = new PlanesManager(this.#camera);
    this.#scene.add(this.#planes);

    // SLIDER UI - my interpreation of "unique slider"
    const maxOffset = this.#planes['#COUNT'] * this.#planes['#SPACING'];
    this.#ui = new UI(maxOffset, v => this.#planes.setOffset(v));
  }

  async #load() {
    this.#initEvents();
    this.#resize();
    this.#animate();
  }

  #initEvents() {
    window.addEventListener('resize', this.#resize.bind(this));
    window.addEventListener('wheel', e => this.#planes.onWheel(e.deltaY));
  }

  #resize() {
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    this.#gl.setSize(window.innerWidth, window.innerHeight);

    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
  }

  #animate() {
    this.#stats.begin();
    const delta = this.#clock.getDelta();

    this.#planes.update(delta);
    this.#gl.render(this.#scene, this.#camera);

    this.#stats.end();
    window.requestAnimationFrame(this.#animate.bind(this));
  }
}
