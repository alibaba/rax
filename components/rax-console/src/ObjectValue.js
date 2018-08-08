import { createElement, PropTypes } from 'rax';

const themeStyles = {
  objectValueNull: {
    color: 'rgb(128, 128, 128)',
  },
  objectValueUndefined: {
    color: 'rgb(128, 128, 128)',
  },
  objectValueRegExp: {
    color: 'rgb(196, 26, 22)',
  },
  objectValueString: {
    color: 'rgb(196, 26, 22)',
  },
  objectValueSymbol: {
    color: 'rgb(196, 26, 22)',
  },
  objectValueNumber: {
    color: 'rgb(28, 0, 207)',
  },
  objectValueBoolean: {
    color: 'rgb(28, 0, 207)',
  },
  objectValueFunctionKeyword: {
    color: 'rgb(170, 13, 145)',
    fontStyle: 'italic',
  },
  objectValueFunctionName: {
    fontStyle: 'italic',
  },
};

/**
 * A short description of the object values.
 * Can be used to render tree node in ObjectInspector
 * or render objects in TableInspector.
 */
const ObjectValue = ({ object, styles }) => {
  const mkStyle = key => ({ ...themeStyles[key], ...styles });

  switch (typeof object) {
    case 'number':
      return (
        <span style={mkStyle('objectValueNumber')}>
          {object}
        </span>
      );
    case 'string':
      return (
        <span style={mkStyle('objectValueString')}>
          {object}
        </span>
      );
    case 'boolean':
      return (
        <span style={mkStyle('objectValueBoolean')}>
          {String(object)}
        </span>
      );
    case 'undefined':
      return <span style={mkStyle('objectValueUndefined')}>undefined</span>;
    case 'object':
      if (object === null) {
        return <span style={mkStyle('objectValueNull')}>null</span>;
      }
      if (object instanceof Date) {
        return (
          <span>
            {object.toString()}
          </span>
        );
      }
      if (object instanceof RegExp) {
        return (
          <span style={mkStyle('objectValueRegExp')}>
            {object.toString()}
          </span>
        );
      }
      if (Array.isArray(object)) {
        return <span>{`Array[${object.length}]`}</span>;
      }
      return (
        <span>
          {object.constructor.name}
        </span>
      );
    case 'function':
      return (
        <span>
          <span style={mkStyle('objectValueFunctionKeyword')}>function</span>
          <span style={mkStyle('objectValueFunctionName')}>
            &nbsp;{object.name}()
          </span>
        </span>
      );
    case 'symbol':
      return (
        <span style={mkStyle('objectValueSymbol')}>
          {object.toString()}
        </span>
      );
    default:
      return <span />;
  }
};

ObjectValue.propTypes = {
  /** the object to describe */
  object: PropTypes.any,
};


export default ObjectValue;