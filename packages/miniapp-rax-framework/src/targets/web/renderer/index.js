import domRenderer from 'driver-worker/lib/renderer';

export default function initRenderer(mountNode, clientId, pageQuery) {
  const worker = self.$$workerTransfers[clientId];
  if (!worker) {
    throw new Error(
      '无法找到 transfer worker, clientId: ' + clientId
    );
  }

  const postMessage = worker.postMessage;
  worker.postMessage = msg => {
    if (msg.type === 'init') {
      msg.pageQuery = pageQuery;
    }
    postMessage.call(worker, msg);
  };

  domRenderer({
    worker,
    tagNamePrefix: 'a-',
    mountNode
  });

  /* hook for ready */
  if (typeof __ready === 'function') {
    __ready(); // eslint-disable-line
  }

  worker.onModuleAPIEvent = ({ data: payload }) => {
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
