import {createElement, Component} from 'rax';
import Chart, {Axis, Bar} from 'rax-charts';

class BarRegionDemo extends Component {
  render() {
    const barRegionData = [
      {week: '1', tem: [0, 7]},
      {week: '2', tem: [7, 5]},
      {week: '3', tem: [5, 9.5]},
      {week: '4', tem: [9.5, 14.5]},
      {week: '5', tem: [14.5, 10.2]},
      {week: '6', tem: [10.2, 21.5]},
      {week: '7', tem: [21.5, 25.2]}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={barRegionData} config={{
      tem: {
        tickCount: 5
      }
    }}>
      <Axis name="week" grid={null} />
      <Axis name="tem" />
      <Bar position="week*tem" color="tem" setColorCallback={(tem) => {
        if (tem[1] >= tem[0]) {
          return 'red';
        } else {
          return 'green';
        }
      }} />
    </Chart>;
  }
}

export default BarRegionDemo;
