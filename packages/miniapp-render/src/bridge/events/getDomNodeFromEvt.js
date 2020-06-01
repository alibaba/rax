import cache from '../../utils/cache';

export default function(eventName, evt) {
  if (!evt) return;
  const pageId = this.pageId;
  let originNodeId = this.nodeId;
  if (evt.currentTarget && evt.currentTarget.dataset.privateNodeId) {
    originNodeId = evt.currentTarget.dataset.privateNodeId;
  } else if (
    eventName &&
    eventName.indexOf('canvas') === 0 &&
    evt.target &&
    evt.target.dataset.privateNodeId
  ) {
    originNodeId = evt.target.dataset.privateNodeId;
  }
  return cache.getNode(pageId, originNodeId);
}
