import {createElement, Component} from 'rax';
import Chart, {Axis, Bar} from 'rax-charts';

class BarRegionDemo extends Component {
  render() {
    const barRegionData = [
      {month:'周一',tem:[0, 7]},
      {month:'周二',tem:[7, 5]},
      {month:'周三',tem:[5, 9.5]},
      {month:'周四',tem:[9.5, 14.5]},
      {month:'周五',tem:[14.5, 10.2]},
      {month:'周六',tem:[10.2, 21.5]},
      {month:'周日',tem:[21.5, 25.2]}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={barRegionData} config={{
      tem: {
        tickCount: 5
      }
    }}>
      <Axis name="month" grid={null} />
      <Axis name="tem" />
      <Bar position="month*tem" color="tem" setColorCallback={(tem) => {
        if (tem[1] >= tem[0]) {
          return 'red'
        } else {
          return 'green';
        }
      }} />
    </Chart>;
  }
}

export default BarRegionDemo;
