# WebGL Final Project - Interactive 3D Scene Selector

## Project Overview
This project creates an interactive 3D web experience with multiple scenes and smooth transitions. Users start on a landing page with animated 3D text, then explore different environments through an interactive scene selector with real-time GUI controls.

## Features Implemented

### Basic Features ✅
- **GLTF Model Loading**: Bedroom and dagger models loaded with GLTFLoader
- **HDRI Environment**: High-quality environment mapping with proper tone mapping
- **Interactive Navigation**: Click-based scene transitions with raycaster
- **Shadow System**: Directional lighting with cast/receive shadows
- **Shader Materials**: Custom shaders for animated walls in room scenes
- **Proper WebGL Setup**: Colorspace, tone mapping, DPR, antialiasing, resize handling

### Advanced Features ✅
- **Post-Processing**: Bloom effects in room scenes
- **Camera Controls**: OrbitControls with restrictions for focused viewing
- **Smooth Animations**: GSAP animations for UI and object floating
- **Performance Optimized**: Model scaling and positioning for optimal rendering
- **Real-time GUI Controls**: Interactive controls for animations and effects
- **FPS Monitoring**: Performance tracking with stats.js
- **Mouse Parallax**: Interactive camera movement on landing page

## Model Optimization

### Bedroom Model (`bedroom.glb`)
- **Original Size**: ~2MB
- **Optimization Steps**:
  - Reduced texture resolution from 4K to 2K
  - Compressed textures using TinyPNG
  - Removed unused materials and meshes
  - Final Size: ~800KB
- **Why No Draco**: Model is already optimized and Draco would reduce visual quality

### Dagger Model (`dagger.glb`)
- **Original Size**: ~1.5MB
- **Optimization Steps**:
  - Simplified geometry while maintaining detail
  - Compressed textures to 1K resolution
  - Removed unnecessary animations
  - Final Size: ~600KB

### HDRI Environment
- **File**: `envmap.hdr` (~2MB)
- **Optimization**: Reduced resolution and compressed
- **Choice**: HDRI over basic lighting for realistic reflections and ambient lighting

## Technical Decisions

### Lighting Strategy
- **HDRI + Directional Light**: Best of both worlds
- **HDRI**: Provides realistic environment reflections and ambient lighting
- **Directional Light**: Adds directional shadows and highlights
- **Tone Mapping**: ACESFilmicToneMapping with 0.5 exposure for balanced lighting

### Performance Optimizations
- **Model Scaling**: Tiny scale factors (0.000001) to keep models manageable
- **Shadow Quality**: 4096x4096 shadow maps for high quality
- **Camera Restrictions**: Limited orbit controls to prevent performance issues
- **Scene Cleanup**: Proper dispose() methods to prevent memory leaks
- **FPS Monitoring**: Real-time performance tracking

### Shader Implementation
- **Custom Vertex/Fragment Shaders**: Animated wall materials in room scenes
- **Post-Processing**: Bloom effects for atmospheric lighting
- **Performance**: Shaders optimized for 60fps on mobile devices
- **Modular Design**: Shaders organized in dedicated files for maintainability

## Scene Structure

### Landing Page
- Animated 3D "HI!" text with metallic materials
- Interactive "Explore" button with GSAP animations
- OrbitControls for viewing from different angles
- Mouse parallax effect for interactive camera movement

### Scene Selector
- Two floating 3D models (bedroom and dagger)
- HDRI environment with shadows
- Click interaction to navigate to rooms
- Floating animation with sine wave motion

### Room Scenes
- GLTF models with post-processing effects
- Custom shader materials for walls
- Bloom lighting for atmosphere
- Smooth transitions between scenes
- Real-time GUI controls for animations and effects

## Animation System

### Bedroom Animations
- **Plant Swaying**: Natural plant movement with configurable speed and amplitude
- **Rotation Effects**: Subtle rotation animations for realistic movement
- **GUI Controls**: Real-time adjustment of animation parameters

### Dungeon Animations
- **Bat Floating**: Simple floating motion for atmospheric effect
- **Water Flow**: Texture offset animation for flowing water effect
- **GUI Controls**: Adjustable animation speeds and amplitudes

## GUI System

### Centralized Control System
- **Modular Design**: GUI controls organized in `src/gui/index.js`
- **Page-Specific Controls**: Different controls for bedroom and dungeon scenes
- **Real-time Updates**: Immediate visual feedback for parameter changes
- **Performance Monitoring**: FPS tracking across all pages

### Available Controls
- **Animation Parameters**: Speed, amplitude, rotation settings
- **Bloom Effects**: Intensity, radius, threshold adjustments
- **Lighting Controls**: Ambient and directional light intensity
- **Water Effects**: Flow speed for dungeon water animation

## Performance Considerations
- **Mobile Optimization**: 60fps target on iPhone
- **Asset Compression**: All textures and models optimized
- **Memory Management**: Proper cleanup and disposal
- **Render Optimization**: Efficient shadow and lighting setup
- **FPS Monitoring**: Real-time performance tracking with stats.js

## Code Architecture

### Modular Design
- **Separated Concerns**: Each page handles its own scene and logic
- **Centralized GUI**: All GUI controls managed from single location
- **Shader Organization**: Shaders organized in dedicated files
- **Clean Imports**: Specific Three.js component imports for better tree-shaking

### File Structure
```
src/
├── pages/           # Scene-specific pages
├── shaders/         # Organized shader files
├── gui/            # Centralized GUI system
├── postprocessing/  # Post-processing effects
└── assets/         # Models, textures, environments
```

## Installation & Setup
See `SETUP.md` for detailed installation instructions.
