import CODE128 from './CODE128.js';

class CODE128B extends CODE128 {
  constructor(string, options) {
    super(String.fromCharCode(209) + string, options);
  }

  valid() {
    return this.data.search(/^[\x20-\x7F\xC8-\xCF]+$/) !== -1;
  }
}

export default CODE128B;
