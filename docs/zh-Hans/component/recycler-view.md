# RecyclerView

`ScrollView` 的同门师兄，在 Weex 下是对 `list` 与 `cell` 的包装，其具有复用内部组件来提供性能的机制。

![](https://gw.alicdn.com/tfs/TB1Cf_ZRVXXXXa8XVXXXXXXXXXX-255-265.gif)

## 安装

```bash
$ npm install rax-recyclerview --save
```

## 引用

```jsx
import RecyclerView from 'rax-recyclerview';
```

## 属性

| 名称                    | 类型       | 默认值  | 描述                       |
| :-------------------- | :------- | :--- | :----------------------- |
| onEndReached          | Function |      | 滚动到底部触发事件，将修改后的数据付给 data |
| onEndReachedThreshold | Number   | 500  | 距离多少开始加载下一屏，数字单位默认 rem   |
| onScroll              | Function |      | 滚动时触发的事件，返回当前滚动的水平垂直距离 |


## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import RecyclerView from 'rax-recyclerview';
import Touchable from  'rax-touchable';

class Thumb extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <RecyclerView.Cell>
        <View style={styles.button}>
          <View style={styles.box} />
        </View>
      </RecyclerView.Cell>
    );
  }
}

class Row extends Component {
  handleClick = (e) => {
    this.props.onClick(this.props.data);
  };

  render() {
    return (
     <Touchable onPress={this.handleClick} >
        <View style={styles.row}>
          <Text style={styles.text}>
            {this.props.data.text + ' (' + this.props.data.clicks + ' clicks)'}
          </Text>
        </View>
      </Touchable>
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
        <RecyclerView
          ref={(scrollView) => {
            this.scrollView = scrollView;
          }}
          style={{
            height: 500
          }}
          onEndReached={() => this.setState({scrollViewEventLog: true})}>

          <RecyclerView.Header style={styles.sticky}>
            <Text>Sticky view is not header</Text>
          </RecyclerView.Header>

          <RecyclerView.Header>
            <View style={styles.sticky}>
              <Text>Sticky view must in header root</Text>
            </View>
          </RecyclerView.Header>

          {THUMBS.map(createThumbRow)}

        </RecyclerView>

        <Touchable
          style={styles.button}
          onPress={() => this.scrollView.scrollTo({y: 0})}>
          <Text>Scroll to top</Text>
        </Touchable>

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
  row: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 20,
    margin: 5,
  },
  text: {
    alignSelf: 'center',
    color: 'black',
  },
  refreshView: {
    height: 80,
    width: 750,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshArrow: {
    fontSize: 30,
    color: '#45b5f0'
  },
};

render(<App />);
```