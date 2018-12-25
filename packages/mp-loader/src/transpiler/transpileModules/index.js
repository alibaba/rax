const attrs = require('./attrs');
const key = require('./key');
const style = require('./style');
const events = require('./events');
const bind = require('./bind');
const condition = require('./condition');
const list = require('./list');
const tagName = require('./tagName');
const checked = require('./checked');
const template = require('./template');
const webView = require('./web-view');

/**
 * @NOTE:
 *   Modules are execed in order.
 *   if you wants to use a:for with `bind`, `condition`,
 *   and other rules at same time, must put `list` rule first.
 */
module.exports = [list, style, events, key, condition, checked, bind, template, tagName, webView, attrs];
