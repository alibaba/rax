import {createElement, Component, render} from 'rax';
import Chart, {Area, Axis} from 'rax-charts';

class AreaDemo extends Component {
  render() {
    const areaData = [
      {time: '2016-08-08 00:00:00', tem: 10, city: "beijing"},
      {time: '2016-08-08 00:10:00', tem: 22, city: "beijing"},
      {time: '2016-08-08 00:30:00', tem: 16, city: "beijing"},
      {time: '2016-08-09 00:35:00', tem: 26, city: "beijing"},
      {time: '2016-08-09 01:00:00', tem: 12, city: "beijing"},
      {time: '2016-08-09 01:20:00', tem: 26, city: "beijing"},
      {time: '2016-08-10 01:40:00', tem: 18, city: "beijing"},
      {time: '2016-08-10 02:00:00', tem: 26, city: "beijing"},
      {time: '2016-08-10 02:20:00', tem: 12, city: "beijing"},
      {time: '2016-08-08 00:00:00', tem: 28, city: "newYork"},
      {time: '2016-08-08 00:10:00', tem: 16, city: "newYork"},
      {time: '2016-08-08 00:30:00', tem: 26, city: "newYork"},
      {time: '2016-08-09 00:35:00', tem: 12, city: "newYork"},
      {time: '2016-08-09 01:00:00', tem: 26, city: "newYork"},
      {time: '2016-08-09 01:20:00', tem: 20, city: "newYork"},
      {time: '2016-08-10 01:40:00', tem: 29, city: "newYork"},
      {time: '2016-08-10 02:00:00', tem: 16, city: "newYork"},
      {time: '2016-08-10 02:20:00', tem: 22, city: "newYork"}
    ];

    const areaConfig = {
      time: {
        type: 'timeCat',
        mask: 'yyyy-mm-dd',
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
    }} data={areaData} config={areaConfig}>
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
      <Axis name="tem" />
      <Area position="time*tem" style={{
        opacity: 0.6
      }} shape="smooth" color="city" />
    </Chart>;
  }
}

export default AreaDemo;
