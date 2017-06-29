import ThreeComponent from './components';

export default function(component) {
  const {type, props} = component;
  const node = ThreeComponent[type].init(props);
  return node;
}
