import {isWeex} from 'universal-env';

export default function isISO8Web() {
  let isIn = false;
  if (!isWeex) {
    let r = navigator.userAgent.match(/iphone os ([0-8_]{2})/i);
    if (r && parseInt(r[1]) <= 8) {
      isIn = true;
    }
  }

  return isIn;
};