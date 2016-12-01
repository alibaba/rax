'use strict';

import {createStyle, buildStyle} from './createStyle';
import flattenStyle from './flattenStyle';

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export default {
  hairlineWidth: 1,
  absoluteFillObject,

  create: createStyle,
  build: buildStyle,
  flatten: flattenStyle
};
