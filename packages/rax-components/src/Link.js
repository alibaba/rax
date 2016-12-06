import {Component, createElement, PropTypes} from 'rax';
import {isWeex} from 'universal-env';
import Text from './Text';

class Link extends Component {

  static contextTypes = {
    isInAParentLink: PropTypes.bool
  };

  static childContextTypes = {
    isInAParentLink: PropTypes.bool
  };

  getChildContext() {
    return {
      isInAParentLink: true
    };
  }

  render() {
    // https://www.w3.org/TR/html4/struct/links.html#h-12.2.2
    if (this.context.isInAParentLink) {
      return console.error('Nested links are illegal');
    }

    let props = this.props;
    let children = props.children;
    let nativeProps = {...props};

    if (nativeProps.onPress) {
      nativeProps.onClick = nativeProps.onPress;
      delete nativeProps.onPress;
    }

    let content = children;
    if (typeof children === 'string') {
      content = <Text>{children}</Text>;
    }

    if (isWeex) {
      return <a {...nativeProps}>{content}</a>;
    } else {
      let style = {
        ...styles.initial,
        ...nativeProps.style
      };

      return <a {...nativeProps} style={style}>{content}</a>;
    }
  }
}

const styles = {
  initial: {
    textDecoration: 'none'
  }
};

export default Link;
