# Picker 选择框

Picker 是基础的下拉选择框，调用系统原生选择框实现，可以自定义选择项的内容。

![](https://gw.alicdn.com/tfs/TB15fZyRVXXXXbcXXXXXXXXXXXX-240-390.jpg)

## 安装

```bash
$ npm install rax-picker --save
```

## 引用

```jsx
import Picker from 'rax-picker';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| selectedValue | String |      | 选中值 |
| onValueChange | Function |      | 选项切换 |

选项内容用 Picker.Item 进行定义，示例：

```
<Picker.Item value={'somevalue'} />
```

## 基本示例

```jsx
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Picker from 'rax-picker';

class App extends Component {
  state = {
    selectedValue: '女'
  };
  render() {
    return (
      <View style={{ width: 750 }}>
        <Text>选择性别</Text>
        <Picker 
          selectedValue={this.state.selectedValue}
          onValueChange={(value, index) => {
            this.setState({selectedValue: value});
          }}>
          <Picker.Item value={'男'} label={'男性'} />
          <Picker.Item value={'女'} label={'女性'} />
        </Picker>
      </View>
    );
  }
}

render(<App />);
```