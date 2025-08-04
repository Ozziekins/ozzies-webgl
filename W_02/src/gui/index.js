import GUI from 'lil-gui';
import { Color } from 'three';

export default class GUIManager {
  gui;
  uniforms;

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uFreq: { value: 4.0 },
      uAmp: { value: 0.2 },
      uSpeed: { value: 2.0 },
      uColor1: { value: new Color('#3c5ec3') },
      uColor2: { value: new Color('#712f83') },
      uHoverColor: { value: new Color('#e91e63') },
      uHoverState: { value: 0.0 },
    };

    this.gui = new GUI();

    this.gui.add(this.uniforms.uFreq, 'value', 1, 10).name('Frequency');
    this.gui.add(this.uniforms.uAmp, 'value', 0, 1).name('Amplitude');
    this.gui.add(this.uniforms.uSpeed, 'value', 0.1, 10).name('Speed');

    this.gui.addColor({ uColor1: '#3c5ec3' }, 'uColor1').onChange(v => {
      this.uniforms.uColor1.value.set(v);
    });

    this.gui.addColor({ uColor2: '#712f83' }, 'uColor2').onChange(v => {
      this.uniforms.uColor2.value.set(v);
    });

    this.gui.addColor({ uHoverColor: '#e91e63' }, 'uHoverColor').onChange(v => {
      this.uniforms.uHoverColor.value.set(v);
    });
  }
}
