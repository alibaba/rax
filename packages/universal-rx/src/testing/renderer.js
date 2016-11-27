import {setDriver} from '../driver';
import render from '../render';
import ServerDriver from '../drivers/server';


function getRenderedHostOrTextFromComponent(component) {
  var rendered;
  while ((rendered = component._renderedComponent)) {
    component = rendered;
  }
  return component;
}

export default {
  create(element) {
    setDriver(ServerDriver);
    let component = render(element);

    component.toJSON = () => {
      var {children, ...props} = component._internal._currentElement.props;
      var childrenJSON = [];
      for (var key in component._internal._renderedChildren) {
        var inst = component._internal._renderedChildren[key];
        inst = getRenderedHostOrTextFromComponent(inst);
        var json = inst.toJSON();
        if (json !== undefined) {
          childrenJSON.push(json);
        }
      }
      var object = {
        type: component._internal._currentElement.type,
        props: props,
        children: childrenJSON.length ? childrenJSON : null,
      };
      return object;
    };

    return component;
  }
}
