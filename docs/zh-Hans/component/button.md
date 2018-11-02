# Button 按钮

Button 是基础的按钮组件。内部实现依赖 `<Touchable>` 支持 onPress 定义的点击事件。  

Button 带有默认样式，同时也支持传入 children 替换原有结构。

![](https://gw.alicdn.com/tfs/TB1xub4RVXXXXbzXVXXXXXXXXXX-255-334.gif)

## 安装

```bash
$ npm install rax-button --save
```

## 引用

```jsx
import Button from 'rax-button';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | 点击事件 |

同时支持任意自定义属性的透传

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
        <Button onPress={(evt) => { alert('你好'); }}>点我</Button>
        <Button onPress={(evt) => { alert('你好'); }}>
        	<View>
        		<Text>点我</Text>
        	</View>
        </Button>
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
import Button from 'rax-button';

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
          <Text>默认展现</Text>
          <Button onPress={this.handlePress1}>Button</Button>
          <View style={styles.logBox}>
            <Text>
              {textLog1}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text>自定义效果</Text>
          <Button onPress={this.handlePress2}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#666666',
              padding: 16,
            }}>
              <Image style={{width: 36, height: 36, marginRight: 6}} source={{uri: '//img.alicdn.com/L1/461/1/126ba1d7397f0024a6fa785d72402ff112ee179e'}} />
              <Text>Pokeball</Text>
            </View>
          </Button>

          <View style={styles.logBox}>
            <Text>
              {textLog2}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text>属性控制</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              title="This looks great!"
            />
            <Button
              title="Ok!"
              color="#841584"
            />
          </View>
        </View>

      </View>
    );
  }
}


let styles = {
  root: {
    width: 750,
    paddingTop:20
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