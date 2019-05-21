module.exports = function(mpType) {
  if (mpType === 'weixin') {
    return {
      CSS_EXT: '.wxss',
      TEMPLATE_EXT: '.wxml',
      CONFIG_EXT: 'json'
    };
  } else {
    return {
      CSS_EXT: '.acss',
      TEMPLATE_EXT: '.axml',
      CONFIG_EXT: 'json'
    };
  }
};
