module.exports = function({ types: t }) {
  return {
    name: 'import-vendor-replace-plugin',
    visitor: {
      ImportDeclaration(path, state) {
        let platform = state.opts.platform || '';
        let node = path.node;
        if (node.source && node.source.type === 'StringLiteral') {
          if (node.source.value.includes('adapter.ali')) {
            let res = node.source.value.replace(/adapter\.ali(\.js)?/g, `adapter.${platform}.js`);
            node.source.value = res;
          }
        }
      }
    }
  };
};
