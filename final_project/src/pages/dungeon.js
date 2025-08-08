import * as THREE from 'three';
import {
  Group, DirectionalLight, Mesh, PlaneGeometry, ShaderMaterial, Color
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createDungeonGUI } from '../gui/index.js';
import dungeonVertexShader from '../shaders/dungeon.vert.js';
import dungeonFragmentShader from '../shaders/dungeon.frag.js';
import dungeonGradientVertexShader from '../shaders/dungeonGradient.vert.js';
import dungeonGradientFragmentShader from '../shaders/dungeonGradient.frag.js';

// Spiral shader uniforms
const spiralShaderUniforms = {
  'time': { value: 0.0 },
  'mouseHover': { value: 0.0 }
};

// Gradient shader uniforms
const gradientShaderUniforms = {
  'tDiffuse': { value: null },
  'mousePos': { value: new THREE.Vector2(0.5, 0.5) },
  'time': { value: 0.0 }
};

export default class Dungeon extends Group {
  constructor(scene, camera, renderer) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = null;
    this.mousePos = new THREE.Vector2(0.5, 0.5);
    this.composer = null;
    this.composerInitialized = false;
    
    // GUI parameters
    this.guiParams = {
      batAnimation: {
        speed: 0.5,
        amplitude: 0.7
      },
      waterAnimation: {
        flowSpeed: 0.001
      },
      bloom: {
        intensity: 0.3,
        radius: 0.3,
        threshold: 0.9
      },
      lighting: {
        ambientIntensity: 0.3,
        directionalIntensity: 2.2
      }
    };
  }

  async init() {
    // Camera
    this.camera.position.set(0, 1.5, 3.5); 
    this.camera.lookAt(0, 3.5, 0);
    
    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 15;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minAzimuthAngle = -Math.PI / 2;
    this.controls.maxAzimuthAngle = Math.PI / 2;

    const ambientLight = new THREE.AmbientLight(0x202020, 0.3);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
    directionalLight.position.set(8, 10, 8);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    this.createEveningBackground();
    this.createFloor();

    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    await this.loadModel();
    
    await this.loadFrame();
    
    this.setupGUI();
  }

  async loadFrame() {
    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync('/src/assets/models/frame.glb');
      
      gltf.scene.position.set(-5, -32, -5);
      gltf.scene.scale.set(0.000025, 0.000025, 0.000025);
      gltf.scene.rotation.y = Math.PI / 2;
      
      // Calculate frame size for portal
      const box = new THREE.Box3().setFromObject(gltf.scene);
      this.frameSize = box.getSize(new THREE.Vector3());
      
      // DEBUGGING
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Frame object details
        }
      });
      
      this.scene.add(gltf.scene);
      
      this.createSpiralPlane();
      
    } catch (error) {
      console.error('Error loading frame:', error);
    }
  }

  createSpiralPlane() {
    const planeGeometry = new THREE.PlaneGeometry(30, 35);
    const spiralMaterial = new THREE.ShaderMaterial({
      uniforms: spiralShaderUniforms,
      vertexShader: dungeonVertexShader,
      fragmentShader: dungeonFragmentShader,
      transparent: true
    });

    this.spiralPlane = new THREE.Mesh(planeGeometry, spiralMaterial);
    this.spiralPlane.position.set(-25.475, -5.775, -25.05);
    this.spiralPlane.rotation.y = Math.PI / 4;
    
    this.scene.add(this.spiralPlane);
    
    this.addClickListener();
    
    this.addHoverListener();
  }

  addClickListener() {
    this.clickHandler = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObject(this.spiralPlane);
      if (intersects.length > 0) {
        window.location.hash = '#bedroom';
      }
    };

    this.renderer.domElement.addEventListener('click', this.clickHandler);
  }

  addHoverListener() {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    const handleMouseMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(pointer, this.camera);
      const intersects = raycaster.intersectObject(this.spiralPlane);
      
      if (intersects.length > 0) {
        // Hover effect - increase aberration
        if (this.spiralPlane.material.uniforms.mouseHover) {
          this.spiralPlane.material.uniforms.mouseHover.value = 1.0;
        }
      } else {
        // No hover - reset aberration
        if (this.spiralPlane.material.uniforms.mouseHover) {
          this.spiralPlane.material.uniforms.mouseHover.value = 0.0;
        }
      }
    };
    
    this.renderer.domElement.addEventListener('mousemove', handleMouseMove);
    this.hoverHandler = handleMouseMove;
  }

  async loadModel() {
    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync('/src/assets/models/dungeon.glb');
      
      // Dungeon model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      gltf.scene.position.set(-center.x, -center.y, -center.z);
      gltf.scene.rotation.y = -Math.PI / 25;
      gltf.scene.scale.set(10.5, 10.5, 10.5);
      gltf.scene.position.x += 14;
      gltf.scene.position.y -= 4;
      
      // References to bats and water for animation
      this.bats = [];
      this.waterObjects = [];
      
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name.includes('Bat_1') || child.name.includes('Bat_1001')) {
            this.bats.push(child);
            // Store initial position for animation
            child.userData.initialY = child.position.y;
          }
          
          // Find water objects - NOT WORKING
          if (child.name.toLowerCase().includes('water') ||
              child.material && child.material.name.toLowerCase().includes('water')) {
            this.waterObjects.push(child);
            // Store original material for glow effect
            child.userData.originalMaterial = child.material.clone();
          }
        }
      });
      
      this.scene.add(gltf.scene);
      
    } catch (error) {
      console.error('Error loading dungeon model:', error);
    }
  }

  createEveningBackground() {
    this.createEveningSky();
    this.createStars();
  }

  createEveningSky() {
    // Gradient sky background
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 2);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.02, '#0d1b2a');
    gradient.addColorStop(0.05, '#1a1a3a');
    gradient.addColorStop(0.15, '#2a1a4a');
    gradient.addColorStop(0.3, '#3a1a5a');
    gradient.addColorStop(0.5, '#4a1a6a');
    gradient.addColorStop(0.8, '#5a1a7a');
    gradient.addColorStop(1, '#6a1a8a');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
  }

  createStars() {
    // Particles
    const starCount = 100;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Random positions 
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Star colors 
      const eveningColors = [
        [1.0, 1.0, 0.8],
        [0.8, 0.8, 1.0],
        [1.0, 0.8, 0.6],
        [0.9, 0.7, 0.9],
        [1.0, 0.9, 0.7]
      ];
      const color = eveningColors[Math.floor(Math.random() * eveningColors.length)];
      starColors[i * 3] = color[0];
      starColors[i * 3 + 1] = color[1];
      starColors[i * 3 + 2] = color[2];
      
      starSizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.starField = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.starField);
  }

  createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    
    // Create gradient opacity
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create radial gradient for opacity
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(100, 100, 150, 0.6)');
    gradient.addColorStop(0.3, 'rgba(80, 80, 120, 0.3)');
    gradient.addColorStop(0.7, 'rgba(60, 60, 100, 0.1)');
    gradient.addColorStop(1, 'rgba(40, 40, 80, 0.0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const floorTexture = new THREE.CanvasTexture(canvas);
    
    const floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -21;
    this.scene.add(this.floor);
  }

  createPostprocessing(renderer, scene, camera) {
    this.composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // Bloom effect for mystical atmosphere
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.03,  // intensity (lower for dungeon)
      0.03,  // radius
      0.09   // threshold (higher for darker scene)
    );
    this.composer.addPass(bloomPass);

    // Moving gradient effect
    const gradientPass = new ShaderPass({
      uniforms: gradientShaderUniforms,
      vertexShader: dungeonGradientVertexShader,
      fragmentShader: dungeonGradientFragmentShader
    });
    this.composer.addPass(gradientPass);

    // Mmouse move
    this.renderer.domElement.addEventListener('mousemove', (event) => {
      this.mousePos.x = event.clientX / window.innerWidth;
      this.mousePos.y = 1.0 - (event.clientY / window.innerHeight);
      
      // Store mouse position for water glow effect - NOT WORKING
      this.renderer.domElement._mousePos = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    });

    this.composerInitialized = true;
    return this.composer;
  }

  setComposer(composer) {
    this.composer = composer;
    this.composerInitialized = true;
  }

  setupGUI() {
    this.gui = createDungeonGUI(this.guiParams, this.scene);
  }

  update(time) {
    if (this.controls) {
      this.controls.update();
    }
    
    // Animate stars
    if (this.starField) {
      this.starField.rotation.y = time * 0.02;
      
      const positions = this.starField.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time * 0.3 + i * 0.1) * 0.01;
        positions[i + 1] += Math.cos(time * 0.2 + i * 0.1) * 0.005;
      }
      this.starField.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate bats floating up and down
    if (this.bats) {
      this.bats.forEach((bat, index) => {
        if (bat.userData.initialY !== undefined) {
          const floatOffset = Math.sin(time * this.guiParams.batAnimation.speed + index * 0.5) * this.guiParams.batAnimation.amplitude;
          bat.position.y = bat.userData.initialY + floatOffset;
        }
      });
    }
    
    // Simple water flow using texture offset
    if (this.waterObjects) {
      this.waterObjects.forEach((water) => {
        if (water.material && water.material.map) {
          water.material.map.offset.x += this.guiParams.waterAnimation.flowSpeed;
        }
      });
    }
    
    // Animate spiral shader
    if (this.spiralPlane && this.spiralPlane.material.uniforms) {
      this.spiralPlane.material.uniforms.time.value = time;
    }
    
    // DEBGGING - CHECKING COMPOSER HALP!
    if (this.composer && this.composer.passes && this.composerInitialized) {
      this.composer.passes.forEach(pass => {
        if (pass.material && pass.material.uniforms) {
          if (pass.material.uniforms.mousePos) {
            pass.material.uniforms.mousePos.value = this.mousePos;
          }
          if (pass.material.uniforms.time) {
            pass.material.uniforms.time.value = time;
          }
        }
      });
    }
  }

  dispose() {
    if (this.controls) {
      this.controls.dispose();
    }
    
    if (this.clickHandler) {
      this.renderer.domElement.removeEventListener('click', this.clickHandler);
    }
    
    if (this.hoverHandler) {
      this.renderer.domElement.removeEventListener('mousemove', this.hoverHandler);
    }
    
    if (this.gui) {
      this.gui.destroy();
    }
  }
}
