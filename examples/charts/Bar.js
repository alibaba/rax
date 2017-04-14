import {createElement, Component, render} from 'rax';
import Chart, {Bar, Axis} from 'rax-charts';

class BarDemo extends Component {
  render() {
    const barData = [
      {tem:10,city:"tokyo"},
      {tem:4,city:"newYork"},
      {tem:3,city:"berlin"}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={barData} config={{
      tem: {
        tickCount: 5
      }
    }}>
      <Axis name="city" grid={null} />
      <Axis name="tem" />
      <Bar position="city*tem" color="city" />
    </Chart>;
  }
}

export default BarDemo;
