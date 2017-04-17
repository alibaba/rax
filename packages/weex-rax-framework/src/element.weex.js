import GCanvas from 'weex-plugin--weex-gcanvas';

export default class Element {
  constructor(element) {
    this.element = element;

    this.getContext = () => {
      return GCanvas.getContext('2d');
    };
  }

  get currentStyle() {
    return Object.assign({}, this.element.classStyle, this.element.style);
  }

  get offsetWidth() {
    const canvasWidth = parseFloat(this.element.classStyle.width || this.element.style.width);
    return canvasWidth;
  }

  get offsetHeight() {
    return parseFloat(this.element.classStyle.height, this.element.style.height);
  }
}
