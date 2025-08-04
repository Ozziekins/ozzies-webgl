import {
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  BufferAttribute,
} from 'three';

import vertexShader from '../shaders/index.vert';
import fragmentShader from '../shaders/index.frag';

export default class Plane {
  mesh;
  isHovered = false;

  constructor(uniforms, position) {
    // GEOMETRY
    const geo = new PlaneGeometry(1.2, 1.2, 40, 40);

    const count = geo.attributes.position.count;
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    geo.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    // MATERIAL
    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...uniforms,
        uHoverState: { value: 0.0 }
      },
      wireframe: false,
    });

    // MESH
    this.mesh = new Mesh(geo, mat);
    this.mesh.position.copy(position);
    this.material = mat;
  }

  setHoverState(hovered) {
    this.isHovered = hovered;
    this.material.uniforms.uHoverState.value = hovered ? 1.0 : 0.0;
  }

  update(time) {
    // ROTATE PLANE SLOWLY OVER TIME
    this.mesh.rotation.y += 0.003;
    this.mesh.rotation.z += 0.004;
  }
}
