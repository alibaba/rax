'use strict';

// import Dimensions from 'universal-dimensions';
// const {deviceHeight, deviceWidth} = Dimensions.get('window');

// Todo no universal-dimensions reference to iPhone6
const {deviceHeight, deviceWidth} = {deviceWidth: 375, deviceHeight: 667};

const VERTICAL = 1;
const HORIZONTAL = 2;
const SUFFIX = '%';
const PERCENT_PROPS = {
  height: VERTICAL,
  top: VERTICAL,
  bottom: VERTICAL,
  width: HORIZONTAL,
  right: HORIZONTAL,
  left: HORIZONTAL
};

function isPercent(str = '') {
  str = str.toString();
  return str.charAt(str.length - 1) === SUFFIX;
}

// Calc percent to pixels relative to the screen
function calcPercent(prop, value) {
  if (PERCENT_PROPS[prop] && isPercent(value)) {
    let percent = parseInt(value.substring(0, value.length - 1), 10);
    let base = PERCENT_PROPS[prop] === VERTICAL ? deviceHeight : deviceWidth;
    return base * percent / 100;
  }
  return value;
}

export default calcPercent;
