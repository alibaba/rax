// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isQuickApp, isByteDanceMicroApp } from 'universal-env';

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
  if (isWeChatMiniProgram || isByteDanceMicroApp) {
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
  if (isQuickApp) {
    return {
      onInit() {
        mount.apply(this, arguments);
      },
      onDestroy() {
        unmount.apply(this, arguments);
      },
    };
  }
}
