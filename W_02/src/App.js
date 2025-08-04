import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Clock,
  Vector3,
  Color,
  Raycaster,
  Vector2,
} from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Plane from './plane/index.js';
import GUIManager from './gui/index.js';

export default class App {
  #gl;
  #scene;
  #camera;
  #clock;
  #stats;
  #planes;
  #gui;
  #raycaster;
  #mouse;

  constructor() {
    this.#clock = new Clock();
    this.#raycaster = new Raycaster();
    this.#mouse = new Vector2();
    this.#init();
  }

  async #init() {
    this.#gl = new WebGLRenderer({ canvas: document.querySelector('#canvas'), antialias: true });
    this.#gl.setSize(window.innerWidth, window.innerHeight);
    this.#gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 0.1, 100);
    this.#camera.position.z = 15;

    this.#scene = new Scene();
    this.#stats = new Stats();
    document.body.appendChild(this.#stats.dom);

    const controls = new OrbitControls(this.#camera, this.#gl.domElement);

    this.#initScene();
    this.#initEvents();
    this.#animate();
  }

  #initScene() {
    const radius = 8;
    const latitudeSegments = 12;
    const longitudeSegments = 24;
    this.#planes = [];

    this.#gui = new GUIManager();

    // CALCULATION FOR SPHERICAL PLANE DISTRIBUTION
    for (let lat = 0; lat <= latitudeSegments; lat++) {
      const phi = (lat / latitudeSegments) * Math.PI;
      
      for (let lon = 0; lon < longitudeSegments; lon++) {
        const theta = (lon / longitudeSegments) * 2 * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        const position = new Vector3(x, y, z);
        const plane = new Plane(this.#gui.uniforms, position);
        
        const lookAtVector = new Vector3(0, 0, 0);
        plane.mesh.lookAt(lookAtVector);
        
        this.#scene.add(plane.mesh);
        this.#planes.push(plane);
      }
    }
  }

  #initEvents() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.#gl.setSize(width, height);
      this.#camera.aspect = width / height;
      this.#camera.updateProjectionMatrix();
    });

    // MOUSE MOVE EVENT TO CHECK HOVER STATE
    window.addEventListener('mousemove', (event) => {
      this.#mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.#mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.#checkHover();
    });

    window.addEventListener('mouseleave', () => {
      this.#clearAllHover();
    });
  }

  #checkHover() {
    // RAY PICKING TO DETECT HOVER
    this.#raycaster.setFromCamera(this.#mouse, this.#camera);

    const intersects = this.#raycaster.intersectObjects(
      this.#planes.map(plane => plane.mesh)
    );

    this.#clearAllHover();

    // SET HOVER STATE
    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const plane = this.#planes.find(p => p.mesh === intersectedMesh);
      if (plane) {
        plane.setHoverState(true);
      }
    }
  }

  #clearAllHover() {
    for (const plane of this.#planes) {
      plane.setHoverState(false);
    }
  }

  #animate() {
    this.#stats.begin();

    const t = this.#clock.getElapsedTime();
    this.#gui.uniforms.uTime.value = t;

    for (const plane of this.#planes) {
      plane.update(t);
    }

    this.#gl.render(this.#scene, this.#camera);
    this.#stats.end();
    requestAnimationFrame(this.#animate.bind(this));
  }
}
