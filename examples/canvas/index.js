import {createElement, Component, render} from 'rax';
import Canvas from 'rax-canvas';

class CanvasSample extends Component {
  componentDidMount() {
    const contextPromise = this.refs.raxCanvasDemo.getContext();
    contextPromise.then((context) => {
      context.fillStyle = 'red';
      context.fillRect(0, 0, 100, 100);
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
