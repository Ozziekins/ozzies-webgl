import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Clock,
  Color,
  Vector2,
  Vector3,
} from 'three';
import Stats from 'stats.js';

import WavePlane from './plane/index.js';
import GUIManager from './gui/index.js';

export default class App {
  #gl; #camera; #scene; #clock; #stats; #plane; #gui; #uniforms;

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
    this.#gl.setSize(innerWidth, innerHeight);

    // CAMERA
    this.#camera = new PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100);
    this.#camera.position.set(0,0,5);

    // STATS
    this.#stats = new Stats(); document.body.appendChild(this.#stats.dom);

    // SCENE
    this.#scene = new Scene();

    this.#load();
  }

  #load() {
    this.#initUniforms();
    this.#initScene();
    this.#initGUI();
    this.#initEvents();
    this.#animate();
  }

  #initUniforms() {
    this.#uniforms = {
      uTime:   { value: 0 },
      uFreq:   { value: 5.0 },
      uAmp:    { value: 1.0 },
      uSpeed:  { value: 2.0 },
      uColor1: { value: new Color(0x3c5ec3) },
      uColor2: { value: new Color(0x712f83) },
      uMouse: { value: new Vector2(0, 0) },
      uTwist: { value: 2.0 },
    };
  }

  #initScene() {
    this.#plane = new WavePlane(this.#uniforms);
    this.#scene.add(this.#plane);

    this.#plane.material.needsUpdate = true;
  }

  #initGUI() {
    this.#gui = new GUIManager(this.#uniforms);
  }

  #initEvents() {
    window.addEventListener('resize', this.#resize.bind(this));
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth)  * 2 - 1;
      const y = -(e.clientY / window.innerHeight)* 2 + 1;
      this.#uniforms.uMouse.value.set(x, y);
});

  }

  #resize() {
    this.#gl.setSize(innerWidth, innerHeight);
    this.#camera.aspect = innerWidth / innerHeight;
    this.#camera.updateProjectionMatrix();
  }

  #animate() {
    this.#stats.begin();

    this.#uniforms.uTime.value = this.#clock.getElapsedTime();
    this.#gl.render(this.#scene, this.#camera);

    this.#stats.end();
    requestAnimationFrame(this.#animate.bind(this));
  }
}

new App();
