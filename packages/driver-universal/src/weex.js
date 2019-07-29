import * as DriverWeex from 'driver-weex';
import { convertUnit, setRem } from 'style-unit';

const driver = Object.assign({}, DriverWeex, {
  beforeRender() {
    // Turn off batched updates
    document.open();
    // Init rem unit
    setRem( 1 );
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
});

export default driver;
