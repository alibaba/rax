import {Component, createElement} from 'rax';
import View from 'rax-view';

let defaultWidth = 750;

class Col extends Component {
  render() {
    if (this.props.sm) {
      styles.initial.flex = '';
      styles.initial.float = 'left';
      styles.initial.width = defaultWidth / 12 * this.props.sm;
    }

    let style = {
      ...styles.initial,
      ...this.props.style
    };

    let children = this.props.children;
    let length = children.length;

    if (length) {
      return (
        <View {...this.props} style={style} />
      );
    } else {
      // if only one child, return this child
      children.props.style = {
        ...styles.initial,
        ...this.props.style,
        ...children.props.style,
        ...{
          'width': '1%', // only for web (Partial Android device column width is not the same problem)
        },
      };
      return children;
    }
  }
}

const styles = {
  initial: {
    'flex': 1,
  }
};

export default Col;
