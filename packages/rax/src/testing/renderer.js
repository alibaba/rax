import inject from '../inject';
import instance from '../vdom/instance';
import ServerDriver from 'driver-server';
import Serializer from '../server/serializer';
import unmountComponentAtNode from '../unmountComponentAtNode';

// Init
inject({
  driver: ServerDriver
});

export default {
  create(element) {
    let container = ServerDriver.createBody();
    let rootComponent = instance.render(element, container);
    let renderedComponent = rootComponent.getRenderedComponent();

    renderedComponent.toJSON = () => {
      return new Serializer(container).toJSON();
    };

    renderedComponent.getInstance = () => {
      return renderedComponent._instance;
    };

    renderedComponent.update = (element) => {
      instance.render(element, container);
    };

    renderedComponent.unmount = () => {
      unmountComponentAtNode(container);
    };

    return renderedComponent;
  }
};
