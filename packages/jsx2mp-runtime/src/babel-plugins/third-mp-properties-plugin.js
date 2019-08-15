const thirdPlatform = ['wx', 'tt', 'bd'];
module.exports = function({ types: t }) {
  return {
    name: 'third-mp-properties-plugin',
    visitor: {
      MemberExpression(path, state) {
        let platform = state.opts.platform || '';
        if (thirdPlatform.includes(platform)) {
          let node = path.node;
          if (node.property && node.property.name === 'props') {
            node.property.name = 'properties';
          }
        }
      }
    }
  };
};
