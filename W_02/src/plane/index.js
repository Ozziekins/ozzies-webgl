import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';

import vertexSrc   from '../shaders/index.vert?raw';
import fragmentSrc from '../shaders/index.frag?raw';

export default class ShaderPlane extends Mesh {
  
  constructor(uniforms) {
    // fullscreen quad
    const geo = new PlaneGeometry(2, 2);
    const mat = new ShaderMaterial({
      vertexShader:   vertexSrc,
      fragmentShader: fragmentSrc,
      uniforms,
    });
    super(geo, mat);
  }
}
