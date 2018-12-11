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

module.exports = [key, style, checked, events, list, condition, bind, template, tagName, webView, attrs];
