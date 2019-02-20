import { getMessageProxy } from '../container/MessageProxy';
import DOMRenderer from './DOMRenderer';

export default function renderDOM(mountNode, clientId, pageQuery = {}, window) {
  const workerHandler = getMessageProxy(clientId);

  const postMessage = workerHandler.postMessage;
  workerHandler.postMessage = msg => {
    if (msg.type === 'init') {
      msg.pageQuery = pageQuery;
    }
    postMessage.call(workerHandler, msg);
  };

  return new DOMRenderer(workerHandler, mountNode, window);
}
