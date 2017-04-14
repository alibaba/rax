import {createElement, Component, render} from 'rax';
import Chart, {AreaStack, Axis} from 'rax-charts';

class AreaStackDemo extends Component {
  render() {
    const areaStackData = [
      {month:12, tem:7,city:"tokyo"},
      {month:1, tem:6.9,city:"tokyo"},
      {month:2, tem:9.5,city:"tokyo"},
      {month:3, tem:14.5,city:"tokyo"},
      {month:4, tem:18.2,city:"tokyo"},
      {month:5, tem:21.5,city:"tokyo"},
      {month:6, tem:25.2,city:"tokyo"},
      {month:7, tem:26.5,city:"tokyo"},
      {month:8, tem:23.3,city:"tokyo"},
      {month:9, tem:18.3,city:"tokyo"},
      {month:10, tem:13.9,city:"tokyo"},
      {month:11, tem:9.6,city:"tokyo"},
      {month:12, tem:0,city:"newYork"},
      {month:1, tem:0.8,city:"newYork"},
      {month:2, tem:5.7,city:"newYork"},
      {month:3, tem:11.3,city:"newYork"},
      {month:4, tem:17,city:"newYork"},
      {month:5, tem:22,city:"newYork"},
      {month:6,tem:24.8,city:"newYork"},
      {month:7,tem:24.1,city:"newYork"},
      {month:8,tem:20.1,city:"newYork"},
      {month:9,tem:14.1,city:"newYork"},
      {month:10,tem:8.6,city:"newYork"},
      {month:11,tem:2.5,city:"newYork"},
      {month:12,tem:2,city:"berlin"},
      {month:1,tem:0.6,city:"berlin"},
      {month:2,tem:3.5,city:"berlin"},
      {month:3,tem:8.4,city:"berlin"},
      {month:4,tem:13.5,city:"berlin"},
      {month:5,tem:17,city:"berlin"},
      {month:6,tem:18.6,city:"berlin"},
      {month:7,tem:17.9,city:"berlin"},
      {month:8,tem:14.3,city:"berlin"},
      {month:9,tem:9,city:"berlin"},
      {month:10,tem:3.9,city:"berlin"},
      {month:11,tem:1,city:"berlin"}
    ];

    const areaStackConfig = {
      month: {
        tickCount: 12
      },
      tem: {
        tickCount: 5
      }
    };

    return <Chart style={{
      width: 750,
      height: 350
    }} data={areaStackData} config={areaStackConfig}>
      <Axis name="time" />
      <Axis name="tem" />
      <AreaStack position="month*tem" style={{
        opacity: 0.6
      }} shape="smooth" color="city" />
    </Chart>;
  }
}

export default AreaStackDemo;
