# Bar 柱状图

典型的柱状图（又名条形图），使用垂直或水平的柱子显示类别之间的数值比较。其中一个轴表示需要对比的分类维度，另一个轴代表相应的数值。

## 引用

```jsx
import Chart, {Bar, Axis} from 'rax-charts';
```

## 简单柱状图

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Chart, {Bar, Axis} from 'rax-charts';

class SimpleBar extends Component {
  render() {
    const barData = [
      {tem: 10, city: 'tokyo'},
      {tem: 4, city: 'newYork'},
      {tem: 3, city: 'berlin'}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={barData} config={{
      tem: {
        tickCount: 5
      }
    }}>
      <Axis name="city" grid={null} />
      <Axis name="tem" />
      <Bar position="city*tem" color="city" />
    </Chart>;
  }
}

render(<SimpleBar />)
```

## 区间柱状图

```jsx
// demo
import {createElement, Component} from 'rax';
import Chart, {Bar, Axis} from 'rax-charts';

class BarRegion extends Component {
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

render(<BarRegion />);
```
