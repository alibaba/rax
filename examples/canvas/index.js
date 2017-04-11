import {createElement, Component, render} from 'rax';
import Canvas from 'rax-canvas';

class CanvasSample extends Component {
  componentDidMount() {
    requestAnimationFrame(() => {
      const context = this.refs.raxCanvasDemo.getContext();
      context.then((context) => {
        context.render();
        context.fillStyle = 'red';
        context.fillRect(0, 0, 100, 100);
        context.render();
      });
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
