/**
 * Generate config for miniapp.
 */
module.exports = {
  parse(parsed, code, options) {
    parsed.config = { component: true };
  },
  generate(ret, parsed, options) {
    const config = ret.config = parsed.config;
    if (parsed.usingComponents) {
      config.usingComponents = parsed.usingComponents;
    }
  },
};

