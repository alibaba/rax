import {transformPropsAttrsToStyle, renamePropsAttr} from '../parseProps';

export default {

  /**
   * parse w3c attrs to weex module attrs
   *
   * @param {Object} w3c component data
   * @return {Object} weex component data
   */
  parse(component) {
    const {props} = component;

    // modify props
    component.props = transformPropsAttrsToStyle(props, ['width', 'height']);

    return component;
  }
};
