const documentElementStyle = document.documentElement.style;
const { clientWidth } = document.documentElement;
const isTouchDevice = 'ontouchstart' in window || 'onmsgesturechange' in window;

export function compat() {
  /* HACK: fix safari mobile click events aren't fired https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile */
  if (isTouchDevice) {
    document.documentElement.style.cursor = 'pointer';
  }
  // Set rem
  documentElementStyle.fontSize = clientWidth / 750 * 100 + 'px';
}
