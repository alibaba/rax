const attrs = require('../../common/transpileModules/attrs');
const tagName = require('../../common/transpileModules/tagName');
const checked = require('../../common/transpileModules/checked');
const template = require('../../common/transpileModules/template');
const style = require('../../common/transpileModules/style');
const list = require('./list');
const bind = require('./bind');
const key = require('./key');
const condition = require('./condition');
const events = require('./events');
const webView = require('./web-view');

/**
 * @NOTE:
 *   Modules are execed in order.
 *   if you wants to use a:for with `bind`, `condition`,
 *   and other rules at same time, must put `list` rule first.
 */
module.exports = [list, style, events, key, condition, checked, bind, template, tagName, webView, attrs];
