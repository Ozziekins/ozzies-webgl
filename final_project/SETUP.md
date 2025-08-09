# Setup Guide - WebGL Final Project

## Prerequisites
- Node.js (see `.nvmrc` for version)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ozziekins/ozzies-webgl/blob/final_project
   cd final_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technical Stack

- **Three.js** - 3D graphics library
- **Vite** - Build tool and dev server
- **GSAP** - Animation library
- **GLTFLoader** - Model loading
- **RGBELoader** - HDRI loading
- **EffectComposer** - Post-processing
- **lil-gui** - Real-time GUI controls
- **stats.js** - FPS monitoring
- **UnrealBloomPass** - Bloom post-processing effect

## Features

### GUI System
- **Real-time Controls**: Adjust animations, lighting, and effects
- **Page-Specific Controls**: Different controls for bedroom and dungeon
- **Centralized Management**: All GUI logic in `src/gui/index.js`

### Animation System
- **Plant Animations**: Swaying and rotation effects in bedroom
- **Bat Animations**: Floating motion in dungeon
- **Water Effects**: Flowing texture animation in dungeon
- **Configurable Parameters**: Speed, amplitude, rotation settings

### Performance Monitoring
- **FPS Tracking**: Real-time performance monitoring with stats.js
- **Memory Management**: Proper cleanup and disposal
- **Mobile Optimization**: 60fps target on mobile devices

### Mouse Parallax
- **Interactive Camera**: Mouse movement affects camera position
- **Smooth Movement**: Lerped camera transitions
- **Landing Page**: Applied to landing page for enhanced interactivity

## Performance Notes

- **Target FPS**: 60fps on mobile devices
- **Model Optimization**: All models were already small so i did not compress
- **Memory Management**: Proper cleanup in dispose() methods
- **FPS Monitoring**: Real-time performance tracking
- **DPR Optimization**: Clamped to 1.6 maximum for performance
- **Smart Antialiasing**: Only enabled when DPR ≤ 1
