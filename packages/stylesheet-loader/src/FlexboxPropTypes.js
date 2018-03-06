'use strict';

import PropTypes from './PropTypes';

const FlexboxPropTypes = {
  flexDirection: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse' ]),
  flexWrap: PropTypes.oneOf(['wrap', 'nowrap', 'wrap-reverse']),
  justifyContent: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around']),
  alignItems: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),
  alignContent: PropTypes.oneOf(['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around']),
  alignSelf: PropTypes.oneOf(['auto', 'flex-start', 'flex-end', 'center', 'stretch']),
  flex: PropTypes.integer,
  zIndex: PropTypes.integer,
  itemSize: PropTypes.length
};

export default FlexboxPropTypes;
