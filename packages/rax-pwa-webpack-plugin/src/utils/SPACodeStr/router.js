
const { getRouterBaseCodeStr } = require('./router.base');
const { getRouterPageAliveCodeStr } = require('./router.pageAlive');

const getRouterCodeStr = (options) => {
  const { pagesConfig } = options;
  const pageNames = Object.keys(pagesConfig);
  let withPageAlive = false;

  for (let i = 0; i < pageNames.length; i++) {
    const pageName = pageNames[i];
    if (pagesConfig[pageName].pageAlive === true) {
      withPageAlive = true;
      break;
    }
  }

  if (withPageAlive) {
    return getRouterPageAliveCodeStr(options);
  } else {
    return getRouterBaseCodeStr(options);
  }
}

module.exports = getRouterCodeStr;