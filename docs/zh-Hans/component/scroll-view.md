# ScrollView 滚动容器

ScrollView 是一个包装了滚动操作的组件。一般情况下需要一个确定的高度来保证 ScrollView 的正常展现。

![](https://gw.alicdn.com/tfs/TB1SV3iRVXXXXcAXpXXXXXXXXXX-255-383.gif)  

## 安装

```bash
$ npm install rax-scrollview --save
```

## 引用

```jsx
import ScrollView from 'rax-scrollview';
```

## 属性

| 名称                           | 类型      | 默认值  | 描述                                       |
| :----------------------------- | :------- | :--- | :--------------------------------------- |
| scrollEventThrottle            | Number   |      | 这个属性控制在滚动过程中，scroll事件被调用的频率（默认值为100），用于滚动的节流 |
| horizontal                     | Boolean  |      | 设置为横向滚动                                  |
| showsHorizontalScrollIndicator | Boolean  |      | 是否允许出现水平滚动条，默认true                       |
| showsVerticalScrollIndicator   | Boolean  |      | 是否允许出现垂直滚动条，默认true                       |
| onEndReachedThreshold          | Number   |      | 设置加载更多的偏移，默认值为500                        |
| onEndReached                   | Function |      | 滚动区域还剩 `onEndReachedThreshold` 的长度时触发    |
| onScroll                       | Function |      | 滚动时触发的事件，返回当前滚动的水平垂直距离 |

## 方法

| 名称  | 描述  |
| :------ | :------- |
| scrollTo    | 滚动到指定位置（参数示例：{x:0, y:100}） |

## 使用示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableOpacity from 'rax-touchable';
import ScrollView from 'rax-scrollview';

class Thumb extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <View style={styles.button}>
        <View style={styles.box} />
      </View>
    );
  }
}

let THUMBS = [];
for (let i = 0; i < 20; i++) THUMBS.push(i);
let createThumbRow = (val, i) => <Thumb key={i} />;

class App extends Component {
  state = {
    horizontalScrollViewEventLog: false,
    scrollViewEventLog: false,
  };

  render() {
    return (
      <View style={styles.root}>
      <View style={styles.container}>
        <ScrollView
          ref={(scrollView) => {
            this.horizontalScrollView = scrollView;
          }}
          style={{
            height: 100,
          }}
          horizontal={true}
          onEndReached={() => this.setState({horizontalScrollViewEventLog: true})}
        >
          {THUMBS.map(createThumbRow)}
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.horizontalScrollView.scrollTo({x: 0})}>
          <Text>Scroll to start</Text>
        </TouchableOpacity>

        <View style={styles.eventLogBox}>
          <Text>{this.state.horizontalScrollViewEventLog ? 'onEndReached' : ''}</Text>
        </View>

      </View>

      <View style={styles.container}>
        <ScrollView
          ref={(scrollView) => {
            this.scrollView = scrollView;
          }}
          style={{
            height: 500,
          }}
          onEndReached={() => this.setState({scrollViewEventLog: true})}>

          <View>
            <View style={styles.sticky}>
              <Text>Cannot sticky</Text>
            </View>
          </View>

          <View style={styles.sticky}>
            <Text>Sticky view must in ScrollView root</Text>
          </View>

          {THUMBS.map(createThumbRow)}

        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.scrollView.scrollTo({y: 0})}>
          <Text>Scroll to top</Text>
        </TouchableOpacity>

        <View style={styles.eventLogBox}>
          <Text>{this.state.scrollViewEventLog ? 'onEndReached' : ''}</Text>
        </View>

      </View>

      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20
  },
  sticky: {
    position: 'sticky',
    width: 750,
    backgroundColor: '#cccccc'
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  box: {
    width: 64,
    height: 64,
  },
  eventLogBox: {
    padding: 10,
    margin: 10,
    height: 80,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};



render(<App/ >);
```
