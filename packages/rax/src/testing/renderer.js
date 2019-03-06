import inject from '../vdom/inject';
import Instance from '../vdom/instance';
import ServerDriver from 'driver-server';
import Serializer from './serializer';

// Init
inject({
  driver: ServerDriver
});

export default {
  create(element) {
    let container = ServerDriver.createBody();
    let rootComponent = Instance.mount(element, container, {});
    let renderedComponent = rootComponent.getRenderedComponent();

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
