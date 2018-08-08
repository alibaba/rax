import MY from 'my-api-compat';
import resolve from 'resolve-pathname';

// exported by commonjs
module.exports = function createAPI(kwargs) {
  const { currentPath = '' } = kwargs || {};
  const my = {};
  my.navigateTo = function (navigateOpts = {}) {
    const isURL = /^[\w\d]+:\/\//.test(navigateOpts.url)
    const target = isURL ? navigateOpts.url : resolve(navigateOpts.url, currentPath);

    MY.navigateTo({
      ...navigateOpts,
      url: target
    });
  };
  my.__proto__ = MY;
  return my;
}
