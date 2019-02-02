import { shared } from 'rax';

const { Instance } = shared;

export default function unmountComponentAtNode(node) {
  let component = Instance.get(node);

  if (!component) {
    return false;
  }

  Instance.remove(node);
  component._internal.unmountComponent();

  return true;
};
