'use strict';

const address = require('address');

/**
 * Parst option with process.env and process.args
 *
 * @return {Object}
 */
const protocol = process.env.HTTPS === 'true' || process.env.HTTPS === true ? 'https:' : 'http:';
const host = process.env.HOST || address.ip();
const dir = process.env.DIR || process.cwd();
const debug = process.env.DEBUG === 'true' || process.env.DEBUG === true;
const port = parseInt(process.env.PORT, 10) || 9999;
const publicPath = process.env.PUBLIC_PATH || '/';

module.exports = {
  host,
  protocol,
  port,
  dir,
  debug,
  publicPath
};
