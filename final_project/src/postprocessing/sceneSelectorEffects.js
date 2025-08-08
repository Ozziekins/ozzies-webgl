import * as THREE from 'three';

export class HoverEffects {
  constructor() {
    this.hoveredObject = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }

  handleMouseMove(event, camera, selectables) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, camera);
    const intersects = this.raycaster.intersectObjects(selectables, true);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      let rootObject = hoveredObject;
      while (rootObject.parent && !['bedroom', 'dungeon'].includes(rootObject.name)) {
        rootObject = rootObject.parent;
      }

      // Only apply hover effect if we're hovering a new object
      if (rootObject !== this.hoveredObject) {
        if (this.hoveredObject) {
          this.resetObjectStyle(this.hoveredObject);
        }
        
        // Set new hovered object and apply effect only once
        this.hoveredObject = rootObject;
        this.applyHoverStyle(rootObject);
      }
    } else {
      if (this.hoveredObject) {
        this.resetObjectStyle(this.hoveredObject);
        this.hoveredObject = null;
      }
    }
  }

  applyHoverStyle(object) {
    // Check if this is a doorway 
    const isDoorway = object.name === 'bedroom' && object.position.z === -0.5 || 
                     object.name === 'dungeon' && object.position.z === -0.5;
    
    if (isDoorway) {
      // Doorways get scale effect
      if (!object.userData.isScaled) {
        object.scale.multiplyScalar(1.2);
        object.userData.isScaled = true;
        
        // Reset scale after 3 seconds
        setTimeout(() => {
          if (this.hoveredObject === object) {
            this.resetObjectStyle(object);
            this.hoveredObject = null;
          }
        }, 3000);
      }
    } else {
      // Glow effect for models
      if (!object.userData.isGlowing) {
        object.userData.isGlowing = true;
        object.traverse((child) => {
          if (child.isMesh && child.material) {
            if (!child.userData.originalEmissive) {
              child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0, 0, 0);
            }
            child.material.emissive = new THREE.Color(0.3, 0.3, 0.5);
            child.material.emissiveIntensity = 0.5;
          }
        });
        
        // Reset glow after 3 seconds
        setTimeout(() => {
          if (this.hoveredObject === object) {
            this.resetObjectStyle(object);
            this.hoveredObject = null;
          }
        }, 3000);
      }
    }
  }

  resetObjectStyle(object) {
    // Check if this is a doorway or original model
    const isDoorway = object.name === 'bedroom' && object.position.z === -0.5 || 
                     object.name === 'dungeon' && object.position.z === -0.5;
    
    if (isDoorway) {
      // Reset scale for doorways
      if (object.userData.originalScale) {
        object.scale.copy(object.userData.originalScale);
        object.userData.isScaled = false;
      }
    } else {
      // Reset glow for original models
      if (object.userData.isGlowing) {
        object.traverse((child) => {
          if (child.isMesh && child.material) {
            if (child.userData.originalEmissive) {
              child.material.emissive.copy(child.userData.originalEmissive);
              child.material.emissiveIntensity = 1;
            }
          }
        });
        object.userData.isGlowing = false;
      }
    }
  }

  dispose() {
    if (this.hoveredObject) {
      this.resetObjectStyle(this.hoveredObject);
    }
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createParticles(scene) {
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = Math.random() * 10;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      colors[i] = 0.8;
      colors[i + 1] = 0.8;
      colors[i + 2] = 1.0;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    this.particles.push(particleSystem);
  }

  update() {
    // Animate particles
    this.particles.forEach(particleSystem => {
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.01;
        if (positions[i] > 10) {
          positions[i] = 0;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    });
  }

  dispose() {
    this.particles.forEach(particleSystem => {
      if (particleSystem.geometry) {
        particleSystem.geometry.dispose();
      }
      if (particleSystem.material) {
        particleSystem.material.dispose();
      }
    });
    this.particles = [];
  }
} 