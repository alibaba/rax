# Line 线图

折线图用于显示数据在一个连续的时间间隔或者时间跨度上的变化，它的特点是反映事物随时间或有序类别而变化的趋势。

## 引用

```jsx
import Chart, {Line, Coord, Axis, Point} from 'rax-charts';
```

## 普通折线图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Line, Coord, Axis} from 'rax-charts';

class SimpleLine extends Component {
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
    }} data={lineData} config={lineConfig}>
      <Axis name="time" />
      <Axis name="tem" label={{
        fontSize: 14
      }} />
      <Line position="time*tem" inner={0.3} shape="smooth" />
    </Chart>;
  }
}

render(<SimpleLine />);
```

## 点线图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Line, Point, Axis} from 'rax-charts';

class LinePoint extends Component {
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

render(<LinePoint />);
```

平滑折线图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Line, Axis} from 'rax-charts';

class LineSmooth extends Component {
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
      <Line position="time*tem" color="city" shape="smooth" />
    </Chart>;
  }
}

render(LineSmooth /);
```
