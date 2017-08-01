# Pie 饼图

饼图广泛得应用在各个领域，用于表示不同分类的占比情况，通过弧度大小来对比各种分类。

## 引用

```jsx
import Chart, {Pie, Coord} from 'rax-charts';
```

## 简单饼图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Pie, Coord} from 'rax-charts';

class SimplePie extends Component {
  render() {
    const pieData = [
      {a: '1', b: 0.3, c: '1'},
      {a: '1', b: 0.3, c: '2'},
      {a: '1', b: 0.4, c: '3'}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={pieData}>
      <Coord type="polar" inner={0.6} transposed={true} />
      <Pie position="a*b" color={['c', ['#00C1DE', '#C1C3C4', '#000000']]} inner={0.3} />
    </Chart>;
  }
}

render(<SimplePie />);
```

## 玫瑰饼图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Pie, Coord} from 'rax-charts';

class PieRose extends Component {
  render() {
    const pieRoseData = [
      {tem: 7, city: 'tokyo'},
      {tem: 4, city: 'newYork'},
      {tem: 3, city: 'berlin'}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={pieRoseData} config={{
      tem: {
        min: 0,
        nice: false
      }
    }}>
      <Coord type="polar" inner={0} transposed={false} />
      <Pie position="city*tem" color="city" />
    </Chart>;
  }
}

render(<PieRose />);
```
