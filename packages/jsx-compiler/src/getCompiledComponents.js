module.exports = function(platform) {
  switch (platform) {
    case 'ali':
      return {
        'rax-view': 'view'
      };
    case 'wechat':
      return {
        'rax-view': 'view',
        'rax-text': 'text'
      };
    case 'quickapp':
      return {
        'rax-view': 'div',
      };
  }
};
