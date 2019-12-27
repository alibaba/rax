export function getId(instance) {
  const nodeId = instance.dataset.privateNodeId;
  const pageId = instance.dataset.privatePageId;

  return {
    nodeId,
    pageId
  }
}

export const PROPS = 'properties';
export const MOUNT = 'attached';
export const UNMOUNT = 'detached';
