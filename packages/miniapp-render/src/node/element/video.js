import Element from '../element';

class HTMLVideoElement extends Element {
  constructor(options) {
    const width = options.width;
    const height = options.height;

    if (typeof width === 'number' && width >= 0) options.attrs.width = width;
    if (typeof height === 'number' && height >= 0) options.attrs.height = height;

    super(options);

    this.$_initRect();
  }

  $_initRect() {
    const width = parseInt(this.__attrs.get('width'), 10);
    const height = parseInt(this.__attrs.get('height'), 10);

    if (typeof width === 'number' && width >= 0) this.$_style.width = `${width}px`;
    if (typeof height === 'number' && height >= 0) this.$_style.height = `${height}px`;
  }

  get _renderInfo() {
    return {
      nodeId: this.__nodeId,
      pageId: this.__pageId,
      nodeType: 'video',
      ...this.__attrs.__value,
      style: this.style.cssText,
      class: 'h5-video ' + this.className,
    };
  }

  get src() {
    return this.__attrs.get('src') || '';
  }

  set src(value) {
    if (!value || typeof value !== 'string') return;

    this.__attrs.set('src', value);
  }

  get width() {
    return +this.__attrs.get('width') || 0;
  }

  set width(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this.__attrs.set('width', value);
    this.$_initRect();
  }

  get height() {
    return +this.__attrs.get('height') || 0;
  }

  set height(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this.__attrs.set('height', value);
    this.$_initRect();
  }

  get autoplay() {
    return !!this.__attrs.get('autoplay');
  }

  set autoplay(value) {
    value = !!value;
    this.__attrs.set('autoplay', value);
  }

  get loop() {
    return !!this.__attrs.get('loop');
  }

  set loop(value) {
    value = !!value;
    this.__attrs.set('loop', value);
  }

  get muted() {
    return !!this.__attrs.get('muted');
  }

  set muted(value) {
    value = !!value;
    this.__attrs.set('muted', value);
  }

  get controls() {
    const value = this.__attrs.get('controls');
    return value !== undefined ? !!value : true;
  }

  set controls(value) {
    this.__attrs.set('controls', value);
  }

  get poster() {
    return this.__attrs.get('poster');
  }

  set poster(value) {
    if (!value || typeof value !== 'string') return;

    this.__attrs.set('poster', value);
  }

  get currentTime() {
    return +this.__attrs.get('currentTime') || 0;
  }

  get buffered() {
    return this.__attrs.get('buffered');
  }
}

export default HTMLVideoElement;
