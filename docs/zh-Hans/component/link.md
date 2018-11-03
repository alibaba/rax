# Link 链接

Link 是基础的链接组件，同 a 标签。它带有默认样式 `textDecoration: 'none'`。  

在浏览器中，同我们熟悉的 a 标签，使用 Link 标签并不能新开一个 `webview` ，它只是在当前的 `webview` 中做页面的跳转。

![](https://gw.alicdn.com/tfs/TB1rbYSRVXXXXbDaXXXXXXXXXXX-255-367.gif)

## 安装

```bash
$ npm install rax-link --save
```

## 引用

```jsx
import Link from 'rax-link';
```

## 属性

| 名称      | 类型       | 默认值  | 描述     |
| :------ | :------- | :--- | :----- |
| onPress | Function | null | 响应点击事件 |

同时支持任意自定义属性的透传

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Link from 'rax-link';

const styles = {
  container: {
    width: 750
  }
};

class App extends Component {
  render() {
    const url = "https://taobao.com";
    return (
      <View style={styles.container}>
        <Link href={url}>这是一个链接</Link>
      </View>
    );
  }
}

render(<App />);
```

```jsx
//demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';

class App extends Component {
  state = {
    timesPressed1: 0,
    timesPressed2: 0,
  };

  handlePress1 = () => {
    this.setState({
      timesPressed1: this.state.timesPressed1 + 1,
    });
  };

  handlePress2 = () => {
    this.setState({
      timesPressed2: this.state.timesPressed2 + 1,
    });
  };

  render() {
    var textLog1 = '';
    if (this.state.timesPressed1 > 1) {
      textLog1 = this.state.timesPressed1 + 'x onPress';
    } else if (this.state.timesPressed1 > 0) {
      textLog1 = 'onPress';
    }

    var textLog2 = '';
    if (this.state.timesPressed2 > 1) {
      textLog2 = this.state.timesPressed2 + 'x onPress';
    } else if (this.state.timesPressed2 > 0) {
      textLog2 = 'onPress';
    }

    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <Link onPress={this.handlePress1} href="https://github.com/alibaba/rax">Goto Github</Link>
          <View style={styles.logBox}>
            <Text>
              {textLog1}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <Link onPress={this.handlePress2} href="https://github.com/alibaba/rax">
            <Image style={{width: 400, height: 343}} source={{uri: 'https://camo.githubusercontent.com/27b9253de7b03a5e69a7c07b0bc1950c4976a5c2/68747470733a2f2f67772e616c6963646e2e636f6d2f4c312f3436312f312f343031333762363461623733613132336537386438323436636438316338333739333538633939395f343030783430302e6a7067'}} />
          </Link>
          <View style={styles.logBox}>
            <Text>
              {textLog2}
            </Text>
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
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};


render(<App />);
```
