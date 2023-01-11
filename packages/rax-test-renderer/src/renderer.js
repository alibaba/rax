import { shared } from 'rax';
import ServerDriver from 'driver-server';
import Serializer from './serializer';

const { Instance, Host } = shared;

// For inject Host init options
Host.driver = ServerDriver;

export default {
  create(element) {
    let container = ServerDriver.createBody();
    let rootInstance = Instance.mount(element, container, {});
    // The field corresponding to node and instance is _r, which you can see in rax/src/vdom/instance
    let renderedComponent = rootInstance.__getRenderedComponent();

    renderedComponent.toJSON = () => {
      return new Serializer(container).toJSON();
    };

    renderedComponent.getInstance = () => {
      return renderedComponent._instance;
    };

    renderedComponent.update = (element) => {
      Instance.mount(element, container, {});
    };

    renderedComponent.unmount = () => {
      let component = Instance.get(container);

      if (!component) {
        return false;
      }

      Instance.remove(container);
      component._internal.unmountComponent();

      return true;
    };

    return renderedComponent;
  }
};
