import domRenderer from 'driver-worker/lib/renderer';

const TAG_NAME_PREFIX = 'a-';

/**
 * WebRenderer
 */
export default class WebRenderer {
  constructor(worker, mountNode, win = window) {
    this.worker = worker;
    this.mountNode = mountNode;
    this.window = win;
    this.document = win.document;

    /**
     * Module Event
     * @type {WebRenderer.onModuleAPIEvent}
     */
    worker.onModuleAPIEvent = this.onModuleAPIEvent;
  }

  onModuleAPIEvent({ data: payload })  {
    const { type, data } = payload;
    switch (type) {
      case 'pageScrollTo': {
        const { behavior, scrollTop } = data;
        window.scrollTo({
          top: scrollTop || 0,
          behavior: behavior || 'auto',
        });
        break;
      }
      default:
        break;
    }
  };

  render() {
    domRenderer({
      worker: this.worker,
      tagNamePrefix: TAG_NAME_PREFIX,
      mountNode: this.mountNode,
    });
  }
}
