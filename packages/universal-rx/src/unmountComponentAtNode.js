import instance from './vdom/instance';

export default function unmountComponentAtNode(node) {
  let component = instance.get(node);

  if (!component) {
    return false;
  }

  instance.remove(node);
  component._internal.unmountComponent();

  return true;
};
