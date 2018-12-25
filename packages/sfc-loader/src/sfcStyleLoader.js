const { stringifyRequest } = require('loader-utils');

module.exports = function() {};

module.exports.pitch = function(remainingRequest) {
  const request = stringifyRequest(this, '!!' + remainingRequest);

  return [
    'var content = require(' + request + ');',
    'module.exports = content.toString();'
  ].join('\n');
};
