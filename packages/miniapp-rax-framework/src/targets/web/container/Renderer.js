import { set as setBus, createTransferBus } from './transferBus';
import initRenderer from '../renderer';

export default class Renderer {
  constructor(pageName, clientId, opts) {
    this.pageName = pageName;
    this.clientId = clientId;
    this.pageQuery = opts.pageQuery;
    const { currentClientId } = opts;

    const renderer = document.createElement('div');
    renderer.setAttribute('class', 'renderer');
    // 给 Element 打标
    renderer.setAttribute('data-prev-client-id', currentClientId);
    renderer.setAttribute('data-client-id', clientId);
    this.renderer = renderer;

    this.transferBus = createTransferBus(clientId, pageName);
    setBus(clientId, this.transferBus);
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
    callback();
    initRenderer(this.renderer, this.clientId, this.pageQuery || {});
  }

  destroy() {
    if (this.destroyed) {
      return false;
    }
    this.hide();
    this.renderer.parentElement.removeChild(this.renderer);
    return (this.destroyed = true);
  }
}
