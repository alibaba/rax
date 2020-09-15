import EventTarget from '../../event/event-target';
import cache from '../../utils/cache';

export default function(eventName, evt, extra, pageId, nodeId) {
  const originNode = cache.getNode(pageId, nodeId);

  if (!originNode) return;
  EventTarget.$$process(
    originNode,
    eventName,
    evt,
    extra
  );
}
