import CODE128 from './CODE128.js';

class CODE128A extends CODE128 {
  constructor(string, options) {
    super(String.fromCharCode(208) + string, options);
  }

  valid() {
    return this.data.search(/^[\x00-\x5F\xC8-\xCF]+$/) !== -1;
  }
}

export default CODE128A;
