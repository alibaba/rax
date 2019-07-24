const postcss = require('postcss');
// !singlequotes|!doublequotes|!url()|pixelunit
const rpxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;

const defaults = {
  viewportWidth: 750,
  viewportUnit: 'vw',
  fontViewportUnit: 'vw',
  unitPrecision: 5,
};

module.exports = postcss.plugin('postcss-rpx2vw', function(options) {
  const opts = Object.assign({}, defaults, options);

  return function(root) {
    root.walkDecls(function(decl, i) {
      // This should be the fastest test and will remove most declarations
      if (decl.value.indexOf('rpx') === -1) return;

      const unit = getUnit(decl.prop, opts);
      decl.value = decl.value.replace(rpxRegex, createRpxReplace(opts, unit, opts.viewportWidth));
    });

    root.walkAtRules('media', function(rule) {
      if (rule.params.indexOf('rpx') === -1) return;

      rule.params = rule.params.replace(rpxRegex, createRpxReplace(opts, opts.viewportUnit, opts.viewportWidth));
    });
  };
});

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);

  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

// transform rpx to vw
function createRpxReplace(opts, viewportUnit, viewportSize) {
  return function(m, $1) {
    if (!$1) return m;
    const pixels = parseFloat($1);
    const parsedVal = toFixed(pixels / viewportSize * 100, opts.unitPrecision);
    return parsedVal === 0 ? '0' : parsedVal + viewportUnit;
  };
}

// get unit, font can also use vmin.
function getUnit(prop, opts) {
  return prop.indexOf('font') === -1 ? opts.viewportUnit : opts.fontViewportUnit;
}
