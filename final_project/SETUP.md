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
│   │   ├── landing.js          # Landing page with 3D text
│   │   ├── sceneSelector.js    # Interactive model selector
│   │   ├── bedroom.js          # Bedroom scene with post-processing
│   │   └── dungeon.js          # Dungeon scene with post-processing
│   ├── shaders/
│   │   ├── index.vert.js       # Vertex shader for animated walls
│   │   └── index.frag.js       # Fragment shader for animated walls
│   ├── postprocessing.js/
│   │   └── index.js            # Bloom post-processing effects
│   ├── App.js                  # Main application with routing
│   ├── router.js               # Hash-based routing
│   └── main.js                 # Entry point
├── assets/
│   ├── models/
│   │   ├── bedroom.glb         # Optimized bedroom model
│   │   └── dagger.glb          # Optimized dagger model
│   ├── env/
│   │   └── envmap.hdr          # HDRI environment map
│   └── textures/               # Compressed textures
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

## Performance Notes

- **Target FPS**: 60fps on mobile devices
- **Model Optimization**: All models compressed and optimized
- **Texture Compression**: All textures compressed using TinyPNG
- **Memory Management**: Proper cleanup in dispose() methods

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Models not loading
- Check that model files are in `src/assets/models/`
- Verify file paths in imports
- Check browser console for errors

### Performance issues
- Reduce shadow map size in lighting setup
- Lower model scale factors
- Disable post-processing if needed

### HDRI not loading
- Check that `envmap.hdr` is in `src/assets/env/`
- Verify RGBELoader import
- Check file size (should be < 3MB)

## Development Tips

- Use browser dev tools to monitor performance
- Check Three.js examples for reference
- Test on mobile devices for performance
- Use `console.log` for debugging scene setup 