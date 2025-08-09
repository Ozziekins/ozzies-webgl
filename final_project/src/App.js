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
  #homeIcon;
  #composerAvailable = false;
  #composerUsed = false;
  #composerJustBecameAvailable = false;
  #viewChanged = false;

  constructor() {
    this.#scene = new THREE.Scene();
        this.#camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    
    const dpr = Math.min(window.devicePixelRatio, 1.6); 
    const useAntialiasing = dpr <= 1; 
    
    this.#renderer = new THREE.WebGLRenderer({ 
      antialias: useAntialiasing,
      powerPreference: "high-performance"
    });
    this.#renderer.setPixelRatio(dpr);
    
    this.#clock = new THREE.Clock();
    this.#view = null;
    this.#composer = null;
    this.#composerAvailable = false;
    this.#composerUsed = false;
    this.#composerJustBecameAvailable = false;
    this.#viewChanged = false;

    // Initialize Stats for FPS monitoring
    this.#stats = new Stats();
    // Override stats positioning to bottom-left
    this.#stats.dom.style.position = 'absolute';
    this.#stats.dom.style.top = 'auto';
    this.#stats.dom.style.bottom = '0px';
    this.#stats.dom.style.left = '0px';
    this.#stats.dom.style.right = 'auto';
    this.#stats.dom.style.zIndex = '999';
    document.body.appendChild(this.#stats.dom);

    // Create home icon
    this.#createHomeIcon();

    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Optimized shadow settings
    this.#renderer.shadowMap.enabled = true;
    this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    
    this.#composerAvailable = false;
    this.#composerUsed = false;
    this.#composerJustBecameAvailable = false;
    
    while (this.#scene.children.length) {
      const child = this.#scene.children[0];
      this.#scene.remove(child);
      
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
    
    // Optimized DPR handling on resize
    const dpr = Math.min(window.devicePixelRatio, 1.6);
    this.#renderer.setPixelRatio(dpr);
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (this.#composer) {
      this.#composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  #createHomeIcon() {
    this.#homeIcon = document.createElement('div');
    this.#homeIcon.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 22V12H15V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    this.#homeIcon.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    
    this.#homeIcon.addEventListener('mouseenter', () => {
      this.#homeIcon.style.background = 'rgba(0, 0, 0, 0.7)';
      this.#homeIcon.style.transform = 'scale(1.1)';
    });
    
    this.#homeIcon.addEventListener('mouseleave', () => {
      this.#homeIcon.style.background = 'rgba(0, 0, 0, 0.5)';
      this.#homeIcon.style.transform = 'scale(1)';
    });
    
    this.#homeIcon.addEventListener('click', () => {
      window.location.hash = '';
    });
    
    document.body.appendChild(this.#homeIcon);
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
