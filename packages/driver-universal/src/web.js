import * as DriverDOM from 'driver-dom';

export default {
  ...DriverDOM,
  createElement(type, props, component) {
    return DriverDOM.createElement(type, props, component, true);
  },
  setStyle(node, style) {
    return DriverDOM.setStyle(node, style, true);
  }
};
