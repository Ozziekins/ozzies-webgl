# Infinite Z-Axis Grid

A clean, performant Three.js scene showcasing an infinite, scroll-driven Z-axis slider of colored planes. Use the range slider or mouse wheel to navigate smoothly through 3D space, with damping-based motion and distance-based opacity fading.

## Features

* **Infinite Loop**: Ten planes wrap seamlessly along the Z-axis.
* **Slider & Scroll**: Control the Z-offset.
* **Smooth Motion**: `damp()`-based easing for a natural, springy feel.
* **Opacity Fade**: Planes fade in/out based on distance to the camera.
* **Device Pixel Ratio & Antialiasing**: Automatic DPR clamping on the renderer.
* **Stats Panel**: Real-time performance metrics via `stats.js`.
* **Modular Structure**: Concise, private-field classes for UI, planes, and app orchestration.

## Installation

1. **Clone the repo**:

   ```bash
   git clone https://github.com/Ozziekins/ozzies-webgl.git
   cd HW_03
   ```
2. **Install dependencies**:

   ```bash
   npm install
   ```
3. **Run locally**:

   ```bash
   npm run dev
   ```

## Folder Structure

```
project-root/
├── index.html
├── package.json
├── README.md
└── src/
    ├── slider/
    │   └── index.js
    ├── planes/
    │   └── index.js
    └── App.js
```
