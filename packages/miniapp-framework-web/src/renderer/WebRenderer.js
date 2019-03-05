import renderDOM from './renderDOM';

export default class WebRenderer {
  constructor(pageName, clientId, opts) {
    this.pageName = pageName;
    this.clientId = clientId;
    this.pageQuery = opts.pageQuery;
    const { prevClientId } = opts;

    const renderer = document.createElement('div');
    renderer.setAttribute('class', 'renderer');
    // 给 Element 打标
    renderer.setAttribute('data-prev-client-id', prevClientId);
    renderer.setAttribute('data-client-id', clientId);
    this.renderer = renderer;
  }

  hide() {
    this.renderer.removeAttribute('data-show-renderer');
    this.renderer.style.display = 'none';
  }

  show() {
    this.renderer.setAttribute('data-show-renderer', '');
    this.renderer.style.display = 'block';
  }

  mount(container, callback = () => { }) {
    container.appendChild(this.renderer);
    this.unmount = renderDOM(this.channel, this.renderer, this.clientId, this.pageQuery, window);
    callback();
  }

  destroy() {
    if (this.destroyed) {
      return false;
    }

    this.unmount && this.unmount();
    return this.destroyed = true;
  }
}
