import {setDriver} from '../driver';
import injectComponent from '../vdom/injectComponent';
import instance from '../vdom/instance';
import ServerDriver from '../drivers/server';
import Serializer from '../server/serializer';
import unmountComponentAtNode from '../unmountComponentAtNode';

export default {
  create(element) {
    injectComponent();
    setDriver(ServerDriver);

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
