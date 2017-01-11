'use strict';

import PropTypes from './PropTypes';

const FlexboxPropTypes = {
  flexDirection: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse' ]),
  flexWrap: PropTypes.oneOf(['wrap', 'nowrap', 'wrap-reverse']),
  justifyContent: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around']),
  alignItems: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch']),
  alignContent: PropTypes.oneOf(['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around']),
  alignSelf: PropTypes.oneOf(['auto', 'flex-start', 'flex-end', 'center', 'stretch'])
};

export default FlexboxPropTypes;
