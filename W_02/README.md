# Weekly 02/02 – Spherical Grid with Interactive Hover Effects

## Overview

A 3D spherical grid of animated planes rendered with custom GLSL **ShaderMaterial** using Three.js.
Each plane features animated wave effects and interactive hover functionality with color transitions.
The planes are arranged in a spherical pattern and respond to mouse hover with smooth color changes.

## Features

* **Spherical Grid Layout**: Planes arranged on the surface of a sphere using spherical coordinates
* **Interactive Hover Effects**: Mouse hover detection with smooth color transitions
* **Animated Wave Shaders**: Each plane has animated wave patterns driven by time
* **Real-time Controls**: GUI panel for adjusting animation parameters and colors
* **Responsive Design**: Automatic camera and renderer adjustments on window resize

## Installation

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Your dev server will serve at `http://localhost:5173` (or next available port).

## Usage

* **Mouse Hover:** Hover over any plane to see color transition to pinkish purple
* **Mouse Movement:** Orbit controls allow camera rotation around the spherical grid
* **GUI Controls:** Adjust animation speed, amplitude, frequency, and colors in real-time
* **Window Resize:** Automatic aspect ratio and pixel density adjustments

## Scripts

* `npm run dev` — start development server
* `npm run build` — production build

---
