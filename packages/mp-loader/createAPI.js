import my from 'my-api-compat';
import resolvePathname from 'resolve-pathname';

// TODO! remove ref of my-api-compat
const globalModules = typeof self.my === 'object' ? self.my : {};

// ATTENTION, exported by commonjs, no need of x.default
module.exports = function createAPI(kwargs) {
  const { currentPath = '' } = kwargs || {};
  const myDelegate = {};

  delegateNavigator(myDelegate, currentPath);

  // black tech
  myDelegate.__proto__ = my;
  my.__proto__ = globalModules;
  return myDelegate;
};


function delegateNavigator(apiObject, currentPath) {
  apiObject.navigateTo = function(navigateOpts = {}) {
    const isURL = /^[\w\d]+:\/\//.test(navigateOpts.url);
    const target = isURL
      ? navigateOpts.url
      : resolvePathname(navigateOpts.url, currentPath);

    my.navigateTo({
      ...navigateOpts,
      url: target,
    });
  };
}
