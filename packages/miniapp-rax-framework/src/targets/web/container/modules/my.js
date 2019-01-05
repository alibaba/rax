/* global EXTERNAL_API */
import * as tabBar from './tabbar';
import navigation from './navigation';

const my = Object.assign({}, tabBar, navigation);

// 用户自定义 api
if (typeof EXTERNAL_API === 'object') {
  Object.assign(my, EXTERNAL_API);
}

export default my;
