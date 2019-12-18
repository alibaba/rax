export default function createDOMDriver(driver) {
  return Object.assign({}, driver, {
    createElement(type, props, component) {
      return driver.createElement(type, props, component, true);
    },
    setStyle(node, style) {
      return driver.setStyle(node, style, true);
    }
  });
}
