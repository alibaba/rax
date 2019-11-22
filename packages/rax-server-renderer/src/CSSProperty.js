const TRUE = true;

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
export const UNITLESS_NUMBER_PROPS = {
  animationIterationCount: TRUE,
  borderImageOutset: TRUE,
  borderImageSlice: TRUE,
  borderImageWidth: TRUE,
  boxFlex: TRUE,
  boxFlexGroup: TRUE,
  boxOrdinalGroup: TRUE,
  columnCount: TRUE,
  columns: TRUE,
  flex: TRUE,
  flexGrow: TRUE,
  flexPositive: TRUE,
  flexShrink: TRUE,
  flexNegative: TRUE,
  flexOrder: TRUE,
  gridArea: TRUE,
  gridRow: TRUE,
  gridRowEnd: TRUE,
  gridRowSpan: TRUE,
  gridRowStart: TRUE,
  gridColumn: TRUE,
  gridColumnEnd: TRUE,
  gridColumnSpan: TRUE,
  gridColumnStart: TRUE,
  fontWeight: TRUE,
  lineClamp: TRUE,
  lineHeight: TRUE,
  opacity: TRUE,
  order: TRUE,
  orphans: TRUE,
  tabSize: TRUE,
  widows: TRUE,
  zIndex: TRUE,
  zoom: TRUE,

  // SVG-related properties
  fillOpacity: TRUE,
  floodOpacity: TRUE,
  stopOpacity: TRUE,
  strokeDasharray: TRUE,
  strokeDashoffset: TRUE,
  strokeMiterlimit: TRUE,
  strokeOpacity: TRUE,
  strokeWidth: TRUE,
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
const prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(UNITLESS_NUMBER_PROPS).forEach(function(prop) {
  prefixes.forEach(function(prefix) {
    UNITLESS_NUMBER_PROPS[prefixKey(prefix, prop)] = UNITLESS_NUMBER_PROPS[prop];
  });
});
