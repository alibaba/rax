export default {
  /*
  * Default easing function for scroll animation
  * https://github.com/oblador/angular-scroll (duScrollDefaultEasing)
  */
  scroll(x) {
    if (x < 0.5) {
      return Math.pow(x * 2, 2) / 2;
    }
    return 1 - Math.pow((1 - x) * 2, 2) / 2;
  }
};
