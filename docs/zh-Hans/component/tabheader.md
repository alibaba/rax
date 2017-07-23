# TabHeader 导航切换 

水平滚动 tab 切换，通过设置 type 类型可以展现不同的默认展现效果。

![](https://gw.alicdn.com/tfs/TB1dtHMRVXXXXcYaXXXXXXXXXXX-255-433.gif)

## 安装

```bash
$ npm install rax-tabheader --save
```

## 引用

```jsx
import TabHeader from 'rax-tabheader';
```


## 属性

| 名称                 | 类型              | 默认值                     | 描述                           |
| :----------------- | :-------------- | :---------------------- | :--------------------------- |
| dataSource         | Array            |                         | tab 选项的数据（必填）                |
| renderItem         | Function        |                         | 渲染每项的模板（必填）                  |
| itemWidth          | String | Function | 300                  | 可以设置每项固定宽度，也可以通过计算每个宽度不同（必填） |
| renderSelect       | Function        |                         | 选中导航项的模版                     |
| onSelect           | Function        |                         | 选中某一 tab 事件                  |
| selected           | Number          | 0                       | 选中的导航项，从0开始                  |
| type               | String          | 'default-noAnim-scroll' | 导航默认展现样式                     |
| containerStyle     | Object          |                         | 导航默认展现样式                     |
| itemStyle          | Object          |                         | 单个 tab 展现样式                  |
| itemSelectedStyle  | Object          |                         | 单个选中 tab 展现样式                |
| animBuoyStyle | Object          |                         | 滑动色块展现样式             |
| dropDownCols | Number          |                         | 下拉列表的列数             |

注意：

* 当选择带有底部滑动边框或者背景滑块的 `type` 时，renderItem、renderSelect 不用传入
* 当选择 dropDown-border-scroll 类型时，必须传入 dropDownCols

`type` 值对应的展示类型含义

* dropDown-border-scroll 带有下拉的展现形式，带有底边移动动画效果，样式规范遵循 MXUI
* normal-border-scroll 无下拉的展现形式，带有底边移动动画效果，样式规范遵循 MXUI
* icon-bg-scroll 每一项带有图标的展现形式，带有背景移动动画效果，样式规范遵循 MXUI
* default-noAnim-scroll 默认可扩展的自定义展现，1.x.x 版本的基本功能
* normal-border 不可滚动的 tab 选项，带有底边移动动画效果，样式规范遵循 MXUI 
* icon-bg 每一项带有图标的展现形式，不可横向滚动，带有背景移动动画效果，样式规范遵循 MXUI
* icon-border 每一项带有图标的展现形式，不可横向滚动，带有背景移动动画效果，样式规范遵循 MXUI

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

## 不同 type 的使用场景


```jsx
// demo
import {Component, createElement, render} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Touchable from 'rax-touchable';
import TabHeader from 'rax-tabheader';
import ScrollView from 'rax-scrollview';

let styles = {
  container: {
    width: 750,
    height: 80,
  },
  item: {
    textAlign: 'center',
    fontSize: 28,
    height: '80rem',
    width: '233rem',
    backgroundColor: '#52bfe6',
    color: '#FFFFFF',
    position: 'relative'
  },
  select: {
    textAlign: 'center',
    fontSize: 28,
    height: '80rem',
    width: '233rem',
    backgroundColor: '#ff4200',
    color: '#FFFFFF',
    position: 'relative'
  },
}

let icon = 'https://img.alicdn.com/tfs/TB1J3O7QXXXXXbIapXXXXXXXXXX-75-75.png';

function renderItem(item, index) {
  return <View style={styles.item}><Text style={styles.text}>{item}</Text></View>;
}
function renderSelect(item, index) {
  return <View style={styles.select}><Text style={styles.text}>{item}</Text></View>;
}


class Example extends Component {
  
  onSelect = (index) => {
    console.log('select', index);
  }

  render() {
    return (
      <ScrollView>
        <TabHeader 
          style={styles.container} 
          dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8']} 
          onSelect={this.onSelect}
          selected={0}
          itemWidth={166}
          dropDownCols={4}
          type={'dropDown-border-scroll'}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={styles.container} 
          dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8', 'tab9']} 
          onSelect={this.onSelect}
          selected={4} // TODO 需要处理第一次 onselect
          itemWidth={130}
          dropDownCols={5}
          type={'dropDown-border-scroll'}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={styles.container} 
          dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5']} 
          type={'normal-border'}
          itemSelectedStyle={{
            color: 'green'
          }}
          animBuoyStyle={{
            borderColor: 'green'
          }}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={{
            ...styles.container,
            backgroundColor: 'yellow',
          }} 
          dataSource={['tab1', 'tab2', 'tab3']} 
          selected={2}
          type={'normal-border'}
          animBuoyStyle={{
            borderColor: 'black',
            height: 6,
            top: 74,
          }}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={styles.container} 
          dataSource={[
            {text: 'tab1', icon: icon},
            {text: 'tab2', icon: icon},
            {text: 'tab3', icon: icon}
          ]} 
          selected={1}
          containerStyle={{
            backgroundColor: '#9fff79'
          }}
          itemStyle={{
            width: (750 / 3) + 'rem',
            height: 112
          }}
          itemSelectedStyle={{
            color: 'green'
          }}
          animBuoyStyle={{
            borderColor: 'green'
          }}
          type={'icon-border'}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={styles.container} 
          dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8', 'tab9']} 
          selected={1}
          itemWidth={233}
          type={'normal-border-scroll'}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={styles.container} 
          dataSource={[
            {text: 'tab1', icon: icon},
            {text: 'tab2', icon: icon},
            {text: 'tab3', icon: icon},
            {text: 'tab4', icon: icon},
            {text: 'tab5', icon: icon},
            {text: 'tab6', icon: icon},
            {text: 'tab7', icon: icon},
            {text: 'tab8', icon: icon},
            {text: 'tab9', icon: icon}
          ]} 
          selected={1}
          itemWidth={233}
          type={'icon-bg-scroll'}
          itemStyle={{
            height: 112
          }}
          animBuoyStyle={{
            backgroundColor: 'blue'
          }}
        />
        <View style={{height: 200}} />
        <TabHeader 
          style={styles.container} 
          dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8', 'tab9']} 
          renderItem={renderItem} 
          renderSelect={renderSelect} 
          selected={5}
          type={'default-noAnim-scroll'}
          itemWidth={233}
        />
        <View style={{height: 200}} />
      </ScrollView>
    );
  }
}

render(<Example />);
```
