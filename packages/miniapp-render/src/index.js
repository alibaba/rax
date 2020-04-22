import tool from './util/tool';
import cache from './util/cache';
import { createWindow } from './window';
import Document from './document';
import EventTarget from './event/event-target';
import Event from './event/event';

export default {
  createPage(pageId, config) {
    if (config) cache.setConfig(config);

    const nodeIdMap = {};
    const window = createWindow();
    const document = new Document(pageId, nodeIdMap);

    cache.setWindow(window);
    cache.init(pageId, {
      document,
      nodeIdMap
    });

    return {
      window,
      document
    };
  },

  destroyPage(pageId) {
    cache.destroy(pageId);
  },

  createApp() {
    const window = createWindow();
    cache.setWindow(window);
    return window;
  },

  // For miniprogram-element
  $$adapter: {
    cache,
    EventTarget,
    Event,
    tool
  }
};
