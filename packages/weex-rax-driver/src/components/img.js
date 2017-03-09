
import * as utils from '../utils';

export default {

  /**
   * parse w3c attrs to weex module attrs
   *
   * @param {Object} w3c component data
   * @return {Object} weex component data
   */
  parse: function(component) {
    let {props} = component;
    component.type = 'image';

    // modify props
    component.props = utils.transformPropsAttrsToStyle(props, ['width', 'height']);

    return component;
  }
};