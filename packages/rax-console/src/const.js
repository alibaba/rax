export const MESSAGE_TYPE = {
  LOG: 'log',
  DIR: 'dir',
  TABLE: 'table',
  TRACE: 'trace',
  CLEAR: 'clear',
  START_GROUP: 'startGroup',
  START_GROUP_COLLAPSED: 'startGroupCollapsed',
  END_GROUP: 'endGroup',
  ASSERT: 'assert',
  DEBUG: 'debug',
  PROFILE: 'profile',
  PROFILE_END: 'profileEnd',
  // Undocumented in Chrome RDP, but is used for evaluation results.
  RESULT: 'result',
  // Undocumented in Chrome RDP, but is used for input.
  COMMAND: 'command',
  // Undocumented in Chrome RDP, but is used for messages that should not
  // output anything (e.g. `console.time()` calls).
  NULL_MESSAGE: 'nullMessage',
};

export const MESSAGE_LEVEL = {
  LOG: 'log',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
  INFO: 'info'
};

export const FILTERS = {
  CSS: 'css',
  DEBUG: 'debug',
  ERROR: 'error',
  INFO: 'info',
  LOG: 'log',
  NET: 'net',
  NETXHR: 'netxhr',
  TEXT: 'text',
  WARN: 'warn',
};

export const MESSAGE_SOURCE = {
  XML: 'xml',
  CSS: 'css',
  JAVASCRIPT: 'javascript',
  NETWORK: 'network',
  CONSOLE_API: 'console-api',
  STORAGE: 'storage',
  APPCACHE: 'appcache',
  RENDERING: 'rendering',
  SECURITY: 'security',
  OTHER: 'other',
  DEPRECATION: 'deprecation'
};

export const DEFAULT_FILTERS_VALUES = {
  [FILTERS.TEXT]: '',
  [FILTERS.ERROR]: true,
  [FILTERS.WARN]: true,
  [FILTERS.LOG]: true,
  [FILTERS.INFO]: true,
  [FILTERS.DEBUG]: true,
  [FILTERS.CSS]: false,
  [FILTERS.NET]: false,
  [FILTERS.NETXHR]: false,
};

export const DEFAULT_FILTERS = Object.keys(DEFAULT_FILTERS_VALUES)
  .filter(filter => DEFAULT_FILTERS_VALUES[filter] !== false);

export const DEFAULT_FILTERS_RESET = 'DEFAULT_FILTERS_RESET';
export const FILTER_TEXT_SET = 'FILTER_TEXT_SET';
export const FILTER_TOGGLE = 'FILTER_TOGGLE';
export const FILTERS_CLEAR = 'FILTERS_CLEAR';

export const MESSAGES_ADD = 'MESSAGES_ADD';
export const MESSAGES_CLEAR = 'MESSAGES_CLEAR';
export const CONSOLE_CLOSE = 'CONSOLE_CLOSE';