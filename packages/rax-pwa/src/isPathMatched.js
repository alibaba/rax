const isPathMatched = function(type, regexp, pageName) {
  const pathname = window.location.pathname + window.location.search;
  const hash = window.location.hash.replace('#', '');
  if ((type === 'history' && pathname === '/' || type === 'hash' && hash === '/') && pageName === 'index') {
    return true;
  }
  return type === 'hash' ? regexp.test(hash) : type === 'history' && regexp.test(pathname);
};

export default isPathMatched;
