'use strict';

/* global WXEnvironment */

import {isWeex, isWeb} from 'universal-env';

// TODO: should be custom setting
const FULL_WIDTH = 750;
// TODO: taobao navbar height
const NAVBAR_HEIGHT = 64;
const DEFAULT_SCALE = 2;

function getDimensions() {
  let dimensions = {};
  if (isWeex) {
    let weexEnv = typeof WXEnvironment !== 'undefined' ? WXEnvironment : {};
    let scale = weexEnv.scale || DEFAULT_SCALE;
    dimensions = {
      window: {
        width: FULL_WIDTH,
        height: (weexEnv.deviceHeight - NAVBAR_HEIGHT * scale) * FULL_WIDTH / weexEnv.deviceWidth,
        scale: scale,
        fontScale: 1,
      },
      screen: {
        width: weexEnv.deviceWidth,
        height: weexEnv.deviceHeight,
      },
    };
  } else if (isWeb) {
    let documentElement = document.documentElement;
    dimensions = {
      window: {
        width: FULL_WIDTH,
        height: documentElement.clientHeight * FULL_WIDTH / documentElement.clientWidth,
        scale: window.devicePixelRatio || DEFAULT_SCALE,
        fontScale: 1,
      },
      screen: screen,
    };
  }

  return dimensions;
}

export default class Dimensions {
  static get(dim) {
    return getDimensions()[dim];
  }
}
