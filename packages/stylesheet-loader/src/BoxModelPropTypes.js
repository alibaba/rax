'use strict';

import PropTypes from './Proptypes';

const BoxModelPropTypes = {
  width: PropTypes.length,
  height: PropTypes.length,
  minWidth: PropTypes.length,
  minHeight: PropTypes.length,
  maxWidth: PropTypes.length,
  maxHeight: PropTypes.length,
  marginLeft: PropTypes.length,
  marginRight: PropTypes.length,
  marginTop: PropTypes.length,
  marginBottom: PropTypes.length,
  paddingLeft: PropTypes.length,
  paddingRight: PropTypes.length,
  paddingTop: PropTypes.length,
  paddingBottom: PropTypes.length,
  borderWidth: PropTypes.length,
  borderLeftWidth: PropTypes.length,
  borderTopWidth: PropTypes.length,
  borderRightWidth: PropTypes.length,
  borderBottomWidth: PropTypes.length,
  borderStyle: PropTypes.oneOf(['dotted', 'dashed', 'solid']),
  borderRadius: PropTypes.length,
  borderBottomLeftRadius: PropTypes.length,
  borderBottomRightRadius: PropTypes.length,
  borderTopLeftRadius: PropTypes.length,
  borderTopRightRadius: PropTypes.length,
  overflow: PropTypes.oneOf(['hidden', 'visible']),
  position: PropTypes.oneOf(['relative', 'absolute', 'sticky', 'fixed']),
  top: PropTypes.length,
  bottom: PropTypes.length,
  left: PropTypes.length,
  right: PropTypes.length
};

export default BoxModelPropTypes;
