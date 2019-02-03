import domRenderer from 'driver-worker/lib/renderer';
import { getMessageProxy } from '../container/MessageProxy';

export default function initRenderer(mountNode, clientId, pageQuery) {
  const workerHandler = getMessageProxy(clientId);

  const postMessage = workerHandler.postMessage;
  workerHandler.postMessage = msg => {
    if (msg.type === 'init') {
      msg.pageQuery = pageQuery;
    }
    postMessage.call(workerHandler, msg);
  };

  domRenderer({
    worker: workerHandler,
    tagNamePrefix: 'a-',
    mountNode
  });

  workerHandler.onModuleAPIEvent = ({ data: payload }) => {
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
}
