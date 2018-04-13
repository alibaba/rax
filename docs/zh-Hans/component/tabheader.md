# TabHeader 导航切换 

水平滚动 tab 切换

## 安装

```bash
$ npm install rax-tabheader --save
```

## 引入

```jsx
import TabHeader from 'rax-tabheader';
```


## 属性

| 名称                 | 类型              | 默认值                     | 描述                           |
| :----------------- | :-------------- | :---------------------- | :--------------------------- |
| dataSource         | List            |                         | tab 选项的数据（必填）                |
| renderItem         | Function        |                         | 渲染每项的模板（必填）                  |
| itemWidth          | String/Function | 300rem                  | 可以设置每项固定宽度，也可以通过计算每个宽度不同（必填） |
| renderSelect       | Function        |                         | 选中导航项的模版                     |
| onSelect           | Function        |                         | 选中某一 tab 事件                  |
| selected           | Number          | 0                       | 选中的导航项，从0开始                  |
| type               | String          | 'default-noAnim-scroll' | 导航默认展现样式                     |
| containerStyle     | Object          |                         | 导航默认展现样式                     |
| itemStyle          | Object          |                         | 单个 tab 展现样式                  |
| itemSelectedStyle  | Object          |                         | 单个选中 tab 展现样式                |
| runningBorderStyle | Object          |                         | 下方滑动 border 展现样式             |
| runningBgStyle     | Object          |                         | 滑动背景展现样式                     |


`type` 值对应的展示类型含义
* dropDown-border-scroll 带有下拉的展现形式，带有底边移动动画效果，样式规范遵循 MXUI
* normal-border-scroll 无下拉的展现形式，带有底边移动动画效果，样式规范遵循 MXUI
    * icon-bg-scroll 每一项带有图标的展现形式，带有背景移动动画效果，样式规范遵循 MXUI
    * default-noAnim-scroll 默认可扩展的自定义展现，1.x.x 版本的基本功能
    * normal-border 不可滚动的 tab 选项，带有底边移动动画效果，样式规范遵循 MXUI 
    * icon-bg 每一项带有图标的展现形式，不可横向滚动，带有背景移动动画效果，样式规范遵循 MXUI
    * icon-border 每一项带有图标的展现形式，不可横向滚动，带有背景移动动画效果，样式规范遵循 MXUI
    * default-noAnim 可自由扩展的自定义展现形式，不可横向滚动（暂未实现）

## 方法

| 名称             | 参数     | 返回值  | 描述                                   |
| :------------- | :----- | :--- | :----------------------------------- |
| select         | n      | /    | 选择第n个导航项目（这会触发onSelect事件）            |
| selectInternal | n      | /    | 选择第n个导航项目（不会触发onSelect事件），一般用于同步导航状态 |
| scrollTo       | Object | /    | 设置水平滚动位置，参数示例：{x:'100rem'}           |

## 完整调用示例

<img src="https://img.alicdn.com/tps/TB1F3jjKVXXXXX1XpXXXXXXXXXX-392-61.gif" alt="图片名称" align=center />

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TabHeader from 'rax-tabheader';

const styles = {
  container: {
    width: 750
  }
};

class App extends Component {
  renderItem = (item, index) => {
    return <View><Text>{item}</Text></View>;
  }
  renderSelect = (item, index) => {
    return <View><Text>{item}</Text></View>;
  }
  onSelect = (index) => {
    // do something
  }
  itemWidth = (item, index) => {
    return (item.length * 50 + 50) + 'rem';
  }
  
  render() {
    return (
      <TabHeader 
        style={styles.container} 
        dataSource={['tab1','tab2','tab3','tab4']} 
        renderItem={this.renderItem} 
        renderSelect={this.renderSelect} 
        onSelect={this.onSelect}
        selected={0}
        itemWidth={this.itemWidth}
      />
    );
  }
}

render(<App />);
```

## 简单调用示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TabHeader from 'rax-tabheader';

const styles = {
  container: {
    width: 750
  }
};

class App extends Component {
  renderItem = (item, index) => {
    return <View><Text>{item}</Text></View>;
  }
  
  render() {
    return (
      <TabHeader 
        dataSource={['tab1','tab2','tab3','tab4']} 
        renderItem={this.renderItem} 
        itemWidth="150rem"
      />
    );
  }
}

render(<App />);
```

## 通过方法改变 tab 选项

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TabHeader from 'rax-tabheader';

const styles = {
  container: {
    width: 750
  }
};

class App extends Component {
  renderItem = (item, index) => {
    return <View><Text>{item}</Text></View>;
  }
  
  componentDidMount() {
    this.refs.tabHeader.select(0);
  }
  
  render() {
    return (
      <TabHeader 
        ref="tabHeader"
        dataSource={['tab1','tab2','tab3','tab4']} 
        renderItem={this.renderItem} 
        itemWidth='150rem'
      />
    );
  }
}

render(<App />);
```
