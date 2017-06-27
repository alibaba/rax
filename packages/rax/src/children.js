import flattenChildren from './flattenChildren';

let Children = {
  map(children, fn, ctx) {
    if (children == null) return null;
    children = Children.toArray(children);
    return children.map((child, index) => fn.call(ctx, child, index));
  },
  forEach(children, fn, ctx) {
    if (children == null) return null;
    children = Children.toArray(children);
    children.forEach((child, index) => fn.call(ctx, child, index));
  },
  count(children) {
    return Children.toArray(children).length;
  },
  only(children) {
    children = Children.toArray(children);
    if (children.length !== 1) throw new Error('Children.only expected to receive a single React element child.');
    return children[0];
  },
  toArray(children) {
    if (children == null) return [];
    // flatten children
    children = flattenChildren(children);
    return Array.isArray(children) ? children : [].concat(children);
  }
};

export default Children;
