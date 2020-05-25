import { createWindow } from '../window';
import cache from '../utils/cache';

export default function(init) {
  return {
    onLaunch(options) {
      const window = createWindow();
      cache.setWindow(window);
      init(window);
      this.window = window;
      this.window.$$trigger('launch', {
        event: {
          options,
          context: this
        }
      });
    },
    onShow(options) {
      if (this.window) {
        this.window.$$trigger('appshow', {
          event: {
            options,
            context: this
          }
        });
      }
    },
    onHide() {
      if (this.window) {
        this.window.$$trigger('apphide', {
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
          currentPage.window.$$trigger('error', {
            event: err
          });
        }
        this.window.$$trigger('apperror', {
          event: {
            context: this,
            error: err
          }
        });
      }
    },
    onPageNotFound(options) {
      if (this.window) {
        this.window.$$trigger('pagenotfound', {
          event: {
            options,
            context: this
          }
        });
      }
    }
  };
}
