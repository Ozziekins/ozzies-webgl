import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { HoverEffects, ParticleSystem } from '../postprocessing/sceneSelectorEffects.js';

export default class SceneSelector {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = null;
    this.selectables = [];
    this.isInitialized = false;
    this.hoverEffects = new HoverEffects();
    this.particleSystem = new ParticleSystem();
  }

  async init() {
    this.isInitialized = true;
    this.selectables = [];

    const existingObjects = this.scene.children.filter(child => 
      child.name === 'bedroom' || child.name === 'dungeon'
    );
    existingObjects.forEach(obj => {
      this.scene.remove(obj);
    });

    // Camera
    this.camera.position.set(0, 1, 5);
    this.camera.lookAt(0, 3, 0);

    // Renderer
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Load HDRI
    const rgbeLoader = new RGBELoader();
    const texture = await rgbeLoader.loadAsync('/envmap.hdr');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = texture;
    this.scene.background = texture;

    // Add floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x404040,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);

    // Load GLTF models
    const gltfLoader = new GLTFLoader();
    let bedroomMesh = null;
    let daggerMesh = null;
    let bedDoorwayMesh = null;
    let daggerDoorwayMesh = null;

    // Load bedroom model
    try {
      const bedroom = await gltfLoader.loadAsync('/src/assets/models/bedroom.glb');
      bedroomMesh = bedroom.scene;
      bedroomMesh.position.set(-4, 0, 0);
      bedroomMesh.rotation.set(0, -Math.PI/2, 0);
      bedroomMesh.scale.set(0.00001, 0.00001, 0.00001);
      bedroomMesh.name = 'bedroom';
      bedroomMesh.userData = {
        originalY: bedroomMesh.position.y,
        originalScale: bedroomMesh.scale.clone(),
        originalColor: new THREE.Color(0x808080)
      };
      bedroomMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1;
            if (!child.material.color) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.5,
                metalness: 0.1
              });
            }
          }
        }
      });
      this.scene.add(bedroomMesh);
      this.selectables.push(bedroomMesh);
    } catch (error) {
      console.error('Error loading bedroom model:', error);
    }

    // Load dagger model
    try {
      const dagger = await gltfLoader.loadAsync('/src/assets/models/dagger.glb');
      daggerMesh = dagger.scene;
      daggerMesh.position.set(4, 1.5, 0);
      daggerMesh.rotation.set(0, -Math.PI/2, Math.PI/2);
      daggerMesh.scale.set(0.000001, 0.000001, 0.000001);
      daggerMesh.name = 'dungeon';
      daggerMesh.userData = {
        originalY: daggerMesh.position.y,
        originalScale: daggerMesh.scale.clone(),
        originalColor: new THREE.Color(0x808080)
      };
      daggerMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1;
            if (!child.material.color) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.5,
                metalness: 0.1
              });
            }
          }
        }
      });
      this.scene.add(daggerMesh);
      this.selectables.push(daggerMesh);
    } catch (error) {
      console.error('Error loading dagger model:', error);
    }

    // Load bed doorway model
    try {
      const bedDoorway = await gltfLoader.loadAsync('/src/assets/models/bed_doorway.glb');
      bedDoorwayMesh = bedDoorway.scene;
      bedDoorwayMesh.position.set(-1.1, -0.75, -0.5); // Closer to bed
      bedDoorwayMesh.rotation.set(0, 0, 0); // Stand upright
      bedDoorwayMesh.scale.set(3, 3, 3); // Much bigger scale
      bedDoorwayMesh.name = 'bedroom';
      bedDoorwayMesh.userData = {
        originalY: bedDoorwayMesh.position.y,
        originalScale: bedDoorwayMesh.scale.clone(),
        originalColor: new THREE.Color(0x808080)
      };
      bedDoorwayMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1;
            if (!child.material.color) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.5,
                metalness: 0.1
              });
            }
          }
        }
      });
      this.scene.add(bedDoorwayMesh);
      this.selectables.push(bedDoorwayMesh);
    } catch (error) {
      console.error('Error loading bed doorway model:', error);
    }

    // Load dagger doorway model
    try {
      const daggerDoorway = await gltfLoader.loadAsync('/src/assets/models/dagger_doorway.glb');
      daggerDoorwayMesh = daggerDoorway.scene;
      daggerDoorwayMesh.position.set(3, -1, -0.5); // Closer to dagger
      daggerDoorwayMesh.rotation.set(0, Math.PI/2, 0); // Stand upright
      daggerDoorwayMesh.scale.set(1.5, 1.5, 1.5); // Much bigger scale
      daggerDoorwayMesh.name = 'dungeon';
      daggerDoorwayMesh.userData = {
        originalY: daggerDoorwayMesh.position.y,
        originalScale: daggerDoorwayMesh.scale.clone(),
        originalColor: new THREE.Color(0x808080)
      };
      daggerDoorwayMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1;
            if (!child.material.color) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.5,
                metalness: 0.1
              });
            }
          }
        }
      });
      this.scene.add(daggerDoorwayMesh);
      this.selectables.push(daggerDoorwayMesh);
    } catch (error) {
      console.error('Error loading dagger doorway model:', error);
    }

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 8;
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minAzimuthAngle = -Math.PI / 3;
    this.controls.maxAzimuthAngle = Math.PI / 3;

    // Event listeners
    this.renderer.domElement.addEventListener('click', this._handleClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this._handleMouseMove.bind(this));

    // Create particles
    this.particleSystem.createParticles(this.scene);
  }

  update() {
    if (this.controls) {
      this.controls.update();
    }

    // Animate float
    this.selectables.forEach((object, index) => {
      if (object.userData.originalY !== undefined) {
        const time = Date.now() * 0.001;
        const offset = index * Math.PI / 2;
        object.position.y = object.userData.originalY + Math.sin(time + offset) * 0.2;
      }
    });

    this.particleSystem.update();
  }

  _handleClick(event) {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, this.camera);
    const intersects = raycaster.intersectObjects(this.selectables, true);

    if (intersects.length > 0) {
      let clickedObject = intersects[0].object;
      
      // DEBUGGING- to remove
      while (clickedObject.parent && !['bedroom', 'dungeon'].includes(clickedObject.name)) {
        clickedObject = clickedObject.parent;
      }

      // Only navigate if clicking the original models (not doorways)
      const isDoorway = clickedObject.position.z === -0.5;
      
      if (!isDoorway) {
        if (clickedObject.name === 'bedroom') {
          window.location.hash = 'bedroom';
        } else if (clickedObject.name === 'dungeon') {
          window.location.hash = 'dungeon';
        }
      }
    }
  }

  _handleMouseMove(event) {
    this.hoverEffects.handleMouseMove(event, this.camera, this.selectables);
  }

  dispose() {
    // Remove event listeners
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('click', this._handleClick.bind(this));
      this.renderer.domElement.removeEventListener('mousemove', this._handleMouseMove.bind(this));
    }

    // Dispose
    if (this.controls) {
      this.controls.dispose();
    }

    this.hoverEffects.dispose();
    this.particleSystem.dispose();

    // Clear
    this.selectables = [];
    this.isInitialized = false;
  }
}
