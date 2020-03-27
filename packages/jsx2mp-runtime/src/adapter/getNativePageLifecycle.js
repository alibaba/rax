// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
import { setRoutes } from '../router';

export default function({ mount, unmount, show, hide }) {
  // For quickapp
  if (isQuickApp) {
    return {
      onInit() {
        mount.apply(this, arguments);
        // cache global info to be align with universal-device
        const system = require('@system.device');
        system.getInfo({
          success: (res) => {
            global.globalSystemInfo = Object.assign({
              appName: 'QuickApp',
              appVersion: res.osVersionCode,
              platform: 'Android'
            }, res);
          },
          fail: () => {
            global.globalSystemInfo = {};
          }
        });
      },
      onReady() {}, // noop
      onDestroy() {
        unmount.apply(this, arguments);
      },
      onShow() {
        const routes = this.$app.$def.globalRoutes || {};
        // rewrite global router，avoid overriding when page inited
        setRoutes(routes);
        show.apply(this, arguments);
      },
      onHide() {
        hide.apply(this, arguments);
      }
    };
  } else {
    return {
      onLoad() {
        mount.apply(this, arguments);
      },
      onReady() {}, // noop
      onUnload() {
        unmount.apply(this, arguments);
      },
      onShow() {
        show.apply(this, arguments);
      },
      onHide() {
        hide.apply(this, arguments);
      }
    };
  }
}
