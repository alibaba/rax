import cache from '../utils/cache';
import injectLifeCycle from '../bridge/injectLifeCycle';
import createEventProxy from '../bridge/createEventProxy';
import perf from '../utils/perf';
import createDocument from '../document';

export function getBaseLifeCycles() {
  return {
    onLoad(query) {
      this.window = cache.getWindow();
      this.document = cache.getDocument(this.pageId);
      if (!this.document) {
        this.document = createDocument(this.pageId);
      }
      // Bind page internal to page document
      this.document._internal = this;
      this.query = query;
      // Update location page options
      this.window.history.location.__updatePageOption(query);
      // Set __pageId to global window object
      this.window.__pageId = this.pageId;

      // Find self render function
      // eslint-disable-next-line no-undef
      this.renderInfo = this.window.__pagesRenderInfo.find(({ path }) => getCurrentPages()[0].route === path);

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

      // this.app = this.window.createApp();
      this.window.$$trigger('DOMContentLoaded');
    },
    onShow() {
      if (this.window) {
        // Update pageId
        this.window.__pageId = this.pageId;
        this.renderInfo.setCurrentDocument(this.document);
        this.renderInfo.render();
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

      this.document && this.document.__unmount(); // Manually unmount component instance
      this.document.body.$$recycle(); // Recycle DOM node

      cache.destroy(this.pageId);

      this.pageId = null;
      this.window = null;
      this.document = null;
      this.query = null;
    }
  };
}

export default function(route, lifeCycles = []) {
  const pageId = `${route}-${cache.getRouteId(route)}`;
  const pageConfig = {
    firstRender: true,
    pageId,
    data: {
      pageId,
      root: {
        pageId,
        children: []
      }
    },
    ...getBaseLifeCycles(),
    ...createEventProxy(pageId)
  };
  // Define page lifecycles, like onReachBottom
  injectLifeCycle(lifeCycles, pageConfig);
  return pageConfig;
};
