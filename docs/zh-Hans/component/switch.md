# Switch 开关按钮

Switch 是状态切换的开关按钮组件，具有默认的展现样式。

![](https://gw.alicdn.com/tfs/TB1Nj.nRVXXXXcMXXXXXXXXXXXX-255-175.gif)

## 安装

```bash
$ npm install rax-switch --save
```

## 引用

```jsx
import Switch from 'rax-switch';
```

## 属性

| 名称             | 类型       | 默认值  | 描述                |
| :------------- | :------- | :--- | :---------------- |
| onTintColor    | String   |      | 设置开关打开的背景色        |
| tintColor      | String   |      | 设置开关关闭时的背景色       |
| thumbTintColor | String   |      | 开关圆形按钮的背景色        |
| disabled       | Boolean  |      | 开关是否可交互  true     |
| value          | Boolean  |      | 开关默认状态开启或关闭  true |
| onValueChange  | Function |      | 值改变时调用此函数         |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Switch from 'rax-switch';  

const styles = {
  container: { width: 750 }
};

class App extends Component {
  state = {
    trueSwitchIsOn: true,
    falseSwitchIsOn: false
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Swtich实例</Text>
        <Switch onTintColor="green" tintColor="#ffffff" thumbTintColor="blue"
          onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
          value={this.state.falseSwitchIsOn}/>
        <Switch
          onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
          value={this.state.trueSwitchIsOn}/>
      </View>
    );
  }
}

render(<App />);
```
