# TextInput 文字输入

TextInput 是唤起用户输入的基础组件。  

当定义 multiline 输入多行文字时其功能相当于 textarea。 

![](https://gw.alicdn.com/tfs/TB1zgIwRVXXXXbmXXXXXXXXXXXX-255-296.gif)

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
| value              | String   |      | 文本框的文字内容 (受控)                                 |
| defaultValue       | String   |      | 文本框的文字内容（非受控）                                |
| onBlur             | Function |      | 文本框失焦时调用此函数。`onBlur={() => console.log('失焦啦')}` |
| onFocus            | Function |      | 文本框获得焦点时调用此函数                            |
| onChange           | Function |      | 文本框内容变化时调用此函数（用户输入完成时触发。通常在 blur 事件之后） |
| onInput            | Function |      | 文本框输入内容时调用此函数                            |


## 方法

* focus 获取焦点方法
* blur 失交方法
* clear 清除文本内容

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TextInput from 'rax-textinput';
import Button from 'rax-button';

class TextAreaDemo extends Component {
  state = {
    text: 'Hello #World , Hello #Rax , Hello #天天好心情'
  };

  render() {
    let delimiter = /\s+/;

    // split string
    let _text = this.state.text;
    let token, index, parts = [];
    while (_text) {
      delimiter.lastIndex = 0;
      token = delimiter.exec(_text);
      if (token === null) {
        break;
      }
      index = token.index;
      if (token[0].length === 0) {
        index = 1;
      }
      parts.push(_text.substr(0, index));
      parts.push(token[0]);
      index = index + token[0].length;
      _text = _text.slice(index);
    }
    parts.push(_text);

    let hashtags = [];
    parts.forEach((text) => {
      if (/^#/.test(text)) {
        hashtags.push(<Text key={text} style={styles.hashtag}>{text}</Text>);
      }
    });

    return (
      <View style={styles.container}>
        <TextInput
          multiline={true}
          style={styles.multiline}
          value={this.state.text}
          onChangeText={(text) => {
            this.setState({text});
          }} />
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {hashtags}
        </View>
      </View>
    );
  }
}

class App extends Component {

  state = {
    value: 'I am value',
    curText: '<No Event>',
    prevText: '<No Event>',
    prev2Text: '<No Event>',
    prev3Text: '<No Event>',
  };

  updateText = (text) => {
    this.setState((state) => {
      return {
        curText: text,
        prevText: state.curText,
        prev2Text: state.prevText,
        prev3Text: state.prev2Text,
      };
    });
  };

  render() {
    // define delimiter

    return (
      <View style={styles.root}>
        <View style={styles.container}>

          <TextInput
            autoCapitalize="none"
            placeholder="Enter text to see events"
            autoCorrect={false}
            onFocus={() => this.updateText('onFocus')}
            onBlur={() => this.updateText('onBlur')}
            onChange={(event) => this.updateText(
              'onChange text: ' + event.nativeEvent.text
            )}
            onInput={(event) => this.updateText(
              'onInput text: ' + event.nativeEvent.text
            )}
            style={styles.default}
          />

          <Text style={styles.eventLabel}>
            {this.state.curText}{'\n'}
            (prev: {this.state.prevText}){'\n'}
            (prev2: {this.state.prev2Text}){'\n'}
            (prev3: {this.state.prev3Text})
          </Text>
        </View>

        <View style={styles.container}>
          <TextInput
            placeholder="Enter text to see events"
            value={this.state.value}
            ref="input"
            style={{
              width: 600,
              marginTop: 20,
              borderWidth: '1px',
              borderColor: '#dddddd',
              borderStyle: 'solid',
            }}
            />

          <Button
            style={{
              marginTop: 20,
            }}
            onPress={() => this.refs.input.clear()}
          >
            Reset
          </Button>

        </View>

        <TextAreaDemo />
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
  default: {
    borderWidth: 1,
    borderColor: '#0f0f0f',
    flex: 1,
  },
  eventLabel: {
    margin: 3,
    fontSize: 24,
  },
  multiline: {
    borderWidth: 1,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 26,
    height: 100,
    padding: 8,
    marginBottom: 8,
  },
  hashtag: {
    color: 'blue',
    margin: 10,
    fontWeight: 'bold',
  },
};

render(<App />);
```
