// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

export function getComponentLifeCycle({ mount, unmount }) {
  if (isMiniApp) {
    return {
      didMount(...args) {
        mount && mount.apply(this, args);
      },
      didUnmount(...args) {
        unmount && unmount.apply(this, args);
      }
    };
  }
  if (isWeChatMiniProgram) {
    return {
      attached(...args) {
        mount && mount.apply(this, args);
      },
      detached(...args) {
        unmount && unmount.apply(this, args);
      }
    };
  }
}
