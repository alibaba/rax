import {createElement, Component, render} from 'rax';
import Chart, {Line, Coord, Axis} from 'rax-charts';

class LineDemo extends Component {
  render() {
    const lineData = [
      {time: '2016-08-08 00:00:00', tem: 10},
      {time: '2016-08-08 00:10:00', tem: 22},
      {time: '2016-08-08 00:30:00', tem: 20},
      {time: '2016-08-09 00:35:00', tem: 26},
      {time: '2016-08-09 01:00:00', tem: 20},
      {time: '2016-08-09 01:20:00', tem: 26},
      {time: '2016-08-10 01:40:00', tem: 28},
      {time: '2016-08-10 02:00:00', tem: 20},
      {time: '2016-08-10 02:20:00', tem: 28}
    ];

    const lineConfig = {
      time: {
        type: 'timeCat',
        mask: 'mm／dd',
        tickCount: 3,
        range:[0,1]
      },
      tem: {
        tickCount: 5,
        min: 0
      }
    };

    return <Chart style={{
      width: 750,
      height: 350
    }} data={lineData} config={lineConfig}>
      <Axis name="time" />
      <Axis name="tem" label={{
        fontSize: 14
      }} />
      <Line position="time*tem" inner={0.3} shape="smooth" />
    </Chart>;
  }
}

export default LineDemo;
