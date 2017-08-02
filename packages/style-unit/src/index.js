/**
 * CSS properties which accept numbers but are not in units of "px".
 */
const UNITLESS_NUMBER_PROPS = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  // We make lineHeight default is px that is diff with w3c spec
  // lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // Weex only
  lines: true,
};
const SUFFIX = 'rem';
const REM_REG = /[-+]?\d*\.?\d+rem/g;

// Default 1 rem to 1 px
let defaultRemUnit = 1;

/**
 * Is string contains rem
 * @param {String} str
 * @returns {Boolean}
 */
export function isRem(str) {
  return typeof str === 'string' && str.indexOf(SUFFIX) !== -1;
}

/**
 * Calculate rem to pixels: '1.2rem' => 1.2 * rem
 * @param {String} str
 * @param {Number} rem
 * @returns {number}
 */
export function calcRem(str, remUnit = defaultRemUnit) {
  return str.replace(REM_REG, function(rem) {
    return parseFloat(rem) * remUnit + 'px';
  });
}

export function getRem() {
  return defaultRemUnit;
}

export function setRem(rem) {
  defaultRemUnit = rem;
}

export function isUnitNumber(val, prop) {
  return typeof val === 'number' && !UNITLESS_NUMBER_PROPS[prop];
}

export function convertUnit(val, prop, remUnit = defaultRemUnit) {
  if (prop && isUnitNumber(val, prop)) {
    return val * remUnit + 'px';
  } else if (isRem(val)) {
    return calcRem(val, remUnit);
  }

  return val;
}
