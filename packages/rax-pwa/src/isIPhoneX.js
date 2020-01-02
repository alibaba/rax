const isIPhoneX = () => {
  try {
    // 2018 iPhoneX: 812 × 375, iPhoneXS: 812 × 375, iPhone XS Max: 896 × 414, iPhone XR: 896 × 414
    // 2019 iPhone11: 896 x 414, iPhone11 Pro: 812 × 375, iPhone11 Pro Max: 896 × 414
    // Is iPhone and points min-height is 812 can be Identified as iPhoneX like models.
    return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
  } catch (e) {
    return false;
  }
};

export default isIPhoneX;