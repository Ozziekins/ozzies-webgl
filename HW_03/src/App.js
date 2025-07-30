// src/App.js

import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Clock,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  DoubleSide,
} from 'three';
import { damp } from 'maath/easing';
import { gsap } from 'gsap';
import Stats from 'stats.js';

export default class App {
  #gl;
  #camera;
  #scene;
  #clock;
  #stats;
  #planesGroup;
  #meshes;
  #helpers;
  #slider;
  #minZ;
  #maxZ;

  #COUNT = 10;          // NUMBER OF PLANES
  #SPACING = 120;       // GAP BETWEEN PLANES
  #DAMPING = 0.03;      // DAMPING FACTOR FOR SMOOTH MOTION

  constructor() {
    this.#clock = new Clock();
    this.#init();
  }

  async #init() {
    // SET UP RENDERER
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true
    });
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.4)); // DPR
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#gl.setClearColor(0x000000, 1); // BACKGROUND

    // SET UP CAMERA
    this.#initCamera();

    // SET UP STATS
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);

    // SET UP SCENE
    this.#scene = new Scene();

    // SET UP SLIDER UI
    this.#initUI();

    this.#load();
  }

  #initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 0.1, 2000);
    this.#camera.position.set(0, 0, 300);
    this.#camera.lookAt(0, 0, 0);
  }

  #initUI() {
    // CREATE RANGE SLIDER
    this.#slider = document.createElement('input');
    this.#slider.type = 'range';
    this.#slider.min = '0';
    this.#slider.max = String(this.#COUNT * this.#SPACING);
    this.#slider.step = '1';
    this.#slider.value = '0';

    Object.assign(this.#slider.style, {
      position: 'absolute',
      left: '50%',
      bottom: '20px',
      transform: 'translateX(-50%)',
      width: '80%',
      zIndex: '10',
    });
    document.body.appendChild(this.#slider);
  }

  async #load() {
    // PLANES
    this.#initPlanes();
    // EVENT LISTENERS
    this.#initEvents();
    // RESIZE
    this.#resize();
    // START LOOP
    this.#animate();
  }

  #initPlanes() {
    // GROUP FOR PLANES
    this.#planesGroup = new Group();
    this.#scene.add(this.#planesGroup);

    this.#meshes = [];
    this.#helpers = [];

    const PLANE_GEO = new PlaneGeometry(80, 80);

    // COLOR PLANES
    for (let i = 0; i < this.#COUNT; i++) {
      const hue = (i / this.#COUNT) * 360;
      const mat = new MeshBasicMaterial({
        color: `hsl(${hue}, 80%, 50%)`,
        side: DoubleSide,
      });

      const mesh = new Mesh(PLANE_GEO, mat);

      // INITIAL Z POSITION
      mesh.position.set(0, 0, i * this.#SPACING);

      this.#planesGroup.add(mesh);
      this.#meshes.push(mesh);
      this.#helpers.push({ z: mesh.position.z });
    }

    // WRAP BOUNDS
    this.#minZ = 0;
    this.#maxZ = this.#COUNT * this.#SPACING;
  }

  #initEvents() {
    // WINDOW RESIZE
    window.addEventListener('resize', this.#resize.bind(this));
    // SLIDER INPUT
    this.#slider.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      this.#helpers.forEach((h, i) => {
        h.z = i * this.#SPACING + v;
      });
    });
    // MOUSE WHEEL SCROLL
    window.addEventListener('wheel', (e) => {
      this.#helpers.forEach((h) => {
        h.z += e.deltaY;
      });
    });
  }

  #resize() {
    // UPDATE DPR 
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    // UPDATE CAMERA
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
  }

  #animate() {
    this.#stats.begin();

    const delta = this.#clock.getDelta();

    // UPDATE EACH PLANE’S Z WITH WRAP + DAMP
    this.#helpers.forEach((h, i) => {
      h.z = gsap.utils.wrap(this.#minZ, this.#maxZ, h.z);

      const mesh = this.#meshes[i];
      // TELEPORT IF LARGE JUMP
      if (Math.abs(mesh.position.z - h.z) > this.#SPACING / 2) {
        mesh.position.z = h.z;
      }
      // DAMP TOWARD TARGET
      damp(mesh.position, 'z', h.z, this.#DAMPING, delta);
    });

    // RENDER SCENE
    this.#gl.render(this.#scene, this.#camera);

    this.#stats.end();
    window.requestAnimationFrame(this.#animate.bind(this));
  }
}
