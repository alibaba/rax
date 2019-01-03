import MutationHandler from './MutationHandler';
import EvaluationHandler from './EvaluationHandler';
import LocationHandler from './LocationHandler';

export default ({ worker, mountNode }) => {
  const postMessage = worker.postMessage.bind(worker);

  const handlers = {
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
    width: document.documentElement.clientWidth
  });
};
