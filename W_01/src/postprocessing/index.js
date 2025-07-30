import {
  EffectComposer,
  RenderPass,
  EffectPass,
  VignetteEffect,
} from 'postprocessing';

export default class Postprocessing {
  #composer;
  vignette;

  constructor({ gl, scene, camera }) {
    this.#composer = new EffectComposer(gl);

    const renderPass = new RenderPass(scene, camera);
    this.#composer.addPass(renderPass);

    this.vignette = new VignetteEffect({
      eskil: false,
      offset: 0.4,
      darkness: 0.7,
    });

    const effectPass = new EffectPass(camera, this.vignette);
    this.#composer.addPass(effectPass);
  }

  render() {
    this.#composer.render();
  }

  resize(w, h) {
    this.#composer.setSize(w, h);
  }
}
