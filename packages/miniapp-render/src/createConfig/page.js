import cache from '../utils/cache';
import injectLifeCycle from '../bridge/injectLifeCycle';
import createEventProxy from '../bridge/createEventProxy';
import perf from '../utils/perf';
import createDocument from '../document';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export function getBaseLifeCycles(route) {
  return {
    onLoad(query) {
      // eslint-disable-next-line no-undef
      const app = getApp();
      this.window = cache.getWindow();

      this.pageId = route + '-' + cache.getRouteId(route);
      if (this.pageId === app.__pageId) {
        this.document = cache.getDocument(this.pageId);
      } else {
        this.document = createDocument(this.pageId);
      }

      // In wechat miniprogram web bundle need be executed in first page
      if (!isMiniApp && !app.launched) {
        app.init(this.document);
        app.launched = true;
        // The real app show has passed when init function execute
        app.onShow.call(app, app.__showOptions);
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
      this.renderInfo = this.window.__pagesRenderInfo.find(({ path }) => this.pageId.substring(0, this.pageId.lastIndexOf('-')) === path);

      if (!this.renderInfo && process.env.NODE_ENV === 'development') {
        throw new Error("Could't find target render method.");
      }
      this.renderInfo.setDocument(this.document);
      this.renderInfo.render();
      // Handle update of body
      this.document.body.addEventListener('render', (...tasks) => {
        if (tasks.length > 0) {
          if (this.$batchedUpdates) {
            let callback;
            this.$batchedUpdates(() => {
              tasks.forEach((task, index) => {
                if (index === tasks.length - 1) {
                  callback = () => {
                    if (process.env.NODE_ENV === 'development') {
                      perf.stop('setData');
                    }
                  };
                  this.firstRenderCallback();
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
          } else {
            this.firstRenderCallback(tasks[0]);
            this.setData(tasks[0], () => {
              if (process.env.NODE_ENV === 'development') {
                perf.stop('setData');
              }
            });
          }
        }
      });

      this.window.$$trigger('DOMContentLoaded');
    },
    onShow() {
      if (this.window) {
        // Update pageId
        this.window.__pageId = this.pageId;
        if (!this.firstRender) {
          this.renderInfo && this.renderInfo.setDocument(this.document);
        }
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

      this.document.__unmount && this.document.__unmount(); // Manually unmount component instance
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
  const pageConfig = {
    firstRender: true,
    data: {
      root: {
        children: []
      }
    },
    firstRenderCallback(task) {
      if (this.firstRender) {
        this.firstRender = false;
        const initData = {
          pageId: this.pageId,
          'root.pageId': this.pageId
        };
        if (task) {
          Object.assign(task, initData);
        } else {
          this.setData(initData);
        }
      }
    },
    ...getBaseLifeCycles(route),
    ...createEventProxy()
  };
  // Define page lifecycles, like onReachBottom
  injectLifeCycle(lifeCycles, pageConfig);
  return pageConfig;
};
