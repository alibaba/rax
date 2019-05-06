/**
 * Generate config for miniapp.
 */
module.exports = {
  parse(parsed, code, options) {
    const config = parsed.config = { component: true };
    config.usingComponents = Object.keys(parsed.imported).reduce((prev, m) => {
      const current = parsed.imported[m];
      // TODO: add component alias.
    }, {});
  },
  generate(ret, parsed, options) {
    ret.config = parsed.config;
  },
};

