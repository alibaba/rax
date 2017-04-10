import {createElement, Component, PropTypes, findDOMNode} from 'rax';
import {isWeex} from 'universal-env';

let CanvasWeex = null;

if (isWeex) {
  CanvasWeex = require('./canvas.weex');
}

class Canvas extends Component {
  getContext = () => {
    const canvas = findDOMNode(this.refs.canvas);

    if (isWeex) {
      return CanvasWeex.getContext(canvas.ref);
    } else {
      return canvas.getContext('2d');
    }
  };

  render() {
    return <canvas {...this.props} ref="canvas" />;
  }
}

export default Canvas;
