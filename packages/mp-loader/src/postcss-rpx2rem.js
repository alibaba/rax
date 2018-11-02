const postcss = require('postcss');
// !singlequotes|!doublequotes|!url()|pixelunit
const rpxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;

const defaults = {
  rootValue: 16,
  unitPrecision: 5,
  minPixelValue: 0
};

module.exports = postcss.plugin('postcss-rpx2rem', function(options) {
  var opts = Object.assign({}, defaults, options);
  var remReplace = createRemReplace(
    opts.rootValue,
    opts.unitPrecision,
    opts.minPixelValue
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

function createRemReplace(rootValue, unitPrecision, minPixelValue) {
  return function(m, $1) {
    if (!$1) return m;
    let pixels = parseFloat($1);
    if (pixels < minPixelValue) return m;
    /**
     * iphone6 font-size = 16
     * 1rpx = .5px
     * 1rem = 16px
     * => 1rpx = 1rem / 32
     */
    let fixedVal = toFixed(pixels / rootValue / 2, unitPrecision);
    return fixedVal === 0 ? '0' : fixedVal + 'rem';
  };
}

function toFixed(number, precision) {
  let multiplier = Math.pow(10, precision + 1);
  let wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}
