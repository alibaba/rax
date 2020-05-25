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

export default function(init, config, lifeCycles = []) {
  const pageConfig = {
    data: {
      pageId: '',
      bodyClass: 'miniprogram-root'
    },
    onLoad(query) {
      this.pageId = `p-${tool.getId()}`;
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
      this.document.documentElement.addEventListener('$$childNodesUpdate', () => {
        const domNode = this.document.body;
        const data = {
          bodyClass: `${domNode.className || ''} miniprogram-root`
        };

        if (data.bodyClass !== this.data.bodyClass) {
          this.setData(data);
        }
      });

      init(this.window, this.document);
      this.setData({
        pageId: this.pageId
      });
      this.app = this.window.createApp();
      this.window.$$trigger('load');
      this.window.$$trigger('pageload', { event: query });
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
      if (this.app && this.app.$destroy) this.app.$destroy();
      this.document.body.$$recycle(); // Recycle DOM node

      cache.destroy(this.pageId);

      this.pageId = null;
      this.window = null;
      this.document = null;
      this.app = null;
      this.query = null;
    }
  };
  // Define page lifecycles
  defineLifeCycle(lifeCycles, pageConfig);
  return pageConfig;
};
