import {createElement, Component, PropTypes, findDOMNode} from 'rax';
import {isWeex} from 'universal-env';
import * as Gcanvas from 'gcanvas.js';

class Canvas extends Component {
  getContext = (type) => {
    const canvas = findDOMNode(this.refs.canvas);
    if (isWeex) {
      this._canvasHolder = Gcanvas.enable(this.refs.canvas, {bridge: Gcanvas.WeexBridge});
      return this._canvasHolder.getContext(type);
    } else {
      if (canvas && canvas.getContext) {
        const context = canvas.getContext(type);
        context.render = () => {
        };
        return context;
      }
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

Canvas.createImage = () => {
  if (isWeex) {
    return new Gcanvas.Image();
  } else {
    return new Image();
  }
};

export default Canvas;