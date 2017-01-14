import path from 'path';
import parser from './parserHTML';
import loaderUtils from 'loader-utils';

module.exports = function(content) {
  this.cacheable();
  const query = loaderUtils.parseQuery(this.query);
  const type = query.type;
  const filename = path.basename(this.resourcePath);
  const parts = parser(content);
  let part = parts[type];

  if (Array.isArray(part)) {
    part = part[query.index];
  }

  this.callback(null, part.content, type === 'script' ? undefined : parts);
};
