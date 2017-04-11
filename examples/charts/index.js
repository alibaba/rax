import {createElement, Component, render} from 'rax';
import Chart, {Area, Color, Coord, Shape, Style, IntervalStack, Defs, Def, Axis, Global} from 'rax-charts';

class Page extends Component {

  render() {
    const circleData = [
      {a: '1', b: 0.3, c: '1'},
      {a: '1', b: 0.3, c: '2'},
      {a: '1', b: 0.4, c: '3'}
    ];

    return <Chart
      id="rax-chart-line-01-demo"
      width={750}
      height={350}
    >
      <Global pixelRatio={2} />
      <Defs data={circleData} />
      <Axis config={false} />
      <Coord type="polar" config={{
        inner: 0.5,
        transposed: true
      }} />
      <IntervalStack position="a*b">
        <Color dim="c" />
      </IntervalStack>
    </Chart>;
  }
}

render(<Page />);
