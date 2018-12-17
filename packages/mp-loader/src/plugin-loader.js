const { getOptions } = require('loader-utils');
const { readFileSync } = require('fs');

const hasOwn = {}.hasOwnProperty;
const pageLoader = require.resolve('./page-loader');
const componentLoader = require.resolve('./component-loader');

const DEFINE_PLUGIN_API = '__DEFINE_PLUGIN_API__';
const DEFINE_PLUGIN_COMPONENT = '__DEFINE_PLUGIN_COMPONENT__';
const DEFINE_PLUGIN_PAGE = '__DEFINE_PLUGIN_PAGE__';

module.exports = function APILoader(content) {
  const options = getOptions(this) || {};
  let loadPluginText = '';
  if (options.pluginConfig) {
    // Watch modification of plugin config.
    this.addDependency(options.pluginConfig);

    const pluginConfig = tryToReadJSON(options.pluginConfig);
    if (pluginConfig.publicComponents) {
      for (let key in pluginConfig.publicComponents) {
        if (hasOwn.call(pluginConfig.publicComponents, key)) {
          const componentPath = pluginConfig.publicComponents[key];
          loadPluginText += generateRegisterPluginComponent(options.pluginName, key, componentPath);
        }
      }
    }

    if (pluginConfig.pages) {
      for (let key in pluginConfig.pages) {
        if (hasOwn.call(pluginConfig.pages, key)) {
          const pagePath = pluginConfig.pages[key];
          const opts = JSON.stringify({
            pageRegister: DEFINE_PLUGIN_PAGE,
            pageDescriptor: {
              pageName: key,
              pluginName: options.pluginName,
            },
          });
          loadPluginText += `require('${pageLoader}?${opts}!${pagePath}');`;
        }
      }
    }
  }

  return `
    ${loadPluginText}
    typeof ${DEFINE_PLUGIN_API} === 'function' && ${DEFINE_PLUGIN_API}(
      { pluginName: '${options.pluginName}' },
      function(__module, exports) {
        __module.exports = require('${this.resourcePath}');
      }
    );`;
};

/**
 * Read JSON without throwing error.
 * @param {String} path to a JSON file.
 * @returns {Object} JavaScript PlainObject or null.
 */
function tryToReadJSON(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (err) {
    console.error('Error while trying to read ' + path, err);
    return null;
  }
}

function generateRegisterPluginComponent(pluginName, componentName, componentPath) {
  return `
    typeof ${DEFINE_PLUGIN_COMPONENT} === 'function' && ${DEFINE_PLUGIN_COMPONENT}(
      { pluginName: '${pluginName}', componentName: '${componentName}' },
      function(module, exports) {
        module.exports = require('${componentLoader}!${componentPath}');
      }
    );
  `;
}
