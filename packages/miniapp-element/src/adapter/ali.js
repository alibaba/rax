export function getId(instance) {
  const nodeId = instance.props.dataPrivateNodeId;
  const pageId = instance.props.dataPrivatePageId;

  return {
    nodeId,
    pageId
  }
}

export const PROPS = 'props';
export const MOUNT = 'didMount';
export const UNMOUNT = 'didUnmount';

