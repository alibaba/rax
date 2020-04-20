// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default function({ init, mount, ready, unmount }) {
  if (isMiniApp) {
    return {
      didMount() {
        init.apply(this, arguments);
        mount.apply(this, arguments);
        ready.apply(this, arguments);
      },
      didUnmount() {
        unmount.apply(this, arguments);
      }
    };
  } else {
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
      created() {
        init.apply(this, arguments);
      },
      ready() {
        ready.apply(this, arguments);
      }
    };
  }
}
