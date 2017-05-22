import {isWeb} from 'universal-env';

function roundToNearestPixel(layoutSize) {
  return Math.round(layoutSize * window.devicePixelRatio) / window.devicePixelRatio;
}

let hairlineWidth = roundToNearestPixel(0.4);
if (hairlineWidth === 0) {
  hairlineWidth = 1 / window.devicePixelRatio;
}

if (isWeb) {
  hairlineWidth = '1px';
}

export default function() {
  return hairlineWidth;
};
