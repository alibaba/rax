import cache from '../../utils/cache';

export default function(eventName, evt, pageId) {
  if (!evt) return;
  const target = eventName.indexOf('canvas') === 0 ? evt.target : evt.currentTarget;
  return cache.getNode(pageId, target && target.dataset.privateNodeId);
}
