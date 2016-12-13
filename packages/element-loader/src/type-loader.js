import path from 'path';
import { parser } from './utils';
import loaderUtils from 'loader-utils';

module.exports = function(content) {
  this.cacheable();
  const query = loaderUtils.parseQuery(this.query);
  const filename = path.basename(this.resourcePath);
  const parts = parser(content);
  let part = parts[query.type];
  if (Array.isArray(part)) {
    part = part[query.index];
  }
  this.callback(null, part.content, parts);
};
