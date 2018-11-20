let isWeb = typeof window === 'object';

let width = window.screen.width;
if (isWeb) {
  width = document.documentElement.clientWidth / 750 * width;
}

const scalingWidth = [ // use width
  110,
  140,
  150,
  170,
  220,
  230,
  240,
  290,
  300,
  360,
  450,
  570,
  580,
  620,
  790
];
const visualStandard = 750;

function find(c, arr) {
  let min = 1000;
  let result = c;
  let fKey = 0;
  arr.forEach((num, key) => {
    let abs = Math.abs(num - c);

    if (abs === 0) {
      result = num;
      fKey = key;
      return false;
    }

    if (min > abs) {
      min = abs;
      result = num;
      fKey = key;
    }
  });

  if (c > result && arr[fKey + 1]) {
    result = arr[fKey + 1];
  }

  if (arr.indexOf(result) > -1) {
    return result;
  }
}

/**
 * @param sWidth
 * @returns {String}
 */
export default function(sWidth, isOSSImg) {
  let isRem = typeof sWidth === 'string' && sWidth.indexOf('rem') > -1;
  let isNum = typeof sWidth === 'number';
  if (isRem || isNum) {
    let xWidth = parseFloat(sWidth, 10);
    let scaling = 1;

    if (isRem) {
      scaling = visualStandard / width;
    }

    let newWidth = find(parseInt(xWidth / scaling, 10), scalingWidth);
    if (newWidth) {
      if (isOSSImg) {
        return '_' + newWidth + 'w';
      } else {
        return newWidth + 'x10000';
      }
    }
  }

  return '';
}
