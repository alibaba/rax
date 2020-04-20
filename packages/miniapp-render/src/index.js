import tool from './util/tool';
import cache from './util/cache';
import Window from './window';
import Document from './document';
import EventTarget from './event/event-target';
import Event from './event/event';

export default {
  createPage(route, config) {
    if (config) cache.setConfig(config);

    const pageId = `p-${tool.getId()}-/${route}`;
    const window = new Window(pageId);
    const nodeIdMap = {};
    const document = new Document(pageId, nodeIdMap);

    cache.init(pageId, {
      window,
      document,
      nodeIdMap
    });

    return {
      pageId,
      window,
      document
    };
  },

  destroyPage(pageId) {
    cache.destroy(pageId);
  },

  createApp() {
    return new Window('app');
  },

  // For miniprogram-element
  $$adapter: {
    cache,
    EventTarget,
    Event,
    tool
  }
};
