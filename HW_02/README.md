# Three.js Homework 02/04

## 💡 Description

This is a basic Three.js scene for Homework 02/04 of the WebGL course with Robert Borghesi. It includes:

* A loaded `.glb` model (`lamp.glb.glb`)
* Proper lighting setup with ambient + directional light
* Optimized shadows using `castShadow` / `receiveShadow`
* OrbitControls, requestAnimationFrame loop, resize handling
* A pastel background and aesthetic layout

## 🗂 Structure

```
/public/lamp.glb.glb
/src/App.js
/src/main.js
index.html
```

## 🚀 How to Run

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
npm install
live-server
```

Or just open `index.html` with a local server if you prefer.

## 📸 Screenshot

> (Include a screenshot of your rendered scene here)

## 🛆 Tech

* [three.js](https://threejs.org/)
* [stats.js](https://github.com/mrdoob/stats.js/)
* [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
* [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
