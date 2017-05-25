import {createElement, Component, PropTypes, findDOMNode} from 'rax';
import {isWeex} from 'universal-env';

let canvasWeex = null;

if (isWeex) {
  canvasWeex = require('./canvas.weex');
}

class Canvas extends Component {
  getContext = () => {
    const canvas = findDOMNode(this.refs.canvas);

    if (isWeex) {
      return new Promise((resolve, reject) => {
        requestAnimationFrame(() => {
          resolve(canvasWeex.init(canvas));
        });
      });
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
    const {style = {}} = this.props;

    if (isWeex) {
      return <gcanvas {...this.props} ref="canvas" />;
    } else {
      return <canvas {...this.props} width={style.width} height={style.height} ref="canvas" />;
    }
  }
}

export default Canvas;
