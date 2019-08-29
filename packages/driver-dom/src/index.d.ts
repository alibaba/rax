// Driver spec: https://github.com/alibaba/rax/blob/master/docs/en-US/driver-spec.md
declare namespace Driver {
  function createBody(): void;
  function createEmpty(component: any): void;
  function createText(): void;
  function updateText(node: any, text: any)
  function createElement(type: any, props: any, component: any)
  function appendChild(node: any, parent: any)
  function removeChild(node: any, parent: any)
  function replaceChild(newChild: any, oldChild: any, parent: any)
  function insertAfter(node: any, after: any, parent: any)
  function insertBefore(node: any, before: any, parent: any)
  function addEventListener(node: any, eventName: any, eventHandler: any)
  function removeEventListener(node: any, eventName: any, eventHandler: any)
  function setAttribute(node: any, propKey: any, propValue: any)
  function removeAttribute(node: any, propKey: any)
  function setStyle(node: any, styleObject: any)
}

export default Driver;
