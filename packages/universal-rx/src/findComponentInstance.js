import instance from './vdom/instance';

function findComponentInstance(node) {
  if (node == null) {
    return null;
  }
  return instance.get(node);
}

export default findComponentInstance;
