import { debug, warn } from '../debugger';

/**
 * 提供给 bundle 的 __init_page__ 方法
 */
export function register(pageDescriptor, factory) {
  const { page: pageName } = pageDescriptor;
  debug(`[Reg Page] ${pageName}`);
  setPage(pageName, {
    ...pageDescriptor,
    factory
  });
}

const PAGES = {};

/**
 * 注册页面
 */
export function setPage(pageName, page) {
  if (PAGES[pageName]) {
    warn('reset page', pageName);
  }
  PAGES[pageName] = page;
}

/**
 * 获取页面
 */
export function getPage(pageName, rax) {
  return (
    PAGES[pageName] || {
      page: '$unknown',
      factory: getUnknownPageFactory(rax, {
        message: '找不到页面'
      })
    }
  );
}

import createErrorPage from '../../../packages/error-page';

/**
 * 兜底错误页面
 */
export function getUnknownPageFactory(rax, { message }) {
  const { createElement } = rax;
  return function(module, exports, require) {
    const args = {
      createElement,
      require
    };
    if (message) {
      args.message = message;
    }
    module.exports = () => createErrorPage(args);
  };
}
