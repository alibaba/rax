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
  lines: true
};
const IS_REM_REG = /\d+(rem|rpx)/;
const REM_REG = /[-+]?\d*\.?\d+(rem|rpx)/g;
const GLOBAL_REM_UNIT = '__global_rem_unit__';
const global =
  typeof window === 'object'
    ? window
    : typeof global === 'object'
      ? global
      : {};

// Default 1 rem to 1 px
if (getRem() === undefined) {
  setRem(1);
}

/**
 * Is string contains rem
 * note: rpx is an alias to rem
 * @param {String} str
 * @returns {Boolean}
 */
export function isRem(str) {
  return IS_REM_REG.test(str);
}

/**
 * Calculate rem to pixels: '1.2rem' => 1.2 * rem
 * @param {String} str
 * @param {Number} rem
 * @param {Boolean} round pixel to integer
 * @returns {String}
 */
export function calcRem(str, remUnit = getRem(), roundPixel = false) {
  return str.replace(REM_REG, function(rem) {
    if (roundPixel) {
      return parseInt(parseFloat(rem) * remUnit, 10) + 'px';
    } else {
      return parseFloat(rem) * remUnit + 'px';
    }
  });
}

export function calcUnitNumber(val, remUnit = getRem(), roundPixel = false) {
  return (roundPixel ? parseInt(val * remUnit, 10) : val * remUnit) + 'px';
}

export function getRem() {
  return global[GLOBAL_REM_UNIT];
}

export function setRem(rem) {
  global[GLOBAL_REM_UNIT] = rem;
}

export function isUnitNumber(val, prop) {
  return typeof val === 'number' && !UNITLESS_NUMBER_PROPS[prop];
}

export function convertUnit(val, prop, remUnit = getRem(), roundPixel = false) {
  if (prop && isUnitNumber(val, prop)) {
    return calcUnitNumber(val, remUnit, roundPixel);
  } else if (isRem(val)) {
    return calcRem(val, remUnit, roundPixel);
  } else {
    return val;
  }
}
