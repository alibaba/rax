'use strict';

import PropTypes from '../tool/Proptypes';
import LayoutPropTypes from './LayoutPropTypes';
import ColorPropType from './ColorPropType';

let ViewStylePropTypes = {
  ...LayoutPropTypes,
  backgroundColor: ColorPropType,
  borderColor: ColorPropType,
  borderTopColor: ColorPropType,
  borderRightColor: ColorPropType,
  borderBottomColor: ColorPropType,
  borderLeftColor: ColorPropType,
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderTopLeftRadius: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  borderBottomLeftRadius: PropTypes.number,
  borderBottomRightRadius: PropTypes.number,
  opacity: PropTypes.number,
  overflow: PropTypes.oneOf(['visible', 'hidden']),
};

export default ViewStylePropTypes;
