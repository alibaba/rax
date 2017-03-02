# Switch 开关按钮

Switch 是状态切换的开关按钮组件。

## 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onTintColor|String||设置开关打开的背景色|
|tintColor|String||设置开关关闭时的背景色|
|thumbTintColor|String||开关圆形按钮的背景色|
|disabled|Boolean||开关是否可交互  true|false|
|value|Boolean||开关默认状态开启或关闭  true|false|
|onValueChange|Function||值改变时调用此函数|

## 引用

```jsx
import {Switch, View, Text} from 'rax-components';
```

## 示例

```jsx
  state = {
    trueSwitchIsOn: true,
    falseSwitchIsOn: false
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>
           Swtich实例
        </Text>
        <Switch onTintColor={'green'} tintColor={'#ffffff'} thumbTintColor={'blue'}
          onValueChange={(value) =>this.setState({falseSwitchIsOn: value})}
          value={this.state.falseSwitchIsOn}/>
        <Switch
          onValueChange={(value) =>this.setState({trueSwitchIsOn: value})}
          value={this.state.trueSwitchIsOn}/>
      </View>
    );
  }
```
