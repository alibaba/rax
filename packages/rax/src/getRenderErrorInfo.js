import Host from './vdom/host';

export default function getRenderErrorInfo() {
  const ownerComponent = Host.owner;
  if (ownerComponent) {
    const name = ownerComponent.__getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}
