import { generateHTML } from './html';
import renderDOM from './renderDOM';

const rendererDocHTML = generateHTML({
  viewport: screen.width / 750,
});

export default class IframeRenderer {
  constructor(pageName, clientId, opts) {
    this.pageName = pageName;
    this.clientId = clientId;
    this.pageQuery = opts.pageQuery;
    const { prevClientId } = opts;

    const renderer = document.createElement('iframe');
    renderer.setAttribute('class', 'renderer');
    // 给 Element 打标
    renderer.setAttribute('data-prev-client-id', prevClientId);
    renderer.setAttribute('data-client-id', clientId);
    this.renderer = renderer;
    this.initIframe(renderer);
  }

  initIframe(iframeEl) {
    iframeEl.setAttribute('srcdoc', rendererDocHTML);
    iframeEl.setAttribute('scrolling', 'yes');
    iframeEl.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-modals allow-popups allow-forms');
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
    this.renderer.onload = () => {
      try {
        this.renderer.contentWindow.__current_page__ = this.pageName;
        this.renderer.contentWindow.__current_client_id__ = this.clientId;
      } catch (err) {}

      /**
       * If iframe content is srcDoc, execute initRenderer.
       * Or the iframe content is an external page, may throw error
       * executing javascript in cross domain iframe.
       */
      let needInit = false;
      try {
        needInit = this.renderer.contentWindow.location.href === 'about:srcdoc';
      } catch (e) {}
      if (needInit) {
        this.unmount = renderDOM(this.channel, this.renderer.contentDocument.body, this.clientId, this.pageQuery, this.renderer.contentWindow);
      }
      callback();
    };
  }

  destroy() {
    if (this.destroyed) {
      return false;
    }

    this.unmount && this.unmount();
    return this.destroyed = true;
  }
}
