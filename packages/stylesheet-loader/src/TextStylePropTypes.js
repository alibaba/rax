'use strict';

import PropTypes from './PropTypes';

const TextStylePropTypes = {
  fontSize: PropTypes.length,
  fontStyle: PropTypes.oneOf(['normal', 'italic']),
  fontWeight: PropTypes.oneOf(['normal', 'bold', 'lighter', 'bolder', '100', '200', '300', '400', '500', '600', '700', '800', '900']),
  textDecoration: PropTypes.oneOf(['underline', 'line-through']),
  lineHeight: PropTypes.length,
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  lines: PropTypes.integer
};

export default TextStylePropTypes;
