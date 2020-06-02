import cache from '../../utils/cache';

export default function(eventName, evt) {
  if (!evt) return;
  const target = eventName.indexOf('canvas') === 0 ? evt.target : evt.currentTarget;
  return cache.getNode(this.pageId, target && target.dataset.privateNodeId);
}
