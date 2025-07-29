import {
  EquirectangularReflectionMapping,
  TextureLoader,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const ASSETS = [
  { key: 'fox', type: 'gltf', path: '/fox.glb' },
  { key: 'chalet', type: 'gltf', path: '/chalet.glb' },
  { key: 'forest', type: 'gltf', path: '/forest.glb' },
  { key: 'envmapLight', type: 'envmap', path: '/envmap.hdr' },
  { key: 'envmapDark', type: 'envmap', path: '/envmap_d.hdr' },
];

class Resources {
  #resources = new Map();

  #loaders = {
    gltf: new GLTFLoader(),
    rgbe: new RGBELoader(),
    tex: new TextureLoader(),
  };

  get(key) {
    return this.#resources.get(key);
  }

  async load() {
    const promises = ASSETS.map((asset) => {
      return new Promise((res) => {
        if (asset.type === 'gltf') {
          this.#loaders.gltf.load(asset.path, (model) => {
            this.#resources.set(asset.key, model);
            res();
          });
        } else if (asset.type === 'envmap') {
          this.#loaders.rgbe.load(asset.path, (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            this.#resources.set(asset.key, texture);
            res();
          });
        } else if (asset.type === 'texture') {
          this.#loaders.tex.load(asset.path, (tex) => {
            this.#resources.set(asset.key, tex);
            res();
          });
        }
      });
    });

    await Promise.all(promises);
  }
}

const resources = new Resources();
export default resources;
