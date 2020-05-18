import Element from './element';

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
      // this.$$trigger('$$childNodesUpdate', { args: this.renderStacks })
      this.renderStacks = [];
    }, 0);
  }
}

export default RootElement;

