// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isQuickapp } from 'universal-env';

export default function({ mount, unmount }) {
  // For alibaba miniapp
  if (isMiniApp) {
    return {
      didMount() {
        mount.apply(this, arguments);
      },
      didUpdate() {}, // noop
      didUnmount() {
        unmount.apply(this, arguments);
      },
    };
  }

  // For wechat miniprogram
  if (isWeChatMiniProgram) {
    function attached() {
      return mount.apply(this, arguments);
    }

    function detached() {
      return unmount.apply(this, arguments);
    }

    return {
      lifetimes: {
        attached,
        detached,
      },
      // Keep compatibility to wx base library version < 2.2.3
      attached,
      detached,
    };
  }

  // For quickapp
  if (isQuickapp) {
    return {
      onInit() {
        mount.apply(this, arguments);
      },
      onReady() {}, // noop
      onShow() {}, // noop
      onHide() {}, // noop
      onDestroy() {
        unmount.apply(this, arguments);
      },
    };
  }
}
