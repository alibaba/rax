const tool = require('./util/tool');
const cache = require('./util/cache');
const Window = require('./window');
const Document = require('./document');
const EventTarget = require('./event/event-target');
const Event = require('./event/event');
const { MINIAPP } = require('./util/constants');


module.exports = {
  createPage(route, config) {
    if (config) cache.setConfig(config);
    const target = config.target || MINIAPP;

    const pageId = `p-${tool.getId()}-/${route}`;
    const window = new Window(pageId, target);
    const nodeIdMap = {};
    const document = new Document(pageId, nodeIdMap, target);

    cache.init(pageId, {
      window,
      document,
      nodeIdMap,
    });

    return {
      pageId,
      window,
      document,
    };
  },

  destroyPage(pageId) {
    cache.destroy(pageId);
  },

  // 开放给 miniprogram-element
  $$adapter: {
    cache,
    EventTarget,
    Event,
    tool,
  },
};
