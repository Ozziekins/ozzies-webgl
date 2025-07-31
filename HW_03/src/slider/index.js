export default class UI {
  #slider;

  constructor(max, onChange) {
    this.#slider = document.createElement('input');
    this.#slider.type  = 'range';
    this.#slider.min   = '0';
    this.#slider.max   = String(max);
    this.#slider.step  = '1';
    this.#slider.value = '0';

    this.#initStyles();
    this.#attach(onChange);
  }

  #initStyles() {
    Object.assign(this.#slider.style, {
      position: 'absolute',
      left:     '50%',
      bottom:   '20px',
      transform:'translateX(-50%)',
      width:    '80%',
      zIndex:   '10',
    });
    document.body.appendChild(this.#slider);
  }

  #attach(onChange) {
    this.#slider.addEventListener('input', e => {
      onChange(Number(e.target.value));
    });
  }
}