# Text 文本显示

Text 用于显示文本，在 web 中实际上是一个 span 标签而非 p 标签。 

Text 标签默认展现样式会占满一行，如果有富文本的需求可以 Text 嵌套使用。

![](https://gw.alicdn.com/tfs/TB1CRrMRVXXXXXIapXXXXXXXXXX-259-276.jpg)

## 安装

```bash
$ npm install rax-text --save
```

## 引用

```jsx
import Text from 'rax-text';
```

## 属性

| 名称            | 类型       | 默认值  | 描述       |
| :------------ | :------- | :--- | :------- |
| numberOfLines | Number   |      | 行数       |


## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Text from 'rax-text';

render(<Text style={{
  color: '#3c3c3c',
  fontSize: '50rem'
}}>文本内容 </Text>);
```

## 复杂示例

```jsx
// demo

import {createElement, render, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

class App extends Component {

  state = {
    timesPressed: 0,
  };

  textOnPress = () => {
    this.setState({
      timesPressed: this.state.timesPressed + 1,
    });
  };

  render() {
    var textLog = '';
    if (this.state.timesPressed > 1) {
      textLog = this.state.timesPressed + 'x text onPress';
    } else if (this.state.timesPressed > 0) {
      textLog = 'text onPress';
    }

    return (
      <View style={styles.root}>
        <View style={{...styles.container, ...{
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}}>
          <Text>文字</Text>
          <Text style={{
            color: '#ff4200'
          }}>混排</Text>
        </View>

        <View style={styles.container}>
          <Text numberOfLines={1} style={{
            width: 300,
            textOverflow: 'ellipsis',
          }}>单行文本超出被截断的文本</Text>

          <Text numberOfLines={2} style={{
            width: 300,
            textOverflow: 'ellipsis',
          }}>多行文本超出被截断的文本，超出被截断的文本，超出被截断的文本，超出被截断的文本</Text>
        </View>

        <View style={styles.container}>
          <Text style={{textDecoration: 'underline'}}>
            文本下划线
          </Text>
          <Text style={{textDecorationLine: 'none'}}>
            无下划线
          </Text>
          <Text style={{textDecoration: 'line-through'}}>
            文本删除线
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={{lineHeight: '120rem'}}>
            行高 120rem，多行文本文本折行效果 多行文本文本折行效果
          </Text>
        </View>

      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20,
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
  textBlock: {
    fontWeight: '500',
    color: 'blue',
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

## 富文本

目前富文本不支持局部刷新，如果二次渲染会有布局错乱的问题。  
参考解决方案是在 shouldComponentUpdate 的时机 return 掉避免二次渲染。  
另外能用 flex 布局解决的，尽量不要用富文本

```jsx
//demo
import {createElement, Component, render} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Image from 'rax-image';
import Link from 'rax-link';
class App extends Component {

  render() {
    return (
      <View>
        <p style={{
          color: 'red',
          textOverflow: 'ellipsis'
        }}>
          <a href="//www.taobao.com">
            <span>TAOBAO</span>
          </a>
          <img style={{width:300, height:300}} src="//www.fresher.ru/manager_content/images2/kadry-veka/big/2-1.jpg"></img>
          <span>富文本</span>
        </p>
        
        <Text>
          <Link style={{color:'blue'}} href="">
            <Text>TAOBAO</Text>
          </Link>
          <Image  style={{width:300, height:300}} source={{uri: '//www.fresher.ru/manager_content/images2/kadry-veka/big/2-1.jpg'}} />
          <Text>富文本</Text> 

        </Text>
      </View>
    );
  }
}

render(<App />);

```
