import Element from './element';

const leftAttrs = ['id', 'style', 'src', 'tagName', 'textContent', 'dataset', 'attributes', 'nodeId', 'children'];
function simplify(node) {
  for (let attr in node) {
    if (attr.indexOf(leftAttrs) === -1) {
      delete node.attr;
    }
  }
  if (node.style) {
    node.style = {
      ...node.style,
      $_element: null
    }
  }
}

function traverseTree(node, action) {
  if (!node || !node.children) {
    return;
  }
  const copiedNode = Object.assign({}, node);
	const _queue = [];
	_queue.push(copiedNode);
	while (_queue.length) {
		let _curNode = _queue.shift();
		action(_curNode);
		if (_curNode.children.length) {
			_queue = _queue.concat(_curNode.children);
		}
  }
  return copiedNode;
}

class RootElement extends Element {
  $$init(options, tree) {
    super.$$init(options, tree);
    this.pendingRender = false;
    this.renderStacks = [];
  }

  $$destroy() {
    super.$$destroy();
    this.pendingRender = null;
    this.renderStacks = null;
  }

  get _path() {
    return 'root';
  }
  get _root() {
    return this;
  }

  enqueueRender(payload) {
    this.renderStacks.push(payload);
    if (this.pendingRender) return;
    this.executeRender();
  }

  executeRender() {
    this.pendingRender = true;
    setTimeout(() => {
      // perf.start(SET_DATA);
      this.pendingRender = false;
      console.log('this.renderStacks', this.renderStacks);
      // TODO: Process data from array to obj
      // this.renderStacks: [_path, number, number, Element]
      const ElementNode = this.renderStacks[3];
      const simplifiedNode = traverseTree(ElementNode, simplify);
      this.renderStacks[3] = simplifiedNode;
      this.$$trigger('render', { args: this.renderStacks });
      this.renderStacks = [];
    }, 0);
  }
}

export default RootElement;

