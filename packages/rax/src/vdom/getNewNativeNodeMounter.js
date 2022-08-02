import Host from './host';
import toArray from '../toArray';

export default function(prevNativeNode) {
  let lastNativeNode = null;

  return (newNativeNode, parent) => {
    const driver = Host.driver;

    prevNativeNode = toArray(prevNativeNode);
    newNativeNode = toArray(newNativeNode);

    // If the new length large then prev
    for (let i = 0; i < newNativeNode.length; i++) {
      let nativeNode = newNativeNode[i];
      if (prevNativeNode[i]) {
        driver.replaceChild(nativeNode, prevNativeNode[i]);
      } else if (lastNativeNode) {
        driver.insertAfter(nativeNode, lastNativeNode);
      } else {
        driver.appendChild(nativeNode, parent);
      }
      lastNativeNode = nativeNode;
    }

    // If the new length less then prev
    for (let i = newNativeNode.length; i < prevNativeNode.length; i++) {
      driver.removeChild(prevNativeNode[i]);
    }
  };
};