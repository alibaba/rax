import flattenStyle from './flattenStyle';
import getHairlineWidth from './getHairlineWidth';

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export default {
  hairlineWidth: getHairlineWidth(),
  absoluteFillObject,

  flatten: flattenStyle,
  create: styles => styles
};
