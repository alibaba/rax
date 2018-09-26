const klass = require('./klass');
const events = require('./events');
const bind = require('./bind');
const condition = require('./condition');
const list = require('./list');
const tagName = require('./tagName');
const checked = require('./checked');
const template = require('./template');
const webView = require('./web-view');

module.exports = [checked, klass, events, list, condition, bind, template, tagName, webView];
