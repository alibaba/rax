# WaterFall 瀑布流组件

weex version v0.11.0+

## 安装

```bash
$ npm install rax-waterfall --save
```

## 引用

```jsx
import WaterFall from 'rax-waterfall';
```

## 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|dataSource|Array||瀑布流数组，需要传入模块高度（必填）|
|renderItem|Function||渲染每项的模板（必填）|
|renderHeader|Function||渲染 header 部分|
|renderFooter|Function||渲染 footer 部分|
|columnWidth|Number||列宽|
|columnCount|Number||列数|
|columnGap|Number||列间距|
|onEndReached|Function||滚动到底部触发事件|
|onEndReachedThreshold|Number||触发懒加载距离|


## 初始化组件

```
let dataSource = [{
  height: 550,
  item: {}
},
{
  height: 624,
  item: {}
},
{
  height: 708,
  item: {}
},
{
  height: 600,
  item: {}
}]

<Waterfall
  columnWidth={150}
  columnCount={4}
  columnGap={50}
  dataSource={dataSource}
  renderHeader={() => {
    return <View style={{width: '750rem', height: '300rem', backgroundColor: 'blue', marginBottom: '20rem'}}>header</View>;
  }}
  renderFooter={() => {
    return <View style={{width: '750rem', height: '300rem', backgroundColor: 'yellow', marginTop: '20rem'}}>footer</View>;
  }}
  renderItem={(item, index) => {
    return <View>{index}</View>;
  }}>
</Waterfall>

```

## 代码演示

```jsx
// demo

import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import RefreshControl from 'rax-refreshcontrol';
import Waterfall from 'rax-waterfall';

let dataSource = [
  { height: 550, item: {} },
  { height: 624, item: {} },
  { height: 708, item: {} },
  { height: 600, item: {} },
  { height: 300, item: {} },
  { height: 100, item: {} },
  { height: 400, item: {} },
  { height: 550, item: {} },
  { height: 624, item: {} },
  { height: 708, item: {} },
  { height: 600, item: {} },
  { height: 300, item: {} },
  { height: 100, item: {} },
  { height: 400, item: {} }
];

class App extends Component {

  state = {
    refreshing: false,
    dataSource: dataSource
  }

  handleRefresh = () => {
    if (this.state.refreshing) {
      return;
    }

    this.setState({
      refreshing: true,
      dataSource: []
    });

    setTimeout(() => {
      this.setState({
        refreshing: false,
        dataSource: dataSource
      });
    }, 500);

  }

  loadMore = () => {
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.concat(dataSource)
      });
    }, 1000);
  }


  render() {
    return (<View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
      <View>first module</View>
      <Waterfall
        columnWidth={150}
        columnCount={4}
        columnGap={50}
        dataSource={this.state.dataSource}
        renderHeader={() => {
          return [
            <RefreshControl
              key="0"
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}>
              <Text>下拉刷新</Text>
            </RefreshControl>,
            <View key="1" style={{width: 750, height: 100, backgroundColor: 'yellow', marginBottom: 20}}>header1</View>,
            <View key="2" style={{width: 750, height: 100, backgroundColor: 'green', marginBottom: 20}}>header2</View>
          ];
        }}
        renderFooter={() => {
          return <View key="3" style={{width: 750, height: 300, backgroundColor: 'blue', marginTop: 20}}>footer1</View>;
        }}
        renderItem={(item, index) => {
          return (<View style={{height: item.height, backgroundColor: 'red', marginBottom: 20}}>
            {index}
          </View>);
        }}
        onEndReached={this.loadMore} />
    </View>);
  }
}

render(<App />);
```



