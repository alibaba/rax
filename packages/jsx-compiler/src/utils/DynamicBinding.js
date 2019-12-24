const genExpression = require('../codegen/genExpression');

let count = 0;

module.exports = class DynamicBinding {
  constructor(prefix) {
    this.prefix = prefix;
    this._map = {};
    this._store = [];
  }

  _generateDynamicName() {
    count++;
    return this.prefix + count;
  }

  _bindDynamicValue({
    expression,
    isDirective
  }) {
    const name = this._generateDynamicName();
    this._store.push({
      name,
      value: expression,
      isDirective
    });
    this._map[count] = {
      expression,
      name
    };
    return name;
  }

  add({
    expression,
    isDirective = false
  }) {
    const keys = Object.keys(this._map);
    if (keys.length === 0) {
      return this._bindDynamicValue({
        expression,
        isDirective
      });
    } else {
      let name;
      keys.some(key => {
        if (genExpression(expression) === genExpression(this._map[key].expression)) {
          name = this._map[key].name;
          return true;
        }
        return false;
      });
      return name ? name : this._bindDynamicValue({
        expression,
        isDirective
      });
    }
  }

  getStore() {
    return this._store;
  }
};
