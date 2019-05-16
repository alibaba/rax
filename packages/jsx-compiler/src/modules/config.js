/**
 * Generate config for miniapp.
 */
module.exports = {
  parse(parsed, code, options) {
    const config = parsed.config = { component: true };
    const usingComponents = {};
    for (let [key, value] of parsed.usingComponents) {
      if (value.external) {
        // eg: 'rax-view/lib/miniapp/index'
        usingComponents[value.tagName] = value.from + options.targetAdapter.modulePathSuffix;
      } else {
        usingComponents[value.tagName] = value.from;
      }
    }
    if (Object.keys(usingComponents).length > 0) {
      config.usingComponents = usingComponents;
    }
  },
  generate(ret, parsed, options) {
    ret.config = parsed.config;
  },
};

