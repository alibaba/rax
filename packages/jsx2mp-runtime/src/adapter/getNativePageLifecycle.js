import { isQuickapp } from 'universal-env';
import { setRoutes } from '../router';

export default function({ mount, unmount, show, hide }) {
  // For quickapp
  if (isQuickapp) {
    return {
      onInit() {
        mount.apply(this, arguments);
      },
      onReady() {}, // noop
      onDestroy() {
        unmount.apply(this, arguments);
      },
      onShow() {
        const routes = this.$app.$def.globalRoutes || {};
        // 重写全局router，避免页面初始化时覆盖
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
