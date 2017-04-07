import {createElement, Component, render} from 'rax';
import Canvas from 'rax-canvas';

class CanvasSample extends Component {
  componentDidMount() {
    requestAnimationFrame(() => {
      const context = this.refs.raxCanvasDemo.getContext();
      context.fillStyle = 'red';
      context.fillRect(0, 0, 100, 100);
      context.draw && context.draw();
    });
  }

  render() {
    return <Canvas style={{
      width: 750,
      height: 750
    }} ref="raxCanvasDemo" />;
  }
}

render(<CanvasSample />);
