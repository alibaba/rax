import { isWeb } from 'universal-env';

const RAXCOMMONPX = 750;
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

// those case must be integer
const INT = {
  fontSize: true
};


export function fixPx(styles) {
  Object.keys(styles).forEach(klass => {
    let klassValue = styles[klass];
    if (typeof klassValue === 'object') {
      Object.keys(klassValue).forEach(item => {
        let prop = klassValue[item];
        if (typeof prop === 'number' && !UNITLESS_NUMBER_PROPS[item]) {
          let num = prop / 720 * RAXCOMMONPX;
          klassValue[item] = !INT[item] ? num : Math.round(num);
        }
      });
    }
  });

  return styles;
}

export function getWebPx(value) {
  if (isWeb && typeof value === 'number') {
    let documentElement = document.documentElement;
    return documentElement.clientWidth / RAXCOMMONPX * value;
  } else {
    return value;
  }
}

// 获取obj对象value, example: key=['a', 'b'], return obj.a.b
export function getValue(obj, key) {
  if (key === undefined) {
    return;
  }
  let keys = Array.isArray(key) ? key : [key];
  return keys.reduce(function(prev, curr) {
    return (prev || {})[curr];
  }, obj);
}

// example: img=['img1', 'img2'] 获取一个数组中随机一张图片
export function getRandomValue(value) {
  if (value === undefined) return '';
  let values = Array.isArray(value) ? value : [value];
  let length = values.length;
  let index = Math.round(Math.random(0, 1) * length) % length;
  return value[index] || {};
}

// offer抹平数据统一
export function Convert(offer = {}) {
  let obj = {};
  obj.offerId = offer.id || '';
  obj.price = parseFloat(offer.price || 0);
  obj.discountPrice = parseFloat(offer.promotionPrice || 0);
  obj.unit = offer.unit || '';
  obj.baseUnit = offer.sellUnit || '';
  obj.offerDetailUrl = offer.detailUrl || '';
  obj.offerTitle = offer.simpleSubject || '';
  obj.offerImage = offer.picUrlOf290x290 || offer.picUrl || '';
  obj.stock = offer.amountOnSale || 0;
  obj.skuCountText = offer.skuCountText || '0种';
  obj.sellOut = offer.sellout || false;
  obj.fromImport = offer.fromImport || false;
  obj.aliWarehouse = offer.isAliWarehouse || false;
  obj.gmvValue = offer.gmvValue || 0;
  obj.moq = offer.quantityBegin || 0;
  obj.cfsShowText = offer.cfsShowText || '';

  return obj;
}

export function multiple(value, count) {
  if (!count) {
    return value;
  }

  return +value * +count;
}

export function combineSpm(href, spm) {
  if (/\.html$|\.htm$/.test(href)) {
    return href + '?' + spm;
  } else {
    return href + '&' + spm;
  }
}