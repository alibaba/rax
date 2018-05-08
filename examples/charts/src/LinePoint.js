import {createElement, Component, render} from 'rax';
import Chart, {Line, Point, Axis} from 'rax-charts';

class LinePointDemo extends Component {
  render() {
    const linePointData = [
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

    return <Chart style={{
      width: 750,
      height: 350
    }} data={linePointData} config={{
      time: {
        type: 'timeCat',
        mask: 'yyyy-mm-dd',
        tickCount: 2,
        range: [0, 1]
      },
      tem: {
        tickCount: 5,
        min: 0
      }
    }}>
      <Axis name="time" label={(text, index, total) => {
        let cfg = {
          fill: '#979797',
          font: '14px san-serif',
          offset: 6
        };
        if (index === 0) {
          cfg.textAlign = 'start';
        }
        if (index > 0 && index === total - 1) {
          cfg.textAlign = 'end';
        }
        return cfg;
      }} />
      <Axis name="tem" label={{
        fontSize: 14
      }} />
      <Line position="time*tem" shape="smooth" />
      <Point position="time*tem" />
    </Chart>;
  }
}

export default LinePointDemo;
