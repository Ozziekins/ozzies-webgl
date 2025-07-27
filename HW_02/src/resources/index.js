import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ASSETS = [
  { key: 'lamp', path: '/lamp.glb' },
];

class Resources {
  #resources = new Map();
  #loader = new GLTFLoader();

  get(key) {
    return this.#resources.get(key);
  }

  async load() {
    const promises = ASSETS.map(
      (asset) =>
        new Promise((res) => {
          this.#loader.load(asset.path, (gltf) => {
            this.#resources.set(asset.key, gltf);
            res();
          });
        })
    );

    await Promise.all(promises);
  }
}

const resources = new Resources();
export default resources;
