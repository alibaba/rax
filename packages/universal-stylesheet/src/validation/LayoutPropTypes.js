'use strict';

import PropTypes from '../tool/Proptypes';

let LayoutPropTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  borderTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderStyle: PropTypes.string,
  borderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderTopWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRightWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderBottomWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderLeftWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  float: PropTypes.oneOf([
    'left',
    'right',
    'none',
    'inherit'
  ]),
  display: PropTypes.oneOf([
    'none',
    'flex',
    'inline-flex',
    'inline-block',
    'block'
  ]),
  position: PropTypes.oneOf([
    'absolute',
    'relative',
    'fixed',
    'static'
  ]),
  flexDirection: PropTypes.oneOf([
    'row',
    'row-reverse',
    'column',
    'column-reverse'
  ]),

  flexWrap: PropTypes.oneOf([
    'wrap',
    'nowrap'
  ]),

  justifyContent: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around'
  ]),

  alignItems: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'stretch'
  ]),

  alignSelf: PropTypes.oneOf([
    'auto',
    'flex-start',
    'flex-end',
    'center',
    'stretch'
  ]),
  flex: PropTypes.number,
  zIndex: PropTypes.number,
  userSelect: PropTypes.string,
};

export default LayoutPropTypes;
