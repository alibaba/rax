import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';

class Text extends Component {

  static contextTypes = {
    isInAParentText: PropTypes.bool
  };

  static childContextTypes = {
    isInAParentText: PropTypes.bool
  };

  getChildContext() {
    return {
      isInAParentText: true
    };
  }

  render() {
    let props = this.props;
    let nativeProps = {
      ...props,
      ...{
        style: props.style || {},
      },
    };

    let textString = '';
    if (props.children != null) {
      if (!Array.isArray(props.children)) {
        textString = props.children.toString();
      } else {
        textString = props.children.join('');
      }
    }

    if (props.onPress) {
      nativeProps.onClick = props.onPress;
    }

    if (isWeex) {
      if (props.numberOfLines) {
        nativeProps.style.lines = props.numberOfLines;
      }

      nativeProps.value = textString;

      return <text {...nativeProps} />;
    } else {
      let styleProps = {
        ...styles.initial,
        ...nativeProps.style
      };
      let numberOfLines = props.numberOfLines;
      if (numberOfLines) {
        if (parseInt(numberOfLines) === 1) {
          styleProps.whiteSpace = 'nowrap';
        } else {
          styleProps.display = '-webkit-box';
          styleProps.webkitBoxOrient = 'vertical';
          styleProps.webkitLineClamp = String(numberOfLines);
        }

        styleProps.overflow = 'hidden';
      }

      return <span {...nativeProps} style={styleProps}>{textString}</span>;
    }
  }
}

const styles = {
  initial: {
    border: '0 solid black',
    position: 'relative',
    boxSizing: 'border-box',
    display: 'block',
    flexDirection: 'column',
    alignContent: 'flex-start',
    flexShrink: 0,
    fontSize: 32
  }
};

export default Text;
