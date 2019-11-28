import * as DriverWeex from 'driver-weex';
import { convertUnit, setRpx } from 'style-unit';

// Lazy execute overrides.
export default function createWeexDriver() {
  return Object.assign({}, DriverWeex, {
    beforeRender() {
      // Turn off batched updates
      document.open();
      // Init rem unit
      setRpx(1);
    },
    createElement(type, props = {}) {
      const style = {};
      const originStyle = props.style;
      if (originStyle) {
        for (let prop in originStyle) {
          style[prop] = convertUnit(originStyle[prop], prop);
        }
      }
      return DriverWeex.createElement(type, Object.assign({}, props, { style }));
    },
    setStyle(node, style) {
      for (let prop in style) {
        // translate 'rpx' to px
        style[prop] = convertUnit(style[prop], prop);
      }
      DriverWeex.setStyle(node, style);
    }
  });
}
