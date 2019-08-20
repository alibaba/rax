const t = require('@babel/types');

function traverseChildren(children, result) {
  if (Array.isArray(children)) {
    for (let i = 0, l = children.length; i < l; i++) {
      traverseChildren(children[i], result);
    }
  } else if (children.type === 'ArrayExpression' && children.elements) {
    for (let i = 0, l = children.elements.length; i < l; i++) {
      traverseChildren(children.elements[i], result);
    }
  } else {
    result.push(children);
  }
}

function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  let result = [];
  traverseChildren(children, result);

  if (result.length === 1) {
    result = result[0];
  }

  return result;
}

module.exports = function() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;

        if (name === 'createElement') {
          const parentPath = path.findParent((path) => path.isCallExpression());
          if (!parentPath) {
            return;
          }

          const parent = parentPath.node;
          const args = parent.arguments;

          if (!args) {
            return;
          }

          let children;
          const childrenLength = args.length - 2;

          if (childrenLength > 0) {
            if (childrenLength === 1 && !Array.isArray(children)) {
              children = args[3];
            } else {
              let childArray = [];
              if (childrenLength > 1) {
                childArray = new Array(childrenLength);
                for (var i = 0; i < childrenLength; i++) {
                  childArray[i] = args[i + 2];
                }
              }
              children = flattenChildren(childArray);
            }
          }

          if (children && children.length) {
            parent.arguments = [
              args[0],
              args[1],
              t.arrayExpression(children)
            ];
          }
        }
      },
    },
  };
};