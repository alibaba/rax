# 区域图

区域图是在折线图的基础之上填充线下区域形成的。

## 引用

```jsx
import Chart, {AreaStack, Area, Axis} from 'rax-charts';
```

## 基本示例

### 简单区域图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Area, Axis} from 'rax-charts';

class SimpleArea extends Component {
  render() {
    const areaData = [
      {time: '2016-08-08 00:00:00', tem: 10, city: 'beijing'},
      {time: '2016-08-08 00:10:00', tem: 22, city: 'beijing'},
      {time: '2016-08-08 00:30:00', tem: 16, city: 'beijing'},
      {time: '2016-08-09 00:35:00', tem: 26, city: 'beijing'},
      {time: '2016-08-09 01:00:00', tem: 12, city: 'beijing'},
      {time: '2016-08-09 01:20:00', tem: 26, city: 'beijing'},
      {time: '2016-08-10 01:40:00', tem: 18, city: 'beijing'},
      {time: '2016-08-10 02:00:00', tem: 26, city: 'beijing'},
      {time: '2016-08-10 02:20:00', tem: 12, city: 'beijing'},
      {time: '2016-08-08 00:00:00', tem: 28, city: 'newYork'},
      {time: '2016-08-08 00:10:00', tem: 16, city: 'newYork'},
      {time: '2016-08-08 00:30:00', tem: 26, city: 'newYork'},
      {time: '2016-08-09 00:35:00', tem: 12, city: 'newYork'},
      {time: '2016-08-09 01:00:00', tem: 26, city: 'newYork'},
      {time: '2016-08-09 01:20:00', tem: 20, city: 'newYork'},
      {time: '2016-08-10 01:40:00', tem: 29, city: 'newYork'},
      {time: '2016-08-10 02:00:00', tem: 16, city: 'newYork'},
      {time: '2016-08-10 02:20:00', tem: 22, city: 'newYork'}
    ];

    const areaConfig = {
      time: {
        type: 'timeCat',
        mask: 'yyyy-mm-dd',
        tickCount: 3,
        range: [0, 1]
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
      <Axis name="tem" />
      <Area position="time*tem" style={{
        opacity: 0.6
      }} shape="smooth" color="city" />
    </Chart>;
  }
}

render(<SimpleArea />);
```

### 重叠区域图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {AreaStack, Axis} from 'rax-charts';

class AreaStackDemo extends Component {
  render() {
    const areaStackData = [
      {month: 12, tem: 7, city: 'tokyo'},
      {month: 1, tem: 6.9, city: 'tokyo'},
      {month: 2, tem: 9.5, city: 'tokyo'},
      {month: 3, tem: 14.5, city: 'tokyo'},
      {month: 4, tem: 18.2, city: 'tokyo'},
      {month: 5, tem: 21.5, city: 'tokyo'},
      {month: 6, tem: 25.2, city: 'tokyo'},
      {month: 7, tem: 26.5, city: 'tokyo'},
      {month: 8, tem: 23.3, city: 'tokyo'},
      {month: 9, tem: 18.3, city: 'tokyo'},
      {month: 10, tem: 13.9, city: 'tokyo'},
      {month: 11, tem: 9.6, city: 'tokyo'},
      {month: 12, tem: 0, city: 'newYork'},
      {month: 1, tem: 0.8, city: 'newYork'},
      {month: 2, tem: 5.7, city: 'newYork'},
      {month: 3, tem: 11.3, city: 'newYork'},
      {month: 4, tem: 17, city: 'newYork'},
      {month: 5, tem: 22, city: 'newYork'},
      {month: 6, tem: 24.8, city: 'newYork'},
      {month: 7, tem: 24.1, city: 'newYork'},
      {month: 8, tem: 20.1, city: 'newYork'},
      {month: 9, tem: 14.1, city: 'newYork'},
      {month: 10, tem: 8.6, city: 'newYork'},
      {month: 11, tem: 2.5, city: 'newYork'},
      {month: 12, tem: 2, city: 'berlin'},
      {month: 1, tem: 0.6, city: 'berlin'},
      {month: 2, tem: 3.5, city: 'berlin'},
      {month: 3, tem: 8.4, city: 'berlin'},
      {month: 4, tem: 13.5, city: 'berlin'},
      {month: 5, tem: 17, city: 'berlin'},
      {month: 6, tem: 18.6, city: 'berlin'},
      {month: 7, tem: 17.9, city: 'berlin'},
      {month: 8, tem: 14.3, city: 'berlin'},
      {month: 9, tem: 9, city: 'berlin'},
      {month: 10, tem: 3.9, city: 'berlin'},
      {month: 11, tem: 1, city: 'berlin'}
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

render(<AreaStackDemo />);
```
