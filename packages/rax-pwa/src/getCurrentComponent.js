import isMatched from './isMatched';

function getCurrentComponent(pagesConfig, withSSR) {
  let currentComponent = null;
  const pageNames = Object.keys(pagesConfig);

  for (let i = 0; i < pageNames.length; i++) {
    const currentPage = pagesConfig[pageNames[i]];
    if (isMatched( withSSR ? 'history' : 'hash', currentPage.regexp, pageNames[i])) {
      currentComponent = currentPage.component;
      break;
    }
  }

  if (currentComponent === null) {
    return function() {
      return new Promise((resolve) => {
        resolve(null);
      });
    };
  }


  return currentComponent;
}

export default getCurrentComponent;


