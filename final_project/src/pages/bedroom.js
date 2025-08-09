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
import { createBedroomGUI } from '../gui/index.js';
import bedroomVertexShader from '../shaders/bedroom.vert.js';
import bedroomFragmentShader from '../shaders/bedroom.frag.js';
import bedroomGradientVertexShader from '../shaders/bedroomGradient.vert.js';
import bedroomGradientFragmentShader from '../shaders/bedroomGradient.frag.js';

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

export default class Bedroom extends Group {
  constructor(scene, camera, renderer) {  
    super();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = null;
    this.mousePos = new THREE.Vector2(0.5, 0.5);
    this.composer = null;
    this.composerInitialized = false;
    this.plantObjects = [];
    
    // GUI parameters
    this.guiParams = {
      plantAnimation: {
        speed: 0.6,
        amplitude: 0.35,
        rotationSpeed: 0.5,
        rotationAmplitude: 0.01
      },
      bloom: {
        intensity: 0.5,
        radius: 0.4,
        threshold: 0.85
      },
      lighting: {
        ambientIntensity: 1.5,
        directionalIntensity: 2.0
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

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(8, 10, 8);
    directionalLight.castShadow = true;
    
    // Optimized shadow settings
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.bias = -0.0001;
    
    this.scene.add(directionalLight);

    this.createMagicalBackground();
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
      
      gltf.scene.position.set(-2, -3.5, -2.5);
      gltf.scene.scale.set(0.000002, 0.000002, 0.000002);
      gltf.scene.rotation.y = Math.PI / 2;
      
      // Calculate frame size for portal
      const box = new THREE.Box3().setFromObject(gltf.scene);
      this.frameSize = box.getSize(new THREE.Vector3());
      
      // DEBUGGING
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Frame object details logged
        }
      });
      
      this.scene.add(gltf.scene);
      
      this.createSpiralPlane();
      
    } catch (error) {
      console.error('Error loading frame:', error);
    }
  }

  createSpiralPlane() {
    const planeGeometry = new THREE.PlaneGeometry(2.05, 2.25);
    const spiralMaterial = new THREE.ShaderMaterial({
      uniforms: spiralShaderUniforms,
      vertexShader: bedroomVertexShader,
      fragmentShader: bedroomFragmentShader,
      transparent: true
    });

    this.spiralPlane = new THREE.Mesh(planeGeometry, spiralMaterial);
    this.spiralPlane.position.set(-3.475, -1.275, -4.05);
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
        window.location.hash = '#dungeon'; // Portal leads to dungeon
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
      const gltf = await loader.loadAsync('/src/assets/models/room.glb');
      
      // Room model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      gltf.scene.position.set(-center.x, -center.y, -center.z);
      gltf.scene.rotation.y = - Math.PI / 1.375;
      gltf.scene.position.x += 2;
      
      // Find plant objects for animation 
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          
          if (child.name === 'Object_30' || child.name === 'Object_6') {
            this.plantObjects.push(child);
            // Store initial position for animation
            child.userData.initialY = child.position.y;
            child.userData.initialRotation = child.rotation.z;
          }
        }
      });
      
      this.scene.add(gltf.scene);
      
    } catch (error) {
      console.error('Error loading room model:', error);
    }
  }

  createMagicalBackground() {
    this.createDaytimeSky();
    this.createClouds();
  }

  createDaytimeSky() {
    // Gradient sky background
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 2);
    gradient.addColorStop(0, '#FF6B9D');
    gradient.addColorStop(0.02, '#FF6B9D');
    gradient.addColorStop(0.05, '#FF8E8E');
    gradient.addColorStop(0.15, '#FFB3A7'); 
    gradient.addColorStop(0.3, '#FFD4B2');
    gradient.addColorStop(0.5, '#FFE5B4');
    gradient.addColorStop(0.8, '#FFF8DC');
    gradient.addColorStop(1, '#FFF8DC');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
  }

  createClouds() {
    // Particles
    const cloudCount = 50;
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);
    const cloudColors = new Float32Array(cloudCount * 3);
    const cloudSizes = new Float32Array(cloudCount);

    for (let i = 0; i < cloudCount; i++) {
      // Random positions
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5; 
      
      cloudPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      cloudPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      cloudPositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Cloud colors 
      const sunriseColors = [
        [1.0, 0.9, 0.9],
        [1.0, 0.8, 0.7],
        [1.0, 0.7, 0.6],
        [1.0, 0.9, 0.8],
        [1.0, 0.8, 0.8]
      ];
      const color = sunriseColors[Math.floor(Math.random() * sunriseColors.length)];
      cloudColors[i * 3] = color[0];
      cloudColors[i * 3 + 1] = color[1];
      cloudColors[i * 3 + 2] = color[2];
      
      cloudSizes[i] = Math.random() * 3 + 1;
    }

    cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeometry.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));
    cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));

    const cloudMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.cloudField = new THREE.Points(cloudGeometry, cloudMaterial);
    this.scene.add(this.cloudField);
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
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)'); 
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const floorTexture = new THREE.CanvasTexture(canvas);
    
    const floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      transparent: true
    });

    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2; 
    this.floor.position.y = -6;
    this.floor.receiveShadow = true; // Floor should receive shadows
    this.scene.add(this.floor);
  }

  createPostprocessing(renderer, scene, camera) {
    this.composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // Bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.05, 
      0.04, 
      0.085
    );
    this.composer.addPass(bloomPass);

    // Moving gradient effect
    const gradientPass = new ShaderPass({
      uniforms: gradientShaderUniforms,
      vertexShader: bedroomGradientVertexShader,
      fragmentShader: bedroomGradientFragmentShader
    });
    this.composer.addPass(gradientPass);

    // Mouse move 
    this.renderer.domElement.addEventListener('mousemove', (event) => {
      this.mousePos.x = event.clientX / window.innerWidth;
      this.mousePos.y = 1.0 - (event.clientY / window.innerHeight);
    });

    this.composerInitialized = true;
    return this.composer;
  }

  setComposer(composer) {
    this.composer = composer;
    this.composerInitialized = true;
  }

  setupGUI() {
    this.gui = createBedroomGUI(this.guiParams, this.scene);
  }

  update(time) {
    if (this.controls) {
      this.controls.update();
    }
    
    // Animate clouds
    if (this.cloudField) {
      this.cloudField.rotation.y = time * 0.05;
      
      const positions = this.cloudField.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time * 0.5 + i * 0.1) * 0.02;
        positions[i + 1] += Math.cos(time * 0.3 + i * 0.1) * 0.01;
      }
      this.cloudField.geometry.attributes.position.needsUpdate = true;
    }
    
        // Animate plant a little bit
    if (this.plantObjects) {
      this.plantObjects.forEach((plant, index) => {
        if (plant.userData.initialY !== undefined) {
          const swayOffset = Math.sin(time * this.guiParams.plantAnimation.speed + index * 0.5) * this.guiParams.plantAnimation.amplitude;
          const rotationOffset = Math.sin(time * this.guiParams.plantAnimation.rotationSpeed + index * 0.4) * this.guiParams.plantAnimation.rotationAmplitude;
          
          plant.position.y = plant.userData.initialY + swayOffset;
          plant.rotation.z = plant.userData.initialRotation + rotationOffset;
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
