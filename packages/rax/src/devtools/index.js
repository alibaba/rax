import Instance from '../vdom/instance';
import Host from '../vdom/host';
import Reconciler from './reconciler';
import { RENDERED_COMPONENT } from '../constant';

const DevtoolsHook = {
  ComponentTree: {
    getClosestInstanceFromNode(node) {
      return Instance.get(node);
    },
    getNodeFromInstance(inst) {
      // inst is an internal instance (but could be a composite)
      while (inst[RENDERED_COMPONENT]) {
        inst = inst[RENDERED_COMPONENT];
      }

      if (inst) {
        return inst._nativeNode;
      } else {
        return null;
      }
    }
  },
  Mount: {
    get _instancesByReactRootID() {
      const rootComponents = {};

      // Ignore display top-level root component
      for (let rootID in Host.rootComponents) {
        rootComponents[rootID] = Host.rootComponents[rootID][RENDERED_COMPONENT];
      }

      return rootComponents;
    },

    _renderNewRootComponent: Reconciler.renderNewRootComponent
  },
  Reconciler,
  // monitor the info of all components
  monitor: null
};

export default DevtoolsHook;
