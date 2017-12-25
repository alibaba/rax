import render from './render';

function hydrate(element, container, options, callback) {
  // Handle server rendered element
  if (container.childNodes) {
    // Clone childNodes, Because removeChild will causing change in childNodes length
    const childNodes = [...container.childNodes];

    for (let i = 0; i < childNodes.length; i ++) {
      const rootChildNode = childNodes[i];
      container.removeChild(rootChildNode);
    }
  }

  return render(element, container, options, callback); ;
}

export default hydrate;
