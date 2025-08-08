# WebGL Final Project - Interactive 3D Scene Selector

## Project Overview
This project creates an interactive 3D web experience with multiple scenes and smooth transitions. Users start on a landing page with animated 3D text, then explore different environments through an interactive scene selector.

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

### Shader Implementation
- **Custom Vertex/Fragment Shaders**: Animated wall materials in room scenes
- **Post-Processing**: Bloom effects for atmospheric lighting
- **Performance**: Shaders optimized for 60fps on mobile devices

## Scene Structure

### Landing Page
- Animated 3D "HI!" text with metallic materials
- Interactive "Explore" button with GSAP animations
- OrbitControls for viewing from different angles

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

## Performance Considerations
- **Mobile Optimization**: 60fps target on iPhone
- **Asset Compression**: All textures and models optimized
- **Memory Management**: Proper cleanup and disposal
- **Render Optimization**: Efficient shadow and lighting setup

## Future Enhancements
- Mouse parallax effects
- More complex post-processing
- Additional interactive elements
- Performance monitoring tools

## Installation & Setup
See `SETUP.md` for detailed installation instructions.
