import * as THREE from 'three';
import Stats from 'stats.js';
import Landing from './pages/landing.js';
import SceneSelector from './pages/sceneSelector.js';
import Bedroom from './pages/bedroom.js';
import Dungeon from './pages/dungeon.js';
import getRoute from './router.js';

export default class App {
  #camera;
  #renderer;
  #scene;
  #clock;
  #composer;
  #view;
  #stats;
  #composerAvailable = false;
  #composerUsed = false;
  #composerJustBecameAvailable = false;
  #viewChanged = false;

  constructor() {
    this.#scene = new THREE.Scene();
    this.#camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.#renderer = new THREE.WebGLRenderer({ antialias: true });
    this.#clock = new THREE.Clock();
    this.#view = null;
    this.#composer = null;
    this.#composerAvailable = false;
    this.#composerUsed = false;
    this.#composerJustBecameAvailable = false;
    this.#viewChanged = false;

    // Initialize Stats for FPS monitoring
    this.#stats = new Stats();
    this.#stats.dom.style.position = 'absolute';
    this.#stats.dom.style.top = '0px';
    this.#stats.dom.style.left = '0px';
    document.body.appendChild(this.#stats.dom);

    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.#renderer.shadowMap.enabled = true;

    document.body.appendChild(this.#renderer.domElement);

    this.#initialize();

    window.addEventListener('resize', () => this.#resize());
    window.addEventListener('hashchange', () => {
      this.#load();
    });
  }

  async #initialize() {
    await this.#load();
    this.#animate();
  }

  async #load() {
    if (this.#view?.dispose) {
      this.#view.dispose();
    }
    
    // Reset composer flags
    this.#composerAvailable = false;
    this.#composerUsed = false;
    this.#composerJustBecameAvailable = false;
    
    while (this.#scene.children.length) {
      const child = this.#scene.children[0];
      this.#scene.remove(child);
      
      // Dispose of geometries and materials
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    const route = getRoute();
    
    switch (route) {
      case 'Landing':
        this.#view = new Landing(this.#scene, this.#camera, this.#renderer);
        break;
      case 'SceneSelector':
        this.#view = new SceneSelector(this.#scene, this.#camera, this.#renderer);
        break;
      case 'Bedroom':
        this.#view = new Bedroom(this.#scene, this.#camera, this.#renderer);
        break;
      case 'Dungeon':
        this.#view = new Dungeon(this.#scene, this.#camera, this.#renderer);
        break;
      default:
        this.#view = new Landing(this.#scene, this.#camera, this.#renderer);
    }

    if (this.#view.init) {
      await this.#view.init();
    }
    
    if (this.#view.createPostprocessing) {
      this.#composer = this.#view.createPostprocessing(this.#renderer, this.#scene, this.#camera);
      if (this.#view.setComposer) {
        this.#view.setComposer(this.#composer);
      }
      this.#composerAvailable = true;
      this.#composerJustBecameAvailable = true;
      this.#viewChanged = true;
    } else {
      this.#composer = null;
      this.#composerAvailable = false;
      this.#viewChanged = true;
    }
  }

  #resize() {
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    if (this.#composer) {
      this.#composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  #animate() {
    requestAnimationFrame(() => this.#animate());

    // Update Stats
    this.#stats.begin();

    const elapsed = this.#clock.getElapsedTime();
    this.#view?.update?.(elapsed);

    if (this.#viewChanged) {
      this.#viewChanged = false;
      this.#composerJustBecameAvailable = false;
    }

    if (this.#composer && this.#composerAvailable) {
      this.#composer.render();
    } else {
      this.#renderer.render(this.#scene, this.#camera);
    }

    // End Stats
    this.#stats.end();
  }
}
