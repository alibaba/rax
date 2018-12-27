const postcss = require('postcss');
// !singlequotes|!doublequotes|!url()|pixelunit
const rpxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;

const defaults = {
  remRatio: 100, // Ref: https://github.com/alibaba/rax/tree/master/packages/rax-server-renderer#config-rem-ratio
};

module.exports = postcss.plugin('postcss-rpx2rem', function(options) {
  var opts = Object.assign({}, defaults, options);
  var remReplace = createRemReplace(
    opts.remRatio
  );

  return function(root) {
    root.walkDecls(function(decl, i) {
      // This should be the fastest test and will remove most declarations
      if (decl.value.indexOf('rpx') === -1) return;
      decl.value = decl.value.replace(rpxRegex, remReplace);
    });

    root.walkAtRules('media', function(rule) {
      if (rule.params.indexOf('rpx') === -1) return;
      rule.params = rule.params.replace(rpxRegex, remReplace);
    });
  };
});

function createRemReplace(remRatio) {
  return function(m, $1) {
    if (!$1) return m;
    let remVal = parseFloat($1) / remRatio;
    return remVal === 0 ? '0' : remVal + 'rem';
  };
}