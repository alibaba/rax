/* global EXTERNAL_API */
import * as tabBar from './tabbar';
import navigation from './navigation';

const hasOwn = {}.hasOwnProperty;
const my = Object.assign({}, tabBar, navigation);

// 用户自定义 api
if (typeof EXTERNAL_API === 'object') {
  Object.assign(my, EXTERNAL_API);
}

Object.assign(my, {
  canIUse: (params, resolveCallback) => {
    resolveCallback({
      supported: hasOwn.call(my, params.name)
    });
  }
});

export default my;
