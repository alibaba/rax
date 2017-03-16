# TextInput 文字输入

TextInput 是唤起用户输入的基础组件。  

当定义 multiline 输入多行文字时其功能相当于 textarea。 

## 安装

```bash
$ npm install rax-textinput --save 
```

## 引用

```jsx
import TextInput from 'rax-textinput';
```

## 属性

| 名称                 | 类型       | 默认值  | 描述                                       |
| :----------------- | :------- | :--- | :--------------------------------------- |
| multiline          | Boolean  |      | 定义该属性文本框可以输入多行文字                         |
| accessibilityLabel | String   |      | 为元素添加标识                                  |
| autoComplete       | Boolean  |      | 添加开启自动完成功能                               |
| autoFocus          | Boolean  |      | 添加开启获取焦点                                 |
| editable           | Boolean  |      | 默认为true 如果为fase则文本框不可编辑                  |
| keyboardType       | String   |      | 设置弹出哪种软键盘 可用的值有`default` `ascii-capable` `numbers-and-punctuation` `url` `number-pad` `phone-pad` `name-phone-pad` `email-address` `decimal-pad` `twitter` `web-search` `numeric` |
| maxLength          | Number   |      | 设置最大可输入值                                 |
| maxNumberOfLines   | Number   |      | 当文本框为mutiline时设置最多的行数                    |
| numberOfLines      | Number   |      | 同上设置行数                                   |
| placeholder        | String   |      | 设置文本框提示                                  |
| password           | Boolean  |      | 文本框内容密码显示                                |
| secureTextEntry    | Boolean  |      | 同上文本框内容密码显示                              |
| style              | String   |      | 设置样式                                     |
| value              | String   |      | 文本框的文字内容                                 |
| onBlur             | Function |      | 文本框失焦时调用此函数。`onBlur={() => console.log('失焦啦')}` |
| onFocus            | Function |      | 文本框获得焦点时调用此函数                            |
| onChange           | Function |      | 文本框内容变化时调用此函数                            |
| onInput            | Function |      | 文本框输入内容时调用此函数                            |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import TextInput from 'rax-textinput';

render(<TextInput
  placeholder={'Enter text to see events'}
  autoFocus multiline
  onFocus={() => alert('onFocus')}
  onBlur={() => alert('onBlur')}
  onInput={() => alert('onInput')}
  style={{
    width: 750,
    height: 100,
    borderColor: '#000',
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 0
  }}
/>);
```
