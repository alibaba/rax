import TinyQueue from 'tinyqueue';

export default class ComponentHeap extends TinyQueue {
  constructor(data = []) {
    super(data, defaultCompare);
  }

  indexOf(item) {
    return this.data.indexOf(item);
  }
}

function defaultCompare(a, b) {
  a = a._internal._mountID;
  b = b._internal._mountID;
  return a < b ? -1 : a > b ? 1 : 0;
}