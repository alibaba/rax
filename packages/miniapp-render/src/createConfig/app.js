// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import { createWindow } from '../window';
import createDocument from '../document';
import cache from '../utils/cache';

export default function(init, config) {
  cache.setConfig(config);
  const appConfig = {
    launched: false,
    onLaunch(options) {
      const window = createWindow();
      cache.setWindow(window);

      // In wechat miniprogram getCurrentPages() length is 0, so web bundle only can be executed in first page
      if (isMiniApp) {
        // Use page route as pageId key word
        // eslint-disable-next-line no-undef
        const currentPageId = `${getCurrentPages()[0].route}-0`;
        const currentDocument = createDocument(currentPageId);
        window.__pageId = currentPageId;

        init(window, currentDocument);
        window._trigger('launch', {
          event: {
            options,
            context: this
          }
        });
      } else {
        this.init = (document) => {
          init(window, document);
          window._trigger('launch', {
            event: {
              options,
              context: this
            }
          });
        };
      }
      this.window = window;
    },
    onShow(options) {
      if (this.window) {
        this.window._trigger('appshow', {
          event: {
            options,
            context: this
          }
        });
      }
    },
    onHide() {
      if (this.window) {
        this.window._trigger('apphide', {
          event: {
            context: this
          }
        });
      }
    },
    onError(err) {
      if (this.window) {
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages() || [];
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.window) {
          currentPage.window._trigger('error', {
            event: err
          });
        }
        this.window._trigger('apperror', {
          event: {
            context: this,
            error: err
          }
        });
      }
    },
    onPageNotFound(options) {
      if (this.window) {
        this.window._trigger('pagenotfound', {
          event: {
            options,
            context: this
          }
        });
      }
    }
  };
  if (isMiniApp) {
    appConfig.onShareAppMessage = function(options) {
      if (this.window) {
        const shareInfo = {};
        this.window._trigger('appshare', {
          event: { options, shareInfo }
        });
        return shareInfo.content;
      }
    };
  }
  return appConfig;
}
