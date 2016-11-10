import loopStyles from './loopStyles';
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
  absoluteFill: absoluteFillObject,
  absoluteFillObject,

  flatten: flattenStyle,
  create: styles => loopStyles(styles)
};
