import {createElement, Component, render} from 'rax';
import Chart, {Pie, Coord} from 'rax-charts';

class PieDemo extends Component {
  render() {
    const pieData = [
      {a: '1', b: 0.3, c: '1'},
      {a: '1', b: 0.3, c: '2'},
      {a: '1', b: 0.4, c: '3'}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={pieData}>
      <Coord type="polar" inner={0.6} transposed={true} />
      <Pie position="a*b" color="c" inner={0.3} />
    </Chart>;
  }
}

export default PieDemo;
