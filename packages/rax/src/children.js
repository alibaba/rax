import flattenChildren from './flattenChildren';

function convertChildrenToArray(children) {
  // flatten children
  children = flattenChildren(children, []);
  return Array.isArray(children) ? children : [].concat(children);
}

const Children = {
  map(children, fn, ctx) {
    if (children == null) return null;
    children = convertChildrenToArray(children);
    return children.map((child, index) => fn.call(ctx, child, index));
  },
  forEach(children, fn, ctx) {
    if (children == null) return null;
    children = convertChildrenToArray(children);
    children.forEach((child, index) => fn.call(ctx, child, index));
  },
  count(children) {
    if (children == null) return 0;
    return convertChildrenToArray(children).length;
  },
  only(children) {
    // `only` receive rax element child
    // null value is not acceptable
    children = Children.toArray(children);
    if (children.length !== 1) throw new Error('Children.only: expected to receive a single element child.');
    return children[0];
  },
  toArray(children) {
    if (children == null) return [];
    // `toArray` filter null value
    return convertChildrenToArray(children).filter(child => child !== null);
  }
};

export default Children;
