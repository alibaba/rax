import { setEventSender } from './events';
import MutationHandler from './MutationHandler';
import LocationHandler from './LocationHandler';
import RemoteESSyncHandler from './RemoteESSyncHandler';

export default ({ worker }) => {
  setEventSender(worker.postMessage);

  const handlers = {
    MutationRecord: new MutationHandler(),
    Location: new LocationHandler(),
    RemoteDOMSync: new RemoteESSyncHandler(worker.postMessage),
  };

  worker.onmessage = ({ data }) => {
    let type = data.type;
    if (handlers[type]) {
      handlers[type].apply(data);
    } else {
      console.error('[DriverWorker] Can not handle with ' + type, data);
    }
  };

  worker.postMessage({
    type: 'init',
    url: location.href,
    width: document.documentElement.clientWidth
  });
};
