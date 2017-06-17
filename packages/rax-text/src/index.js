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
    const props = this.props;
    let {children} = props;
    if (!Array.isArray(children)) {
      children = [children];
    }

    let nested = false;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child && typeof child === 'object') {
        nested = true;
        break;
      }
    }

    return nested ? this.renderRichText() : this.renderText();
  }

  renderText = () => {
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

    if (this.context.isInAParentText) {
      return <span {...nativeProps}>{textString}</span>;
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
        ...styles.span,
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
  };

  renderRichText = () => {
    const props = this.props;
    let {children} = props;

    const nativeProps = {
        ...props,
        ...{
        style: props.style || {},
      }
    };
    const styleProps = {
      ...styles.p,
      ...nativeProps.style
    };

    if (isWeex) {
      children = transformChildren(children, this);
    }

    return <p {...nativeProps} style={styleProps}>{children}</p>;
  };
}

function transformChild(child, instance) {
  const {type, props} = child;
  const {children} = props

  if (typeof type === 'function') {
    let childInstance = new type();
    childInstance.props = props;
    if (children) {
      childInstance.props.children = transformChildren(children, instance);
    }
    childInstance.context = instance.getChildContext();

    return childInstance.render();
  } else {
    return child;
  }
}

function transformString(child) {
  return child;
}

function transformChildren(children, instance) {
  let elements = [];
  if (!Array.isArray(children)) {
    children = [children];
  }

  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if (typeof child === 'string') {
      elements.push(transformString(child));
    } else if (typeof child === 'object') {
      elements.push(transformChild(child, instance));
    }
  }

  return elements;
}

const styles = {
  span : {
    border: '0 solid black',
    position: 'relative',
    boxSizing: 'border-box',
    display: 'block',
    flexDirection: 'column',
    alignContent: 'flex-start',
    flexShrink: 0,
    fontSize: 32
  },
  p: {
    marginTop: 0,
    marginBottom: 0
  }
};

export default Text;
