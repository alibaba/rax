const componentParser = require('./componentParser');
const PageGenerator = require('./PageGenerator');

module.exports = function pageLoader() {
  const callback = this.async();

  const pageGenerator = new PageGenerator(this);
  componentParser.call(this, this.resourcePath).then((contentsTree) => {
    pageGenerator.init(contentsTree);
    pageGenerator.emitPage();
    const source = pageGenerator.getSource();
    callback(null, source);
  });
};
