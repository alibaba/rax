import cache from '../utils/cache';
import tool from '../utils/tool';
import injectLifeCycle from '../bridge/injectLifeCycle';
import createEventProxy from '../bridge/createEventProxy';
import { createWindow } from '../window';
import perf from '../utils/perf';
import Document from '../document';

// Export for test
export function createPage(internal, config) {
  if (config) cache.setConfig(config);

  const nodeIdMap = {};
  const window = createWindow();
  const document = new Document(internal, nodeIdMap);

  cache.setWindow(window);
  cache.init(internal.pageId, {
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
      const { window, document } = createPage(this, config);
      this.window = window;
      this.document = document;
      this.query = query;
      this.firstRender = true;
      // Update location page options
      this.window.history.location.__updatePageOption(query);
      // Set __pageId to global window object
      this.window.__pageId = this.pageId;
      // Remove rax inited flag
      this.window.__RAX_INITIALISED__ = false;

      // Handle update of body
      this.document.body.addEventListener('render', (...tasks) => {
        if (tasks.length > 0) {
          if (this.$batchedUpdates) {
            if (this.firstRender) {
              this.firstRender = false;
              this.setData({
                [tasks[0].path]: [tasks[0].item]
              }, () => {
                this.window.$$trigger('load');
                this.window.$$trigger('pageload', { event: query });
              });
            } else {
              let callback;
              this.$batchedUpdates(() => {
                tasks.forEach((task, index) => {
                  if (index === tasks.length - 1) {
                    callback = () => {
                      if (process.env.NODE_ENV === 'development') {
                        perf.stop('setData');
                      }
                    };
                  }
                  if (task.type === 'children') {
                    const spliceArgs = [task.start, task.deleteCount];
                    this.$spliceData({
                      [task.path]: task.item ? spliceArgs.concat(task.item) : spliceArgs
                    }, callback);
                  } else {
                    this.setData({
                      [task.path]: task.value
                    }, callback);
                  }
                });
              });
            }
          } else {
            this.setData(tasks[0], () => {
              if (process.env.NODE_ENV === 'development') {
                perf.stop('setData');
              }
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
      this.app && this.app.unmount(); // Manually unmount component instance

      cache.destroy(this.pageId);

      this.pageId = null;
      this.window = null;
      this.document = null;
      this.query = null;
    }
  };
}

export default function(init, config, lifeCycles = []) {
  const pageId = `p-${tool.getId()}`;
  const pageConfig = {
    data: {
      pageId,
      root: {
        children: []
      }
    },
    ...getBaseLifeCycles(init, config),
    ...createEventProxy(pageId)
  };
  // Define page lifecycles, like onReachBottom
  injectLifeCycle(lifeCycles, pageConfig);
  return pageConfig;
};
