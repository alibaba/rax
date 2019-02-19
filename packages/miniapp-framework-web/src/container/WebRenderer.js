import { getMessageProxy } from './MessageProxy';
import initRenderer from '../renderer';

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

    this.transferBus = getMessageProxy(clientId);
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
    initRenderer(this.renderer, this.clientId, this.pageQuery || {});
    callback();
  }

  destroy() {
    if (this.destroyed) {
      return false;
    }
    this.hide();
    this.renderer.parentElement.removeChild(this.renderer);
    return this.destroyed = true;
  }
}
