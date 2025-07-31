import GUI from 'lil-gui';

export default class GUIManager {
  #gui;

  constructor(uniforms) {
    this.#gui = new GUI();
    // Time slider (read-only)
    this.#gui
      .add(uniforms.uTime, 'value', 0, 20)
      .name('Time')
      .listen();

    // Mouse coords
    this.#gui
      .add(uniforms.uMouse.value, 'x', 0, 1, 0.01)
      .name('Mouse X');
    this.#gui
      .add(uniforms.uMouse.value, 'y', 0, 1, 0.01)
      .name('Mouse Y');

    // Color pickers
    this.#gui
      .addColor(uniforms.uColorA, 'value')
      .name('Color A');
    this.#gui
      .addColor(uniforms.uColorB, 'value')
      .name('Color B');
  }
}
