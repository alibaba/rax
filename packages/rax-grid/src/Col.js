import {Component, createElement} from 'rax';
import View from 'rax-view';

let defaultWidth = 750;

class Col extends Component {
  render() {
    
    let style = {
      flex: 1,
    };
    
    // FIXME: user need sm?
    if (this.props.sm) {
      style.flex = null;
      style.float = 'left';
      style.width = defaultWidth / 12 * Number(this.props.sm);
    }

    let children = this.props.children;

    if (Array.isArray(children)) {
      return (
        <View {...this.props} style={style} />
      );
    } else {
      // If only one child, return this child
      children.props.style = {
        ...style,
        ...this.props.style,
        ...children.props.style,
        width: '1%', // FIXME: why 1% works? only for web (partial Android device column width is not the same problem)
      };
      return children;
    }
  }
}

export default Col;
