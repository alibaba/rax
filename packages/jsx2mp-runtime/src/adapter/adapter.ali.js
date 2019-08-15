/* global my */

import { getComponentProps, setComponentInstance } from '../updater';

function redirectTo(option) {
  my.redirectTo(option);
}

function navigateTo(option) {
  my.navigateTo(option);
}

function navigateBack(option) {
  my.navigateBack(option);
}

function getComponentLifecycle({ mount, unmount }) {
  return {
    didMount: function() {
      mount.apply(this, arguments);
    },
    didUpdate: function() {

    },
    didUnmount: function() {
      unmount.apply(this, arguments);
    },
  };
}

export default {
  redirectTo,
  navigateTo,
  navigateBack,
  getComponentLifecycle
};
