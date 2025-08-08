import GUI from 'lil-gui';
import * as THREE from 'three';

export function createBedroomGUI(params, scene) {
  const gui = new GUI();
  gui.title('Bedroom Controls');

  // Plant Animation Controls
  const plantFolder = gui.addFolder('Plant Animation');
  plantFolder.add(params.plantAnimation, 'speed', 0.1, 2.0, 0.1).name('Speed');
  plantFolder.add(params.plantAnimation, 'amplitude', 0.1, 1.0, 0.01).name('Amplitude');
  plantFolder.add(params.plantAnimation, 'rotationSpeed', 0.1, 2.0, 0.1).name('Rotation Speed');
  plantFolder.add(params.plantAnimation, 'rotationAmplitude', 0.001, 0.1, 0.001).name('Rotation Amplitude');

  // Bloom Controls
  const bloomFolder = gui.addFolder('Bloom Effect');
  bloomFolder.add(params.bloom, 'intensity', 0.0, 2.0, 0.1).name('Intensity');
  bloomFolder.add(params.bloom, 'radius', 0.0, 1.0, 0.1).name('Radius');
  bloomFolder.add(params.bloom, 'threshold', 0.0, 1.0, 0.05).name('Threshold');

  // Lighting Controls
  const lightingFolder = gui.addFolder('Lighting');
  lightingFolder.add(params.lighting, 'ambientIntensity', 0.0, 3.0, 0.1).name('Ambient Light');
  lightingFolder.add(params.lighting, 'directionalIntensity', 0.0, 5.0, 0.1).name('Directional Light');

  // Update lighting when changed
  lightingFolder.onChange(() => {
    scene.children.forEach(child => {
      if (child instanceof THREE.AmbientLight) {
        child.intensity = params.lighting.ambientIntensity;
      }
      if (child instanceof THREE.DirectionalLight) {
        child.intensity = params.lighting.directionalIntensity;
      }
    });
  });

  return gui;
}

export function createDungeonGUI(params, scene) {
  const gui = new GUI();
  gui.title('Dungeon Controls');

  // Bat Animation Controls
  const batFolder = gui.addFolder('Bat Animation');
  batFolder.add(params.batAnimation, 'speed', 0.1, 2.0, 0.1).name('Speed');
  batFolder.add(params.batAnimation, 'amplitude', 0.1, 2.0, 0.1).name('Amplitude');

  // Water Animation Controls
  const waterFolder = gui.addFolder('Water Animation');
  waterFolder.add(params.waterAnimation, 'flowSpeed', 0.0001, 0.01, 0.0001).name('Flow Speed');

  // Bloom Controls
  const bloomFolder = gui.addFolder('Bloom Effect');
  bloomFolder.add(params.bloom, 'intensity', 0.0, 2.0, 0.1).name('Intensity');
  bloomFolder.add(params.bloom, 'radius', 0.0, 1.0, 0.1).name('Radius');
  bloomFolder.add(params.bloom, 'threshold', 0.0, 1.0, 0.05).name('Threshold');

  // Lighting Controls
  const lightingFolder = gui.addFolder('Lighting');
  lightingFolder.add(params.lighting, 'ambientIntensity', 0.0, 3.0, 0.1).name('Ambient Light');
  lightingFolder.add(params.lighting, 'directionalIntensity', 0.0, 5.0, 0.1).name('Directional Light');

  // Update lighting when changed
  lightingFolder.onChange(() => {
    scene.children.forEach(child => {
      if (child instanceof THREE.AmbientLight) {
        child.intensity = params.lighting.ambientIntensity;
      }
      if (child instanceof THREE.DirectionalLight) {
        child.intensity = params.lighting.directionalIntensity;
      }
    });
  });

  return gui;
}

// Legacy function for backward compatibility
export default function createGUI(uniforms) {
  const gui = new GUI();

  if (uniforms.uColor) {
    gui.addColor({ color: `#${uniforms.uColor.value.getHexString()}` }, 'color')
      .onChange((value) => {
        uniforms.uColor.value.set(value);
      });
  }

  if (uniforms.uTime) {
    gui.add(uniforms.uTime, 'value', 0, 10).name('Time').listen();
  }

  return gui;
}
