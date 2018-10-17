// from https://github.com/mpvue/mpvue-loader/blob/master/lib/mp-compiler/parse.js
const generate = require('@babel/generator').default;
const babelon = require('babelon');
const kebabCase = require('./kebabCase');

function getImportsMap(metadata) {
  let { importsMap } = metadata;
  const { imports } = metadata.modules;

  if (!importsMap) {
    importsMap = {};
    imports.forEach((m) => {
      m.specifiers.forEach((v) => {
        importsMap[v.local] = m.source;
      });
    });
    metadata.importsMap = importsMap;
  }

  return metadata;
}

// 解析 config
const traverseConfigVisitor = {
  Property: function(path) {
    const k = path.node.key.name || path.node.key.value;
    if (k !== 'config') {
      return;
    }
    path.stop();

    const { metadata } = path.hub.file;
    const { code } = generate(path.node.value, {}, '');
    metadata.config = {
      code,
      node: path.node.value,
      value: babelon.eval(code),
    };

    // path.remove()
  },
};

// config 的遍历器
const configVisitor = {
  ExportDefaultDeclaration: function(path) {
    path.traverse(traverseConfigVisitor);
    path.remove();
  },
  NewExpression: function(path) {
    const { metadata } = path.hub.file;
    const { importsMap } = getImportsMap(metadata);

    const calleeName = path.node.callee.name;
    const isVue = /vue$/.test(importsMap[calleeName]);

    if (!isVue) {
      return;
    }

    const arg = path.node.arguments[0];

    if (!arg) {
      return;
    }

    const v = arg.type === 'Identifier' ? importsMap[arg.name] : importsMap.App;
    metadata.rootComponent = v || importsMap.index || importsMap.main;
  },
};

function parseConfig(babel) {
  return { visitor: configVisitor };
}

// 解析 components
const traverseComponentsVisitor = {
  Property: function(path) {
    if (path.node.key.name !== 'components') {
      return;
    }
    path.stop();

    const { metadata } = path.hub.file;
    const { importsMap } = getImportsMap(metadata);

    // 找到所有的 imports
    const { properties } = path.node.value;
    const components = {};
    properties.forEach((p) => {
      const k = p.key.name || p.key.value;
      const v = p.value.name || p.value.value;

      components[kebabCase(k)] = importsMap[v];
    });

    metadata.components = components;
  },
};

// components 的遍历器
const componentsVisitor = {
  ExportDefaultDeclaration: function(path) {
    path.traverse(traverseComponentsVisitor);
  },
};
function parseComponentsDeps(babel) {
  return { visitor: componentsVisitor };
}

// 解析全局components
let globalComponents = {};
const globalComponentsVisitor = {
  CallExpression(path) {
    const { callee, arguments: args } = path.node;
    const { metadata } = path.hub.file;
    if (!callee.object || !callee.property) {
      return;
    }
    if (callee.object.name === 'Vue' && callee.property.name === 'component') {
      if (!args[0] || args[0].type !== 'StringLiteral') {
        throw new Error('Vue.component() 的第一个参数必须为静态字符串');
      }
      if (!args[1]) {
        throw new Error('Vue.component() 需要两个参数');
      }
      const { importsMap } = getImportsMap(metadata);
      globalComponents[args[0].value] = importsMap[args[1].name];
    }
    metadata.globalComponents = globalComponents;
  },
};

function parseGlobalComponents(babel) {
  return { visitor: globalComponentsVisitor };
}

function clearGlobalComponents() {
  globalComponents = {};
}

module.exports = {
  parseConfig,
  parseComponentsDeps,
  parseGlobalComponents,
  clearGlobalComponents,
};
