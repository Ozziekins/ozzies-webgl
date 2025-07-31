import {
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  DoubleSide,
  MathUtils,
} from 'three';
import { damp } from 'maath/easing';
import { gsap } from 'gsap';

export default class PlanesManager extends Group {
  #meshes;
  #helpers;
  #minZ;
  #maxZ;

  // CONFIG
  #COUNT        = 10;
  #SPACING      = 60;
  #DAMPING      = 0.03;
  #SCROLL_SPEED = 0.2;

  constructor(camera) {
    super();
    this.camera = camera;
    this.#meshes  = [];
    this.#helpers = [];
    this.#init();
  }

  #init() {
    this.#initPlanes();
    this.#detectBounds();
  }

  #initPlanes() {
    const GEO = new PlaneGeometry(100, 100);

    const fovRad = MathUtils.degToRad(this.camera.fov);
    const halfH  = Math.tan(fovRad / 2) * this.camera.position.z;
    const halfW  = halfH * this.camera.aspect;

    for (let i = 0; i < this.#COUNT; i++) {
      const hue = (i / this.#COUNT) * 360;
      const mat = new MeshBasicMaterial({
        color:       `hsl(${hue}, 80%, 50%)`,
        side:        DoubleSide,
        transparent: true,
        opacity:     0.2,
      });
      const mesh = new Mesh(GEO, mat);

      mesh.position.x = MathUtils.randFloat(-halfW, halfW);
      mesh.position.y = MathUtils.randFloat(-halfH, halfH);
      mesh.position.z = i * this.#SPACING;

      this.add(mesh);
      this.#meshes.push(mesh);
      this.#helpers.push({ z: mesh.position.z });
    }
  }

  #detectBounds() {
    this.#minZ = 0;
    this.#maxZ = this.#COUNT * this.#SPACING;
  }

  /** WHEEL EVENT */
  onWheel(deltaY) {
    const d = deltaY * this.#SCROLL_SPEED;
    this.#helpers.forEach(h => (h.z += d));
  }

  /** SLIDER INPUT */
  setOffset(offset) {
    this.#helpers.forEach((h, i) => {
      h.z = i * this.#SPACING + offset;
    });
  }

  /** CALL EACH FRAME */
  update(delta) {
    this.#helpers.forEach((h, i) => {
      // WRAP AROUND
      h.z = gsap.utils.wrap(this.#minZ, this.#maxZ, h.z);

      // POSITION MESHES
      const mesh = this.#meshes[i];
      if (Math.abs(mesh.position.z - h.z) > this.#SPACING / 2) {
        mesh.position.z = h.z;
      }
      // DAMPING
      damp(mesh.position, 'z', h.z, this.#DAMPING, delta);

      // FADING / TRYING TO ADD OPACITY BASED ON DISTANCE
      const dist    = Math.abs(this.camera.position.z - mesh.position.z);
      const maxDist = this.#maxZ / 2;
      const t       = 1 - Math.min(dist / maxDist, 1);
      mesh.material.opacity = 0.2 + t * 0.8;
    });
  }
}
