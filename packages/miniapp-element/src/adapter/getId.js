// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default function(instance) {
  let nodeId, pageId;
  if (isMiniApp) {
    nodeId = instance.props['data-private-node-id'];
    pageId = instance.props['data-private-page-id'];
  } else {
    nodeId = instance.dataset.privateNodeId;
    pageId = instance.dataset.privatePageId;
  }

  return {
    nodeId,
    pageId
  };
}
