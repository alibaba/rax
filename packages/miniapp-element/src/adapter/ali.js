export function getId(instance) {
  const nodeId = instance.props['data-private-node-id'];
  const pageId = instance.props['data-private-page-id'];

  return {
    nodeId,
    pageId
  };
}

export const PROPS = 'props';
export const MOUNT = 'didMount';
export const UNMOUNT = 'didUnmount';
export const INIT = 'onInit';

