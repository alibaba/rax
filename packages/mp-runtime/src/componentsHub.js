const components = {};

export function registerComponent(path, component) {
  components[path] = component;
}

export function getComponent(path) {
  return components[path];
}
