# Setup Guide - WebGL Final Project

## Prerequisites
- Node.js (see `.nvmrc` for version)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

## Project Structure

```
final_project/
├── src/
│   ├── pages/
│   │   ├── landing.js          # Landing page with 3D text and mouse parallax
│   │   ├── sceneSelector.js    # Interactive model selector
│   │   ├── bedroom.js          # Bedroom scene with plant animations
│   │   └── dungeon.js          # Dungeon scene with bat and water animations
│   ├── shaders/
│   │   ├── bedroom.vert.js     # Bedroom vertex shader
│   │   ├── bedroom.frag.js     # Bedroom fragment shader
│   │   ├── bedroomGradient.vert.js # Bedroom gradient vertex shader
│   │   ├── bedroomGradient.frag.js # Bedroom gradient fragment shader
│   │   ├── dungeon.vert.js     # Dungeon vertex shader
│   │   ├── dungeon.frag.js     # Dungeon fragment shader
│   │   ├── dungeonGradient.vert.js # Dungeon gradient vertex shader
│   │   ├── dungeonGradient.frag.js # Dungeon gradient fragment shader
│   │   ├── index.vert.js       # Generic vertex shader
│   │   └── index.frag.js       # Generic fragment shader
│   ├── gui/
│   │   └── index.js            # Centralized GUI system
│   ├── postprocessing/
│   │   ├── index.js            # Generic post-processing composer
│   │   └── sceneSelectorEffects.js # Hover effects and particle system
│   ├── App.js                  # Main application with routing and FPS monitoring
│   ├── router.js               # Hash-based routing
│   └── main.js                 # Entry point
├── assets/
│   ├── models/
│   │   ├── bedroom.glb         # Optimized bedroom model
│   │   ├── dagger.glb          # Optimized dagger model
│   │   └── ...                 # Additional models
│   ├── env/
│   │   ├── envmap.hdr          # HDRI environment map
│   │   └── envmap_d.hdr        # Alternative HDRI
│   ├── textures/
│   │   └── base.png            # Compressed textures
│   └── fonts/
│       └── helvetiker_regular.typeface.json # Font for 3D text
├── public/
│   ├── envmap.hdr              # Public HDRI files
│   └── envmap_d.hdr
├── package.json
├── vite.config.js
├── README.md                   # Project documentation
└── SETUP.md                    # This file
```

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

## New Features

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
- **Model Optimization**: All models compressed and optimized
- **Texture Compression**: All textures compressed using TinyPNG
- **Memory Management**: Proper cleanup in dispose() methods
- **FPS Monitoring**: Real-time performance tracking
