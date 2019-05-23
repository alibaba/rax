module.exports = function(type) {
  switch (type) {
    case 'weixin':
      return {
        CSS_EXT: '.wxss',
        TEMPLATE_EXT: '.wxml',
        CONFIG_EXT: 'json'
      };
    case 'ali':
    default:
      return {
        CSS_EXT: '.acss',
        TEMPLATE_EXT: '.axml',
        CONFIG_EXT: 'json'
      };
  }
};
