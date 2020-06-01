import cache from '../utils/cache';
import tool from '../utils/tool';
import defineLifeCycle from '../utils/defineLifeCycle';
import { createWindow } from '../window';
import Document from '../document';

// Export for test
export function createPage(pageId, config) {
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
}

export function getBaseLifeCycles(init, config) {
  return {
    onLoad(query) {
      this.pageId = this.data.pageId;
      const { window, document } = createPage(this.pageId, config);
      this.window = window;
      this.document = document;
      this.query = query;

      // Update location page options
      this.window.history.location.__updatePageOption(query);
      // Set __pageId to global window object
      this.window.__pageId = this.pageId;
      // Remove rax inited flag
      this.window.__RAX_INITIALISED__ = false;

      // Handle update of body
      this.document.body.addEventListener('render', (data) => {
        if (this.$spliceData) {
          if (data[0] === 'root.cn') {
            this.setData({
              root: data[3]
            }, () => {
              this.window.$$trigger('load');
              this.window.$$trigger('pageload', { event: query });
            });
          } else {
            this.$spliceData({
              [data[0]]: data.slice(1)
            });
          }
        }
      });

      init(this.window, this.document);
      this.app = this.window.createApp();
      this.window.$$trigger('DOMContentLoaded');
    },
    onShow() {
      if (this.window) {
        // Update pageId
        this.window.__pageId = this.pageId;
        this.window.$$trigger('pageshow');
        // compatible with original name
        this.window.$$trigger('onShow');
      }
    },
    onHide() {
      if (this.window) {
        this.window.$$trigger('pagehide');
        // compatible with original name
        this.window.$$trigger('onHide');
      }
    },
    onUnload() {
      this.window.$$trigger('beforeunload');
      this.window.$$trigger('pageunload');
      this.document.body.$$recycle(); // Recycle DOM node

      cache.destroy(this.pageId);

      this.pageId = null;
      this.window = null;
      this.document = null;
      this.query = null;
    }
  };
}

export default function(init, config, lifeCycles = []) {
  const pageConfig = {
    data: {
      pageId: `p-${tool.getId()}`,
      root: {}
    },
    ...getBaseLifeCycles(init, config)
  };
  // Define page lifecycles, like onReachBottom
  defineLifeCycle(lifeCycles, pageConfig);
  return pageConfig;
};
