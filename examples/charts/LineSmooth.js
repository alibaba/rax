import {createElement, Component, render} from 'rax';
import Chart, {Line, Axis} from 'rax-charts';

class LineSmoothDemo extends Component {
  render() {
    const lineSmoothData = [
      {time: '1', tem: 10, city: 'beijing'},
      {time: '2', tem: 22, city: 'beijing'},
      {time: '3', tem: 20, city: 'beijing'},
      {time: '4', tem: 26, city: 'beijing'},
      {time: '5', tem: 20, city: 'beijing'},
      {time: '6', tem: 26, city: 'beijing'},
      {time: '7', tem: 28, city: 'beijing'},
      {time: '1', tem: 5, city: 'newYork'},
      {time: '2', tem: 12, city: 'newYork'},
      {time: '3', tem: 26, city: 'newYork'},
      {time: '4', tem: 20, city: 'newYork'},
      {time: '5', tem: 28, city: 'newYork'},
      {time: '6', tem: 26, city: 'newYork'},
      {time: '7', tem: 20, city: 'newYork'}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={lineSmoothData} config={{
      time: {
        tickCount: 7,
        range: [0, 1]
      },
      tem: {
        tickCount: 5,
        min: 0
      }
    }}>
      <Axis name="time" label={(text, index, total) => {
        let cfg = Chart.Util.mix({}, {
          fill: '#979797',
          font: '14px san-serif',
          offset: 6
        });
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
      <Line position="time*tem" color="city" shape="smooth" />
    </Chart>;
  }
}

export default LineSmoothDemo;
