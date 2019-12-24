import * as DriverDOM from 'driver-dom';

// Convert Unitless To Rpx defaultly
export default Object.assign({}, DriverDOM, {
  createElement(type, props, component) {
    return DriverDOM.createElement(type, props, component, true);
  },
  setStyle(node, style) {
    return DriverDOM.setStyle(node, style, true);
  }
});
