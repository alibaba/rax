module.exports = class Expression {
  constructor(descriptor) {
    this.isExpression = true;
    this.descriptor = descriptor || '';
  }

  toString() {
    return this.descriptor;
  }
};
