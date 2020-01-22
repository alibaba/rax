// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';
import dutyChain from './dutyChain';

export default function({ mount, unmount }) {
  function handleMiniApp() {
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
    } else return null;
  }

  function handleWechatMiniProgram() {
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
    } return null;
  }

  return dutyChain(handleMiniApp, handleWechatMiniProgram);
}
