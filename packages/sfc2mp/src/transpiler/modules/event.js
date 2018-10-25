const { getOption } = require('../../config/cliOptions');

const targetType = getOption('target');

/**
 * Rules:
 *  - wx bindtap bindtouchstart
 *  - ali onTap bindTouchstart
 */

const EVENT_MAP = {
  click: 'tap',
};

/**
 * Eg.
 * events: { click: { value: 'handleClick' } },
 */
function genData(el, state = {}) {
  let data = '';

  if (el.events) {
    Object.keys(el.events).forEach((eventName) => {
      let { value } = el.events[eventName];

      eventName = EVENT_MAP[eventName] || eventName;

      if (targetType === 'ali') {
        eventName = 'on' + eventName.replace(/^(\w)/, m => m.toUpperCase());
      } else if (targetType === 'wx') {
        eventName = 'bind' + eventName;
      }

      if (state.isTemplateDependency) {
        value = state.templateName + '$' + value;
      }

      data += `${eventName}="${value}"`;
    });
  }

  return data;
}

module.exports = {
  genData,
};
