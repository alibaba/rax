import { createElement, PropTypes } from 'rax';

const themeStyles = {
  base: {
    color: 'rgb(136, 19, 145)',
  },
  dimmed: {
    opacity: 0.6,
  },
};
/**
 * A view for object property names.
 *
 * If the property name is enumerable (in Object.keys(object)),
 * the property name will be rendered normally.
 *
 * If the property name is not enumerable (`Object.prototype.propertyIsEnumerable()`),
 * the property name will be dimmed to show the difference.
 */
const ObjectName = ({ name, dimmed, styles }) => {
  const appliedStyles = {
    ...themeStyles.base,
    ...dimmed ? themeStyles.dimmed : {},
    ...styles,
  };

  return (
    <span style={appliedStyles}>
      {name}
    </span>
  );
};

ObjectName.propTypes = {
  /** Property name */
  name: PropTypes.string,
  /** Should property name be dimmed */
  dimmed: PropTypes.bool,
};

ObjectName.defaultProps = {
  dimmed: false,
};

export default ObjectName;
