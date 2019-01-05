import * as tabBar from './tabbar';
import navigation from './navigation';

const my = Object.assign({} , tabBar, navigation);

// 用户自定义 api
if (typeof EXTERNAL_API === "object") {
  Object.assign(my, EXTERNAL_API);
}

Object.assign(my, {
  canIUse: (params, resolveCallback, rejectCallback) => {
    resolveCallback({
      supported: my[params.name] ? true : false
    });
  }
});

export default my;