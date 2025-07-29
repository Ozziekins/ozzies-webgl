# 🌲 Three.js Weekly 01/02 - Forest Scene

A stylized interactive Three.js scene featuring a low-poly fox moving in front of a snowy chalet inside a forest. Includes shadows, camera orbit controls, animated elements, theme toggle (🌞/🌙), post-processing effects, and mouse movement effects.

---

## 📦 Features

* 🦧 Animated fox movement in a loop
* 🏡 Chalet with subtle animated chimney smoke
* 🌳 Forest environment from low-poly glTF assets
* 🔦 Ambient + Directional lights (shadows enabled)
* ✨ Post-processing effects: Vignette, Sepia, Chromatic Aberration
* 🧠 Clamped DPR for performance optimization
* 🎥 Camera orbit control with damping
* 📊 Stats.js monitor enabled

---

## 🗂 Folder Structure

```
HW01/
├── public/
│   ├── fox.glb
│   ├── chalet.glb
│   ├── forest.glb
│   └── envmap_d.hdr
│   └── envmap.hdr
├── src/
│   ├── App.js
│   ├── main.js
│   ├── resources/
│   │   └── index.js
│   └── postprocessing/
│       └── index.js
├── index.html
└── README.md
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

---

## 📝 Credits

* **Fox** by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/10u8FYPC5Br)
* **Trees** by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/dTy_L-TMS2z)
* **Chalet** by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/8QBUPls_J9b)

---

## 📌 Notes

* ✅ Antialiasing and DPR are clamped for safety
* ✅ Shadows are optimized (directional map size set to 1024)
* ✅ Theme toggle smoothly transitions background and light
* ✅ Effects and helpers can be toggled from GUI
* ✅ Postprocessing resizes with window events
