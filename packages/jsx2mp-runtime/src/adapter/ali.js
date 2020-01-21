function getComponentLifecycle({ mount, unmount }) {
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

function getComponentBaseConfig() {
  return {
    props: {},
    events: {}
  };
}

export default {
  getComponentLifecycle,
  getComponentBaseConfig,
};
