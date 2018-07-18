import * as _my from './api';

function factory({ ctx = '' }) {
  const my = Object.create(_my);

  my.canIUse = api => api in _my;

  Object.defineProperty(my, 'navigateTo', {
    get() {
      return options => {
        return _my.navigateTo(options, ctx);
      };
    }
  });

  return my;
}

export default factory;
