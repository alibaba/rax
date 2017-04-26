const Children = {
  map(children, fn, ctx) {
    if (children == null) return null;
    children = Children.toArray(children);
    if (ctx && ctx !== children) fn = fn.bind(ctx);
    return children.map(fn);
  },
  forEach(children, fn, ctx) {
    if (children == null) return null;
    children = Children.toArray(children);
    if (ctx && ctx !== children) fn = fn.bind(ctx);
    children.forEach(fn);
  },
  count(children) {
    return (children && children.length) || 0;
  },
  only(children) {
    children = Children.toArray(children);
    if (children.length !== 1)
      throw new Error('Children.only() expects only one child.');
    return children[0];
  },
  toArray(children) {
    if (children == null) return [];
    return Array.isArray && Array.isArray(children)
      ? children
      : [].concat(children);
  }
};
export default Children;
