import GUI from 'lil-gui';

export default class GUIManager {
  #gui;
ctor(uniforms) {
    this.#gui = new GUI({ width: 300 });

    // TIME
    this.#gui
      .add(uniforms.uTime, 'value', 0, 20)
      .name('Time')
      .listen();

    // WAVE PARAMETERS
    this.#gui
      .add(uniforms.uFreq, 'value', 0.1, 20.0)
      .name('Frequency');
    this.#gui
      .add(uniforms.uAmp, 'value', 0.0, 2.0)
      .name('Amplitude');
    this.#gui
      .add(uniforms.uSpeed, 'value', 0.0, 10.0)
      .name('Speed');

    // COLOR
    this.#gui
      .addColor(uniforms.uColor1, 'value')
      .name('Color 1');
    this.#gui
      .addColor(uniforms.uColor2, 'value')
      .name('Color 2');

    // MOUSE
    this.#gui
      .add(this.uniforms.uTwist, 'value', 0.0, 10.0)
      .name('Vortex Strength');
  }
}
