# CheckBox 选择框

CheckBox 是基础的选择框，选择框用图片实现，支持用户使用自己的图片进行替换

![](https://gw.alicdn.com/tfs/TB1r5wbRVXXXXaNXFXXXXXXXXXX-255-77.gif)

## 安装

```bash
$ npm install rax-checkbox --save
```

## 引用

```jsx
import CheckBox from 'rax-checkbox';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| checked | Boolean |      | 选中状态 |
| checkedImage | String |      | 选中图片 |
| uncheckedImage | String |      | 非选中图片 |
| containerStyle | Object |      | 选择框容器样式 |
| checkboxStyle | Object |      | 选择框图片样式 |
| onChange | Function |      | 选择事件 |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import CheckBox from 'rax-checkbox';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
        <CheckBox 
          containerStyle={{
            marginTop: 10,
          }}
          onChange={(checked) => {
            console.log('checked', checked);
          }} />
      </View>
    );
  }
}

render(<App />);
```