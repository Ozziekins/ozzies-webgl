# Weekly 02/02 – ShaderMaterial 2D Scene

## Overview

A full-screen, 2D plane rendered with a custom GLSL **ShaderMaterial** using Three.js.
Interactive ripples and color blending driven by time, pointer position, and GUI controls.


## Folder Structure

```
project-root/
├── index.html             # HTML entrypoint with <canvas>
├── package.json           # Dependencies and scripts
└── src/
    ├── shaders/
    │   ├── vertex.glsl    # Vertex shader
    │   └── fragment.glsl  # Fragment shader
    ├── gui/
    │   └── index.js       # lil-gui setup for uniforms
    ├── plane/
    │   └── index.js       # ShaderPlane component
    └── App.js             # Main app orchestration
```

## Installation

```bash
# Use the Node version specified in .nvmrc
nvm use

# Install dependencies
npm install

# Run dev server
npm run dev
```

Your dev server (e.g. Vite) will serve at `http://localhost:3000` by default.

## Usage

* **Pointer Move:** updates `uMouse` uniform, shifting ripple origin.
* **GUI:** tweak `uTime`, `uMouse`, and color uniforms via lil-gui panel.
* **Resize:** automatic DPR clamping and camera aspect adjustment.

## Shader Highlights

* **Circular Ripple:** `sin(length(uvOffset) * 20.0 - uTime * 4.0)` in fragment shader.
* **Color Blend:** mix between `uColorA` and `uColorB` based on ripple wave.
* **Variables:**

  * `uTime` (float) — elapsed time in seconds.
  * `uMouse` (vec2) — normalized pointer position.
  * `uColorA`, `uColorB` (vec3) — color palettes.

## Scripts

* `npm start` — start development server
* `npm run build` — production build

## Notes

* Uses private-fields (`#`) and `#init`/`#load` methods to mirror class style from lectures.
* Ensure GLSL files are loaded via `vite-plugin-glsl` or similar.

---
