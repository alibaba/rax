/**
 * 
 * navigate	对应 my.navigateTo 的功能	
 * redirect	对应 my.redirectTo 的功能	
 * switchTab	对应 my.switchTab 的功能	
 * navigateBack	对应 my.navigateBack 的功能
 */
const navigator = {
  push(params) {
    const { page, url } = params || {};
    const destination = page || url;
    if (destination !== undefined) {
      postMessage({
        type: 'navigator',
        navigateType: 'navigate',
        navigateTo: destination
      });
      return Promise.resolve(destination);
    } else {
      return Promise.reject(new Error('Destination not defined'));
    }
  },
  redirect(params) {
    postMessage({
      type: 'navigator',
      navigateType: 'redirect',
      navigateTo: params.url,
    });
    return Promise.resolve(params);
  },
  switchTab(params) {
    postMessage({
      type: 'navigator',
      navigateType: 'switchTab',
      navigateTo: params.url,
    });
    return Promise.resolve(params);
  },
  pop(params) {
    postMessage({
      type: 'navigator',
      navigateType: 'navigateBack',
    });
    return Promise.resolve(params);
  },

};

// alias
navigator.navigate = navigator.push;
navigator.navigateBack = navigator.pop;

export default navigator;