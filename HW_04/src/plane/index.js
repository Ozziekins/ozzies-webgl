import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import vert from '../shaders/index.vert?raw';
import frag from '../shaders/index.frag?raw';

export default class WavePlane extends Mesh {
  constructor(uniforms) {
    const geometry = new PlaneGeometry(4, 4, 128, 128);
    const material = new ShaderMaterial({
      vertexShader:   vert,
      fragmentShader: frag,
      uniforms,
    });
    super(geometry, material);

    material.needsUpdate = true;
  }
}
