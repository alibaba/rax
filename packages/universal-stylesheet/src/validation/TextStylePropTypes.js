'use strict';

import PropTypes from '../tool/Proptypes';
import ColorPropType from './ColorPropType';

let TextStylePropTypes = Object.assign({}, {
  color: ColorPropType,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  fontStyle: PropTypes.oneOf(['normal', 'italic']),
  fontWeight: PropTypes.oneOf(
    ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  ),
  lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textAlign: PropTypes.oneOf(
    ['auto', 'left', 'right', 'center', 'justify']
  )
});

export default TextStylePropTypes;
