/* global DEVICE_WIDTH */
import MutationHandler from './MutationHandler';
import EvaluationHandler from './EvaluationHandler';
import LocationHandler from './LocationHandler';

export default ({ worker, mountNode }) => {
  const postMessage = worker.postMessage.bind(worker);

  let handlers = {
    MutationRecord: new MutationHandler(postMessage, mountNode),
    EvaluationRecord: new EvaluationHandler(postMessage),

    // Deprecated handler.
    Location: new LocationHandler(postMessage),
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
    width: getDeviceWidth(),
  });

  return function unmount() {
    handlers.MutationRecord.destroy();
    worker.onmessage = noop;
    handlers = null;
  };
};

/**
 * Get device base width
 * @return {number}
 */
function getDeviceWidth() {
  return typeof DEVICE_WIDTH !== 'undefined'
    ? DEVICE_WIDTH
    : document.documentElement.clientWidth;
}

function noop() {}
