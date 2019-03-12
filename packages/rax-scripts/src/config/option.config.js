'use strict';

const address = require('address');

/**
 * store options
 */

const optionConfig = {
  type: 'webapp',
  protocol: 'http',
  host: address.ip(),
  dir: process.cwd(),
  debug: false,
  analyzer: false,
  https: false,
  port: 9999,
  publicPath: '/',
  outputPath: 'build',

  setOption: function(options) {
    const realOptions = {};
    for (const key in options) {
      if (typeof options[key] !== 'undefined') {
        realOptions[key] = options[key];
      }
    }

    Object.assign(this, realOptions);

    if (typeof options.https !== 'undefined') {
      this.protocol = options.https ? 'https' : 'http';
    }

    this.port = parseInt(this.port, 10);
  }
};

module.exports = optionConfig;
