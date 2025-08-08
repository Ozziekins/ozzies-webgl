import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  VignetteEffect
} from 'postprocessing';

export default function createPostprocessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);

  const bloom = new BloomEffect({
    intensity: 0.5,
    luminanceThreshold: 0.15,
    luminanceSmoothing: 0.025
  });

  const vignette = new VignetteEffect({
    eskil: false,
    offset: 0.5,
    darkness: 0.7
  });

  const effectPass = new EffectPass(camera, bloom, vignette);
  effectPass.renderToScreen = true;

  composer.addPass(renderPass);
  composer.addPass(effectPass);

  return composer;
}
