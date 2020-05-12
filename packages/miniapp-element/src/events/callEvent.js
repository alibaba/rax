import render from 'miniapp-render';

const { cache, EventTarget } = render.$$adapter;

export default function(eventName, evt, extra, pageId) {
  const originNodeId =
    evt.currentTarget.dataset.privateNodeId;
  const originNode = cache.getNode(pageId, originNodeId);

  if (!originNode) return;

  EventTarget.$$process(
    originNode,
    eventName,
    evt,
    extra
  );
}
