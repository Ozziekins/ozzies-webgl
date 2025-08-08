import {
  Group,
  Color,
  Mesh,
  MeshStandardMaterial,
  DirectionalLight,
  AmbientLight,
  BoxGeometry,
  SphereGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export default class Landing extends Group {
  constructor(scene, camera, renderer) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
  }

  async init() {
    // Camera
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.autoRotate = false;

    // Create material
    const silverMaterial = new MeshStandardMaterial({ 
      color: 0xc0c0c0,
      metalness: 0.8,
      roughness: 0.2
    });

    // Create proper 3D letters
    const textGroup = new Group();
    
    // Letter H
    const hGroup = new Group();
    
    const hLeft = new Mesh(new BoxGeometry(0.2, 2, 0.3), silverMaterial);
    hLeft.position.set(-0.4, 0, 0);
    hGroup.add(hLeft);
    
    const hRight = new Mesh(new BoxGeometry(0.2, 2, 0.3), silverMaterial);
    hRight.position.set(0.4, 0, 0);
    hGroup.add(hRight);
    
    const hMiddle = new Mesh(new BoxGeometry(0.8, 0.2, 0.3), silverMaterial);
    hMiddle.position.set(0, 0, 0);
    hGroup.add(hMiddle);
    hGroup.position.set(-2, 0, 0);
    textGroup.add(hGroup);

    // Letter I
    const iGroup = new Group();
    
    const iVertical = new Mesh(new BoxGeometry(0.2, 2, 0.3), silverMaterial);
    iVertical.position.set(0, 0, 0);
    iGroup.add(iVertical);
    
    const iTop = new Mesh(new BoxGeometry(0.3, 0.2, 0.3), silverMaterial);
    iTop.position.set(0, 0.9, 0);
    iGroup.add(iTop);
    
    const iBottom = new Mesh(new BoxGeometry(0.3, 0.2, 0.3), silverMaterial);
    iBottom.position.set(0, -0.9, 0);
    iGroup.add(iBottom);
    iGroup.position.set(0, 0, 0);
    textGroup.add(iGroup);

    // Letter !
    const exclamationGroup = new Group();
    
    const exclamationVertical = new Mesh(new BoxGeometry(0.2, 1.4, 0.3), silverMaterial);
    exclamationVertical.position.set(0, 0.3, 0);
    exclamationGroup.add(exclamationVertical);
    
    const exclamationBottom = new Mesh(new SphereGeometry(0.15, 16, 16), silverMaterial);
    exclamationBottom.position.set(0, -0.9, 0);
    exclamationGroup.add(exclamationBottom);
    exclamationGroup.position.set(2, 0, 0);
    textGroup.add(exclamationGroup);
    
    textGroup.position.set(0, 0, 0);
    this.scene.add(textGroup);

    // Set pink background
    this.scene.background = new Color('#ffc0cb');

    // Add lighting
    const ambient = new AmbientLight(0xffffff, 0.6);
    const dir = new DirectionalLight(0xffffff, 1.0);
    dir.position.set(5, 10, 5);
    this.scene.add(ambient, dir);

    // Create explore button
    const button = document.createElement('button');
    button.textContent = 'Explore';
    Object.assign(button.style, {
      position: 'absolute',
      top: '70%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '24px',
      padding: '1em 2em',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      opacity: '1',
      transition: 'opacity 0.3s ease',
    });
    document.body.appendChild(button);

    // Add mouse tracking for parallax
    this.mouseMoveHandler = (event) => {
      this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    this.renderer.domElement.addEventListener('mousemove', this.mouseMoveHandler);

    // Animate on click
    button.addEventListener('click', () => {
      gsap.to(button, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => document.body.removeChild(button),
      });

      gsap.to(textGroup.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          window.location.hash = '#select';
        },
      });
    });

    this.dispose = () => {
      if (document.body.contains(button)) document.body.removeChild(button);
      if (this.controls) this.controls.dispose();
      if (this.mouseMoveHandler) {
        this.renderer.domElement.removeEventListener('mousemove', this.mouseMoveHandler);
      }
    };
  }

  update(time) {
    if (this.controls) {
      this.controls.update();
    }

    // Smooth mouse parallax camera movement
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    
    // Apply subtle camera movement based on mouse position
    const parallaxIntensity = 0.3;
    this.camera.position.x = this.camera.position.x + (this.mouseX * parallaxIntensity - this.camera.position.x) * 0.02;
    this.camera.position.y = this.camera.position.y + (this.mouseY * parallaxIntensity - this.camera.position.y) * 0.02;
    
    // Keep camera looking at center
    this.camera.lookAt(0, 0, 0);
  }
}
