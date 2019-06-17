
const { getRouterBaseCodeStr } = require('./router.base');
const { getRouterPageAliveCodeStr } = require('./router.pageAlive');

const getRouterCodeStr = (options) => {
  /**
   * Router. js for generating SPA
   * Features to be implemented:
   * 1. Generate the page router config and use the dynamic import component after page splitting is turned on
   * 2. when routing switching, you need to process the page component of page alive. 
   *    this part of the component cannot be destroyed. display hidden through display property switching
   * 3. enhance the pros returned by withRouter and add the preload and prerender methods.
   * 4. there are routes where SSR uses history, and if SSR is not turned on, the route using hash is used.
   */

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