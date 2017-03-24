const address = require('address');

/**
 * Parst option with process.env and process.args
 * 
 * @return {Object} 
 */
const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const host = process.env.HOST || address.ip();
const port = parseInt(process.env.PORT, 10) || 8080;

module.exports = {
  host: host,
  protocol: protocol,
  port: port
};
