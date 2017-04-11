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
      return CanvasWeex.init(canvas);
    } else {
      return new Promise((resolve, reject) => {
        if (canvas && canvas.getContext) {
          const context = canvas.getContext('2d');
          context.render = () => {};
          resolve(context);
        }
      });
    }
  };

  render() {
    if (isWeex) {
      return <gcanvas {...this.props} ref="canvas" />;
    } else {
      return <canvas {...this.props} ref="canvas" />;
    }
  }
}

export default Canvas;
