const attrs = require('../../../transpiler/transpileModules/attrs');
const style = require('../../../transpiler/transpileModules/style');
const list = require('../../../transpiler/transpileModules/list');
const tagName = require('../../../transpiler/transpileModules/tagName');
const checked = require('../../../transpiler/transpileModules/checked');
const template = require('../../../transpiler/transpileModules/template');
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
