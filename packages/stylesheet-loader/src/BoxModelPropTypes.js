'use strict';

import PropTypes from './PropTypes';

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
  borderLeftStyle: PropTypes.oneOf(['dotted', 'dashed', 'solid']),
  borderTopStyle: PropTypes.oneOf(['dotted', 'dashed', 'solid']),
  borderRightStyle: PropTypes.oneOf(['dotted', 'dashed', 'solid']),
  borderBottomStyle: PropTypes.oneOf(['dotted', 'dashed', 'solid']),
  borderStyle: PropTypes.oneOf(['dotted', 'dashed', 'solid']),
  borderRadius: PropTypes.length,
  borderBottomLeftRadius: PropTypes.length,
  borderBottomRightRadius: PropTypes.length,
  borderTopLeftRadius: PropTypes.length,
  borderTopRightRadius: PropTypes.length,
  backgroundImage: PropTypes.string,
  overflow: PropTypes.oneOf(['hidden', 'visible']),
  position: PropTypes.oneOf(['relative', 'absolute', 'sticky', 'fixed']),
  display: PropTypes.oneOf(['block', 'flex', 'inline-flex', 'inline-block', 'inline']),
  top: PropTypes.length,
  bottom: PropTypes.length,
  left: PropTypes.length,
  right: PropTypes.length,
  opacity: PropTypes.number,
  transform: PropTypes.string
};

export default BoxModelPropTypes;
