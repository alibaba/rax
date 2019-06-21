
function getRouterInitialComponent(pagesConfig, withSSR) {
  let initialComponent = null;
  const pathname = window.location.pathname + window.location.search;
  const hash = window.location.hash;
  const type = withSSR ? 'history' : 'hash';
  const pageNames = Object.keys(pagesConfig);
  const isMatched = function(regexp) {
    return 'hash' === type ? regexp.test(hash.replace('#', '')) : 'history' === type && regexp.test(pathname);
  };

  if (('history' === type && pathname === '/' || 'hash' === type && hash === '#/') && pagesConfig.index) {
    return pagesConfig.index.component;
  }

  for (let i = 0; i < pageNames.length; i++) {
    const currentPage = pagesConfig[pageNames[i]];
    if (isMatched(currentPage.regexp)) {
      initialComponent = currentPage.component;
      break;
    }
  }

  if (initialComponent === null) {
    return function() {
      return new Promise((resolve) => {
        resolve(null);
      });
    };
  }


  return initialComponent;
}

export default getRouterInitialComponent;


