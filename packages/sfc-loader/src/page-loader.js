const { stringifyRequest, getOptions } = require('loader-utils');

module.exports = function() {
  const { pageName } = getOptions(this);
  return `require('@core/page').register({ page: ${JSON.stringify(pageName)} }, function(__module, __exports, __require){
      __module.exports = require(${stringifyRequest(this, this.resourcePath)});
    });`;
};
