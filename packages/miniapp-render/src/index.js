import tool from './util/tool';
import cache from './util/cache';
import perf from './util/perf';
import constants from './util/constants';
import EventTarget from './event/event-target';
import Event from './event/event';
import createAppConfig from './createConfig/app';
import createPageConfig from './createConfig/page';

export default {
  createAppConfig,

  createPageConfig,

  // For miniprogram-element
  $$adapter: {
    cache,
    EventTarget,
    Event,
    tool,
    perf,
    constants
  }
};
