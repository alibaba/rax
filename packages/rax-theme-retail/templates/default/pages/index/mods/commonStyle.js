import { isWeex } from 'universal-env';

export function percent(val) {
  return val * 750 / 100;
}

export function textOverflow() {
  if (isWeex) {
    return {
      overflow: 'hidden'
    };
  }
  return {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  };
}

export function center() {
  return {
    justifyContent: 'center',
    alignItems: 'center'
  };
}

export function borderRadius(tl, tr, br, bl) {
  if (arguments.length === 1) {
    tr = br = bl = tl;
  }
  return {
    borderBottomRightRadius: br,
    borderTopLeftRadius: tl,
    borderTopRightRadius: tr,
    borderBottomLeftRadius: bl
  };
}


