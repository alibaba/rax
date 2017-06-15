import {transformPropsAttrsToStyle} from '../parseProps';

export default {

  /**
   * parse w3c attrs to weex module attrs
   *
   * @param {Object} w3c component data
   * @return {Object} weex component data
   */
  parse(component) {
    let {props} = component;
    component.type = 'image';

    // modify props
    component.props = transformPropsAttrsToStyle(props, ['width', 'height']);

    return component;
  }
};
