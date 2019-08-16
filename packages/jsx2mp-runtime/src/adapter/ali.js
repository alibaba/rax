/* global my */

export function redirectTo(options) {
  my.redirectTo(options);
}

export function navigateTo(options) {
  my.navigateTo(options);
}

export function navigateBack(options) {
  my.navigateBack(options);
}

export function getComponentLifecycle({ mount, unmount }) {
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
