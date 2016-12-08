import cons from 'consolidate';
import loaderUtils from 'loader-utils';
import HTMLtoJSX from './HTMLtoJSX';

const converter = new HTMLtoJSX({ createClass: false });

module.exports = function(source) {
  this.cacheable && this.cacheable();

  const callback = this.async();
  const query = loaderUtils.parseQuery(this.query);

  // no engine default: html
  if (!cons[query.engine]) {
    return callback(null, getConvertText(source));
  }

  cons[query.engine].render(source, {
    filename: this.resourcePath
  }, (error, html) => {
    return callback(error, getConvertText(html));
  });
};

const getConvertText = (source) => {
  const convert = converter.convert(source);
  return `${convert.outputImportText}module.exports = function(props, context) {return (${convert.output}) };`;
};
