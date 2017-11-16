const LOCATION_MODULE = '@weex-module/location';
const NAVIGATOR_MODULE = '@weex-module/navigator';

module.exports = function(__weex_require__, location) {
  location.assign = (url) => {
    const weexNavigator = __weex_require__(NAVIGATOR_MODULE);
    weexNavigator.push({
      url,
      animated: 'true',
    }, function(e) {
      // noop
    });
  };

  location.replace = (url) => {
    const weexLocation = __weex_require__(LOCATION_MODULE);
    weexLocation.replace(url);
  };

  location.reload = (forceReload = false) => {
    const weexLocation = __weex_require__(LOCATION_MODULE);
    weexLocation.reload(forceReload);
  };

  return location;
};
