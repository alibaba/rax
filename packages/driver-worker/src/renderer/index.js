import MutationHandler from './MutationHandler';
import LocationHandler from './LocationHandler';
import OperationHandler from './OperationHandler';

export default ({ worker }) => {
  const handlers = {
    MutationRecord: new MutationHandler(worker.postMessage),
    OperationRecord: new OperationHandler(worker.postMessage),

    // Deprecated handler.
    Location: new LocationHandler(worker.postMessage),
  };

  worker.onmessage = ({ data }) => {
    let type = data.type;
    if (handlers[type]) {
      handlers[type].apply(data);
    } else {
      console.error('Can not handle with ' + type, data);
    }
  };

  worker.postMessage({
    type: 'init',
    url: location.href,
    width: document.documentElement.clientWidth
  });
};
